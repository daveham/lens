import React from 'react';
import s from '../styles/home.style';
import styles from './styles.scss';

export default function Home() {
  return (
    <div>
      <p style={s.p}>
        Lens is a tool for creating images by applying generative algorithms to photos.
      </p>
      <p style={s.p}>
        Generate this image:
      </p>
      <img src='build/images/DMEvenGen500.jpg' alt='' className={styles.framedImage} />
      <p style={s.p}>
        From this photo:
      </p>
      <img src='build/images/EveningCloudsDavisMountains500.jpg' alt='' className={styles.framedImage} />
    </div>
  );
}
