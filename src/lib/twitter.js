const Twitter = require('twitter-lite');
const twitterText = require('twitter-text');

let client = {};

/**
 * getTwitterClient
 */

function getTwitterClient({ accessToken, refreshToken, subdomain = 'api' }) {
  if ( !client[subdomain] ) {
    client[subdomain] = new Twitter({
      subdomain,
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: accessToken,
      access_token_secret: refreshToken
    });
  }

  return client[subdomain];
}

module.exports.getTwitterClient = getTwitterClient;


/**
 * tweet
 * @description Manage setting up and tweeting the given status
 */

async function tweet({ status, media, accessToken, refreshToken }) {
  const options = {
    status,
  }

  let uploadedMedia;
  let request;

  const { valid } = twitterText.parseTweet(status) || {};

  if ( !valid ) {
    throw new Error('Failed to post tweet - invalid status');
  }

  if ( typeof media === 'string' && media.length !== 0 ) {
    uploadedMedia = await uploadTwitterMedia({
      accessToken,
      refreshToken,
      media
    });
  }

  if ( uploadedMedia ) {
    options.media_ids = uploadedMedia.media_id_string;
  }

  request = await updateTwitterStatus({
    ...options,
    accessToken,
    refreshToken
  });
}

module.exports.tweet = tweet;


/**
 * uploadTwitterMedia
 * @description Upload given media to Twitter and return as base64
 */

async function uploadTwitterMedia({ accessToken, refreshToken, media }) {
  const errorBase = 'Failed to upload media to Twitter';

  const twitter = getTwitterClient({
    subdomain: 'upload',
    accessToken,
    refreshToken
  });
  const request = await fetch(media);
  const buffer = await request.buffer();
  const mediaBase64 = Buffer.from(buffer).toString('base64');

  const options = {
    media_data: mediaBase64,
  };

  let response;

  try {
    response = await twitter.post('media/upload', options);
  } catch(e) {
    throw new Error(`${errorBase}: ${e.message}`);
  }

  return response;
}

module.exports.uploadTwitterMedia = uploadTwitterMedia;


/**
 * updateTwitterStatus
 * @description Posts the given status update to twitter
 */

async function updateTwitterStatus({ accessToken, refreshToken, ...options } = {}) {
  const errorBase = 'Failed to update Twitter status';

  const twitter = getTwitterClient({
    accessToken,
    refreshToken
  });

  let response;

  try {
    response = await twitter.post('statuses/update', options);
  } catch(e) {
    throw new Error(`${errorBase}: ${e.message}`);
  }

  return response;
}

module.exports.updateTwitterStatus = updateTwitterStatus;