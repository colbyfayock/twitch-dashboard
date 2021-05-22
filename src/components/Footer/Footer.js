import { FaTwitter, FaGithub, FaYoutube, FaTwitch } from 'react-icons/fa';

import useSite from 'hooks/use-site';

import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';
import CosmoMono from '@components/CosmoMono';

import styles from './Footer.module.scss';

const Footer = () => {
  const { metadata } = useSite();
  const { supportEmail, authorName, authorUrl, footer } = metadata;
  const { links } = footer;

  return (
    <footer className={styles.footer}>
      <Section className={styles.footerSection}>
        <Container className={[styles.footerContainer, styles.footerContentContainer]}>
          <div>
            <h3>Have any questions?</h3>
            <p>
              Contact me at <a href={`mailto:${supportEmail}`}>{ supportEmail }</a>
            </p>
          </div>
          <div>
            <h3>Moar awesome!</h3>
            <ul>
              { links.map(({ url, title }) => {
                return (
                  <li key={`${url}-${title}`}>
                    <a href={url}>{title}</a>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className={styles.footerLegal}>
            <div>
              <p>
                &copy; { new Date().getFullYear() }, <a href={authorUrl}>{ authorName }</a>
              </p>
              <ul>
                <li>
                  <a href="https://twitter.com/colbyfayock">
                    <span className="sr-only">Twitter</span>
                    <FaTwitter />
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com/colbyfayock">
                    <span className="sr-only">YouTube</span>
                    <FaYoutube className={styles.footerIconYoutube} />
                  </a>
                </li>
                <li>
                  <a href="https://github.com/colbyfayock">
                    <span className="sr-only">GitHub</span>
                    <FaGithub />
                  </a>
                </li>
                <li>
                  <a href="https://twitch.tv/colbyfayock">
                    <span className="sr-only">Twitch</span>
                    <FaTwitch className={styles.footerIconTwitch} />
                  </a>
                </li>
              </ul>
            </div>
            <a className={styles.footerCosmo} href="https://spacejelly.dev">
              <CosmoMono  classNameStroke={styles.footerCosmoStroke} />
            </a>
          </div>
        </Container>
      </Section>
    </footer>
  )
}

export default Footer;