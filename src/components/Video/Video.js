import ClassName from '@models/classname';

import styles from './Video.module.scss';

const Video = ({ className, src, width, height, ...rest }) => {
  const videoClassName = new ClassName(styles.video);

  videoClassName.addIf(className, className);

  return (
    <figure className={videoClassName.toString()}>
      <div className={styles.videoContainer} style={{
        paddingTop: `${height / width * 100}%`
      }}>
        <iframe src={src}
          width={width}
          height={height}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          {...rest} />
      </div>
    </figure>
  )
}

export default Video;