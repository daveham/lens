import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import Loading from '../../../../components/loading';
import { default as getConfig } from '../../../../config';
import styles from './styles.scss';

interface IProps {
  thumbnailUrl?: string;
  label?: string;
  link?: string;
}

function renderWithLink(url, link) {
  return (
    <ReactRouterDom.Link to={link}>
      <img className={styles.thumbnailImage} src={url}/>
    </ReactRouterDom.Link>
  );
}

function renderWithoutLink(url) {
  return  <img className={styles.thumbnailImage} src={url}/>;
}

function renderCaption(label) {
  return <figcaption className={styles.thumbnailImageLabel}>{label}</figcaption>;
}

export default ({ thumbnailUrl, label, link}: IProps) => {
  if (thumbnailUrl) {
    const dataHost = getConfig().dataHost;
    const fullUrl = `${dataHost}${thumbnailUrl}`;

    const thumbnail = link ? renderWithLink(fullUrl, link) : renderWithoutLink(fullUrl);
    const caption = label ? renderCaption(label) : null;

    return (
      <div className={styles.thumbnailItem}>
        {thumbnail}
        {caption}
      </div>
    );
  } else {
    return (
      <div className={styles.thumbnailLoading}>
        <Loading pulse={true}/>
      </div>
    );
  }
};
