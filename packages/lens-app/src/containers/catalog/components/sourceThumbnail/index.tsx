import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Loading from '../../../../components/loading';
import { default as getConfig } from '../../../../config';
import styles from './styles.scss';

interface IProps {
  children?: any;
  thumbnailUrl?: string;
  label?: string;
  link?: string;
}

function renderWithLink(url, link) {
  return (
    <RouterLink to={link}>
      <img className={styles.thumbnailImage} src={url}/>
    </RouterLink>
  );
}

export default ({ children, thumbnailUrl, label, link }: IProps) => {
  if (thumbnailUrl) {
    const dataHost = getConfig().dataHost;
    const fullUrl = `${dataHost}${thumbnailUrl}`;

    const thumbnail = link ?
      renderWithLink(fullUrl, link) :
      <img className={styles.thumbnailImage} src={fullUrl}/>;
    const caption = label ?
      <figcaption className={styles.thumbnailImageLabel}>{label}</figcaption> : null;

    return (
      <div className={styles.thumbnailItem}>
        {thumbnail}
        {caption}
        {children}
      </div>
    );
  }
  return (
    <div className={styles.thumbnailLoading}>
      <Loading pulse={true}/>
    </div>
  );
};
