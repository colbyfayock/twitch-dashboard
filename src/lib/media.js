const ffmpeg = require('fluent-ffmpeg');

/**
 * getScreenshot
 * @description
 */

function getScreenshot(body, options) {
  return new Promise((resolve, reject) => {
    ffmpeg(body)
      .screenshots(options)
      .on('end', () => {
        console.log('end');
        resolve()
      });
  })
}

module.exports.getScreenshot = getScreenshot;