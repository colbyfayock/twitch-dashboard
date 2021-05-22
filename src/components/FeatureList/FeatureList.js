import styles from './FeatureList.module.scss';

import Container from '@components/Container';
import Section from '@components/Section';

const FeatureList = ({ children, title = "Features", features = [], backgroundColor = "primary" }) => {

  if ( !Array.isArray(features) ) {
    throw new Error(`Failed to render FeatureList: Invalid features type ${typeof features}`);
  }

  return (
    <Section className={styles.featureList} backgroundColor={backgroundColor}>
      <Container>
        <h2>{ title }</h2>
        <ul>
          { features.map((feature, index) =>{
            return (
              <li key={index}>
                { feature }
              </li>
            )
          }) }
        </ul>
        { children }
      </Container>
    </Section>
  )
}

export default FeatureList;