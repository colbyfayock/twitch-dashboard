import ClassName from '@models/classname';

import styles from './Form.module.scss';

const Form = ({ children, className, ...rest }) => {
  const formClassName = new ClassName(styles.form);

  formClassName.addIf(className, className);

  return (
    <form className={formClassName.toString()} method="post" {...rest}>
      { children }
    </form>
  )
}

export default Form;