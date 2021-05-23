# Twitch Dashboard

Next.js app that has some simple helpers while managing a Twitch stream.

## Current Features
- Grab a screenshot of active stream
- Post a tweet with the active stream screenshot as an attachment

## Getting Started
- Create `.env.local` in the root of the application with:
```
TWITTER_CONSUMER_KEY="[Your Twitter Consumer Key]"
TWITTER_CONSUMER_SECRET="[Your Twitter Consumer Secret]"
TWITTER_ACCESS_TOKEN_KEY="[Your Twitter Access Token Key]"
TWITTER_ACCESS_TOKEN_SECRET="[Your Twitter Access Token Secret]"
```
- `yarn install`
- `yarn dev`

The app is intended to be ran locally as runs off of the local filesystem. While it might work on a deployed node.js enviornment, it hasn't been tested.
