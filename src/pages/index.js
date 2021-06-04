import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import twitterText from 'twitter-text';
import { signIn, signOut, useSession } from 'next-auth/client'
import { FaUser, FaTwitter } from 'react-icons/fa';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';
import FeatureList from '@components/FeatureList';
import Details from '@components/Details';
import Video from '@components/Video';
import Form from '@components/Form';

import styles from '@styles/pages/Home.module.scss'

const defaultScreenshot = {
  url: null,
  state: 'ready'
}

const defaultTweet = {
  state: 'ready'
}

export default function Home() {
  const [session, loading] = useSession();

  const [screenshot, updateScreenshot] = useState(defaultScreenshot);
  const screenshotIsLoading = screenshot.state === 'loading';

  const [tweet, updateTweet] = useState(defaultTweet);
  const tweetIsLoading = tweet.state === 'loading';

  /**
   * handleOnSignIn
   */

  function handleOnSignIn(e) {
    e.preventDefault();
    signIn();
  }

  /**
   * TODO: Set up endpoint to post tweet, should grab local image to upload based on path
   * TODO: Add validation to avoid tweets that are too long
   * TODO: Save past screenshots to localstorage
   * TODO: Clientside error handling
   */

  /**
   * handleOnSubmitScreenshot
   */

  async function handleOnSubmitScreenshot(e) {
    e.preventDefault();

    updateScreenshot({
      url: null,
      state: 'loading'
    });

    const formData = {};

    Array.from(e.currentTarget.elements).forEach(field => {
      if ( !field.name ) return;
      formData[field.name] = field.value;
    });

    // Clean off the hostname if entered value is a URL

    formData.streamId = formData.streamId.replace(/.+twitch.tv\//, '');

    const streamData = {
      streamId: formData.streamId
    }

    updateScreenshot(prev => ({
      ...prev,
      streamId: streamData.streamId
    }));

    let response;
    let json;

    try {
      response = await fetch('/api/screenshot', {
        method: 'POST',
        body: JSON.stringify(streamData)
      });

      json = await response.json().catch(e => {
        const error = e;
        throw error;
      });

      if ( !response.ok ) {
        throw new Error(json.status || 'Uknown error');
      }
    } catch(e) {
      updateScreenshot(prev => ({
        ...prev,
        state: 'error',
        error: e.message
      }));
      return;
    }

    const { data } = json;

    updateScreenshot(prev => ({
      ...prev,
      url: data.url,
      state: 'ready'
    }));
  }

  /**
   * handleOnSubmitTweet
   */

  async function handleOnSubmitTweet(e) {
    typeof e.preventDefault === 'function' && e.preventDefault();

    if ( !session ) {
      updateScreenshot(prev => ({
        ...prev,
        data: null,
        state: 'error',
        error: 'No session found!'
      }));
      return;
    }

    updateTweet({
      data: null,
      state: 'loading'
    });

    const formData = {};

    Array.from(e.currentTarget.elements).forEach(field => {
      if ( !field.name ) return;
      formData[field.name] = field.value;
    });

    const tweetData = {
      status: formData.tweetMessage,
      media: screenshot.url
    }

    try {
      await fetch('/api/tweet', {
        method: 'POST',
        body: JSON.stringify(tweetData)
      });
    } catch(e) {
      updateScreenshot(prev => ({
        ...prev,
        state: 'error',
        error: e.message
      }));
      return;
    }

    updateTweet({
      data: tweetData,
      state: 'ready'
    });
  }

  /**
   *
   */

  function handleOnTweetKeyPress(e) {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleOnSubmitTweet({
        currentTarget: e.currentTarget.form
      });
    }
  }

  return (
    <Layout>
      <Head>
        <title>Twitch Dashboard</title>
        <meta name="description" content="Helpers!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section className={styles.sessionSection}>
        <Container className={styles.sessionContainer}>
          <h1>Twitch Screenshot</h1>
          <p className={styles.sessionSignIn}>
            {!session && (
              <Button onClick={handleOnSignIn}>
                <FaTwitter title="Twitter" /> Sign In
              </Button>
            )}
            {session && (
              <>
                {session.user.email}
                <Button onClick={() => signOut()}>
                  <FaTwitter aria-label="Twitter" /> Sign Out
                </Button>
              </>
            )}
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className={styles.twitch}>
            <div className={styles.forms}>
              <Form onSubmit={handleOnSubmitScreenshot}>
                <h2>Get Screenshot</h2>
                <p>
                  <label htmlFor="streamID">Stream ID (user / channel name)</label>
                  <input id="streamID" type="text" name="streamId" required />
                </p>
                <p>
                  <Button disabled={screenshotIsLoading}>
                    { !screenshotIsLoading && !screenshot.url && 'Get Screenshot' }
                    { !screenshotIsLoading && screenshot.url && 'Refresh' }
                    { screenshotIsLoading && 'Loading' }
                  </Button>
                </p>
              </Form>

              {screenshot.url && (
                <Form onSubmit={handleOnSubmitTweet}>
                  <h2 className={styles.tweetHeader}>
                    Tweet
                    {session && (
                      <span className={styles.tweetHeaderAs}>
                        <FaUser /> { session.user.name }
                      </span>
                    )}
                  </h2>
                  {session && (
                    <>
                      <p>
                        <label htmlFor="tweetMessage">Message</label>
                        <textarea id="tweetMessage" name="tweetMessage" onKeyPress={handleOnTweetKeyPress} />
                      </p>
                      <p>
                        <Button disabled={tweetIsLoading}>
                          { !tweetIsLoading && 'Post' }
                          { tweetIsLoading && 'Loading' }
                        </Button>
                      </p>
                      <p>
                        Press Shift + Enter to submit.
                      </p>
                    </>
                  )}
                  {!session && (
                    <p>
                      <a href="#" onClick={handleOnSignIn}>Sign in to Twitter</a> to continue!
                    </p>
                  )}
                </Form>
              )}
            </div>
            <div className={styles.preview} data-screenshot-state={screenshot.state}>
              <figure>
                <div className={styles.previewImage}>
                  {screenshot.url && <img src={screenshot.url} /> }
                </div>
                {screenshot.url && (
                  <figcaption>
                    <FaUser /> { screenshot.streamId }
                  </figcaption>
                )}
                {screenshot.state === 'error' && (
                  <>
                    <figcaption>{ screenshot.error }</figcaption>
                  </>
                )}
              </figure>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  )
}
