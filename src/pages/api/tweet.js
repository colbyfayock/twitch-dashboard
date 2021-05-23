const { tweet } = require('@lib/twitter');

const tag = '[Tweet]';

export default async (req, res) => {
  const body = JSON.parse(req.body) || {};
  const { status, media } = body;

  try {
    await tweet({
      status,
      media
    });
  } catch(e) {
    console.log(`${tag} Failed to post tweet - ${e.message}`);
    return res.status(400).json({
      status: e.message
    });
  }

  return res.status(200).json({
    status: 'Ok'
  });
}