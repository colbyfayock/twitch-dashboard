# Twitch Dashboard

Next.js app that has some simple helpers while managing a Twitch stream.

## Current Features
- Grab a screenshot of active stream
- Post a tweet with the active stream screenshot as an attachment

## Getting Started
- Create `.env.local` in the root of the application with:
```
TWITTER_CONSUMER_KEY="[Your Key]"
TWITTER_CONSUMER_SECRET="[Your Secret]"
TMP_DIRECTORY="[Your Environment's Temporary Directory]"
NEXTAUTH_URL="[Your URL]"
APP_SECRET="[Your App Secret]"
```
- `yarn install`
- `yarn dev`

Currently works deployed to Vercel.

## Setup

### Twitter Credentials & Configuration
- Create and register a new App at: https://developer.twitter.com/
- Save your API Key and API Secret Key (these are also known as Consumer keys)
- Under "App permissions", enable Read and Write
- Under "Authentication settings", enable 3-legged OAuth and "Request email address from users"
- While developling locally, callback URL should be http://localhost:3000
- Fill in website, terms, and privacy URLs as appropriate (can be public homepage)

### Temporary Directory
When developling locally, your temporary directory should be something writable on your local environment.

For instance, if you're using a Mac, it may look like:
```
TMP_DIRECTORY="/Users/[Your Username]/path/to/twitch-dashboard/tmp"
```

When deployed, if using Vercel, the temporary directory should look like:
```
TMP_DIRECTORY="/tmp"
```

Vercel permits temporary storage up to a few hundred MBs which in this case is used while uploading Twitch snapshots.

## Next Auth URL
This should be where your authentication service is being served, which in this case, is likely http://localhost:3000 when developing and your production URL where the app is deployed.

## App Secret
Secret, randomized string for extra security measures between the app and authentication.