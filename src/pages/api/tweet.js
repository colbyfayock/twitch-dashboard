const { tweet } = require('@lib/twitter');
import { getSession } from 'next-auth/client'
import { getToken } from 'next-auth/jwt';

const tag = '[Tweet]';

const secret = process.env.APP_SECRET;

export default async (req, res) => {
  const session = await getSession({ req })
  const body = JSON.parse(req.body) || {};
  const { status, media } = body;

  const token = await getToken({ req, secret });
  const accessToken = token.accessToken;
  const refreshToken = token.refreshToken;

  console.log(`${tag} Posting tweet`);

  try {
    await tweet({
      status,
      media,
      accessToken,
      refreshToken
    });
  } catch(e) {
    console.log(`${tag} Failed to post tweet - ${e.message}`);
    return res.status(400).json({
      status: e.message
    });
  }

  console.log(`${tag} Successfully posted tweet`);

  return res.status(200).json({
    status: 'Ok'
  });
}