const fs = require('fs').promises;
const FormData = require('form-data');
const path = require('path');
const twitch = require('twitch-m3u8');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

const { getScreenshot } = require('@lib/media');

const tag = '[Screenshot]';

export default async (req, res) => {
  const body = JSON.parse(req.body) || {};
  const { streamId } = body;

  if ( typeof streamId !== 'string' ) {
    console.log(`${tag} Input error - invalid streamId`);
    return res.status(500).json({
      status: 'Invalid streamId'
    })
  }

  ffmpeg.setFfmpegPath(ffmpegPath);

  console.log(`${tag} Getting streams for ${streamId}`);

  let streams;

  try {
    streams = await twitch.getStream(streamId);
  } catch(e) {
    console.log(`${tag} Failed to get stream - ${e.message}`);
    return res.status(400).json({
      status: e.message
    })
  }

  // stream: the best resolution of the stream

  const stream = streams[0];

  console.log(`${tag} Downloading m3u8 at stream quality: ${stream.quality}`);

  const m3u8 = await fetch(stream.url);
  const m3u8Text = await m3u8.text();

  const tsUrls = m3u8Text.split(/\r?\n/).filter(line => line.startsWith('http'));
  const lastTsUrl = tsUrls[tsUrls.length - 1];

  console.log(`${tag} Downloading .ts: ${lastTsUrl}`);

  const ts = await fetch(lastTsUrl);

  const filename = `${streamId}-${new Date().toISOString()}.png`;
  const folder = process.env.TMP_DIRECTORY;

  const screenshotConfig = {
    timestamps: [0],
    filename,
    folder,
    size: '1920x1080'
  };

  console.log(`${tag} Capturing screenshot with config: ${JSON.stringify(screenshotConfig, null, 2)}`);

  await getScreenshot(ts.body, screenshotConfig);

  const file = await fs.readFile(path.join(folder, filename));

  const formData = new FormData()

  formData.append('type', 'file')
  formData.append('image', file)

  let response;

  try {
    response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        Accept: 'application/json'
      },
      body: formData
    });
    response = await response.json();
  } catch(e) {
    console.log(`${tag} Failed to upload to Imgur - ${e.message}`);
    return res.status(400).json({
      status: e.message
    })
  }

  const { data: image } = response;

  console.log(`${tag} Successfully uploaded image to ${image.link}`);

  return res.status(200).json({
    data: {
      url: image.link
    },
    status: 'Ok'
  })
}