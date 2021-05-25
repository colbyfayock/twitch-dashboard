import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import twitterText from 'twitter-text';
import { signIn, signOut, useSession } from 'next-auth/client'

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';
import FeatureList from '@components/FeatureList';
import Details from '@components/Details';
import Video from '@components/Video';
import Form from '@components/Form';

import styles from '@styles/pages/Home.module.scss'

export default function Home() {
  const [session, loading] = useSession();
  const [screenshot, updateScreenshot] = useState(null);

  /**
   * TODO: Set up endpoint to post tweet, should grab local image to upload based on path
   * TODO: Add validation to avoid tweets that are too long
   * TODO: Save past screenshots to localstorage
   * TODO: Clientside error handling
   */

  async function handleOnSubmitScreenshot(e) {
    e.preventDefault();

    updateScreenshot(null);

    const formData = {};

    Array.from(e.currentTarget.elements).forEach(field => {
      if ( !field.name ) return;
      formData[field.name] = field.value;
    });

    const streamData = {
      streamId: formData.streamId
    }

    const response = await fetch('/api/screenshot', {
      method: 'POST',
      body: JSON.stringify(streamData)
    });
    const { data } = await response.json();

    if ( response.status !== 200 ) {
      console.log('no')
      return;
    }

    updateScreenshot(data)
  }

  async function handleOnSubmitTweet(e) {
    e.preventDefault();

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
      console.log('e.message', e.message);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Twitch Dashboard</title>
        <meta name="description" content="Helpers!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
      {!session && <>
        Not signed in <br/>
        <button onClick={() => signIn()}>Sign in</button>
      </>}
      {session && <>
        Signed in as {session.user.email} <br/>
        <button onClick={() => signOut()}>Sign out</button>
      </>}
        <Container>
          <h1>Twitch Screenshot</h1>

          <div className={styles.twitch}>
            <div className={styles.forms}>
              <Form onSubmit={handleOnSubmitScreenshot}>
                <h2>Get Screenshot</h2>
                <p>
                  <label htmlFor="streamID">Stream ID (user / channel name)</label>
                  <input id="streamID" type="text" name="streamId" />
                </p>
                <p>
                  <Button>
                    { screenshot?.url ? 'Refresh' : 'Get Screenshot' }
                  </Button>
                </p>
              </Form>

              {screenshot?.url && (
                <Form onSubmit={handleOnSubmitTweet}>
                  <h2>Tweet</h2>
                  <p>
                    <label htmlFor="tweetMessage">Message</label>
                    <textarea id="tweetMessage" name="tweetMessage" />
                  </p>
                  <p>
                    <Button>Post</Button>
                  </p>
                </Form>
              )}
            </div>
            <div className={styles.preview}>
              <figure>
                {screenshot?.url && (
                  <img src={screenshot.url} />
                )}
              </figure>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  )
}
