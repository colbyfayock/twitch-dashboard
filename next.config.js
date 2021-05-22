const withPlugins = require('next-compose-plugins');
const images = require('next-images');
const siteConfig = require('./site.config.js');

const { env } = siteConfig;

module.exports = withPlugins([
  images
], {
  env: {
    NEXT_PUBLIC_GA_PROPERTY_ID: env.gaPropertyId
  }
});