import useSite from 'hooks/use-site';

import Container from '@components/Container';
import Section from '@components/Section';

import imageColby from 'images/colby-fayock.jpg';

import styles from './SectionAuthor.module.scss';

const SectionAuthor = () => {
  const { metadata } = useSite();
  const { authorName, authorUrl } = metadata;

  return (
    <Section className={styles.sectionAuthor} backgroundColor="secondary">
      <Container className={styles.sectionAuthorContainer}>
        <div className={styles.sectionAuthorPicture}>
          <img width="200" height="200" src={imageColby} alt="Colby Fayock hugging stuffed Star Wars toys" />
        </div>
        <div>
          <h3>
            From <a href={authorUrl}>{ authorName }</a>
          </h3>
          <p>
            Helping others to learn by doing. Author of <a href="http://jamstackhandbook.com/">Jamstack Handbook</a> and <a href="https://50reactprojects.com/">50 Projects for React & the Static Web</a>.
          </p>
        </div>
      </Container>
    </Section>
  )
}

export default SectionAuthor;