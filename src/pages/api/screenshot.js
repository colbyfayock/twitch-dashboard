const twitch = require('twitch-m3u8');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

const tag = '[Screenshot]';
const OUTPUT_DIRECTORY = 'public/screenshots'

export default async (req, res) => {
  const body = JSON.parse(req.body) || {};
  const { streamId } = body;

  if ( typeof streamId !== 'string' ) {
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
    return res.status(204).json({
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
  const folder = OUTPUT_DIRECTORY;

  const screenshotConfig = {
    timestamps: [0],
    filename,
    folder,
    size: '1920x1080'
  };

  console.log(`${tag} Capturing screenshot with config: ${JSON.stringify(screenshotConfig, null, 2)}`);

  ffmpeg(ts.body).screenshots(screenshotConfig);

  console.log(`${tag} Successfully download screenshot to ${screenshotConfig.folder}/${screenshotConfig.filename}`);

  return res.status(200).json({
    data: {
      filename,
      folder
    },
    status: 'Ok'
  })
}