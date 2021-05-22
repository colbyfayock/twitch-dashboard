import ClassName from '@models/classname';

import styles from './Details.module.scss';

const Details = ({ children, className }) => {
  const detailsClassName = new ClassName(styles.details);

  detailsClassName.addIf(className, className);

  return (
    <details className={styles.details}>
      { children }
    </details>
  )
}

export default Details;