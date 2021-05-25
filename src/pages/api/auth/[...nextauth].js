import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const ACCOUNT_TOKEN_PROPERTIES = [
  'accessToken',
  'refreshToken'
];

export default NextAuth({
  providers: [
    Providers.Twitter({
      clientId: process.env.TWITTER_CONSUMER_KEY,
      clientSecret: process.env.TWITTER_CONSUMER_SECRET
    })
  ],
  callbacks: {
    async jwt(token, user, account = {}, profile, isNewUser) {
      ACCOUNT_TOKEN_PROPERTIES.forEach(property => {
        if (account[property]) {
          token[property] = account[property];
        }
      });
      return token;
    },
  },
  secret: process.env.APP_SECRET
})