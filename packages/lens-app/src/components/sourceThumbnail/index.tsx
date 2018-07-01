import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import Loading from '../loading';
import { default as getConfig } from '../../config';
import styles from './styles.scss';

interface IProps {
  children?: any;
  thumbnailUrl?: string;
  label?: string;
  link?: string;
}

function renderWithLink(url, link, classes) {
  return (
    <RouterLink to={link}>
      <img className={classes} src={url}/>
    </RouterLink>
  );
}

function renderWithoutLink(url, classes) {
  return (
    <img className={classes} src={url}/>
  );
}

export default ({ children, thumbnailUrl, label, link }: IProps) => {
  if (thumbnailUrl) {
    const dataHost = getConfig().dataHost;
    const fullUrl = `${dataHost}${thumbnailUrl}`;

    const imageClasses = classNames(styles.thumbnailImage, link && styles.interactive);
    const itemClasses = classNames(styles.thumbnailItem, link && styles.interactive);

    const thumbnail = link ?
      renderWithLink(fullUrl, link, imageClasses) : renderWithoutLink(fullUrl, imageClasses);

    const caption = label &&
      <figcaption className={styles.thumbnailImageLabel}>{label}</figcaption>;

    return (
      <div className={itemClasses}>
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
