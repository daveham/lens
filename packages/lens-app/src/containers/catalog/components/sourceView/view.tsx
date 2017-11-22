import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';

interface IProps {
  sourceThumbnailUrl: string;
}

class View extends React.Component<IProps, any> {
  private static renderThumbnail(url) {
    if (url) {
      return (
        <div className={styles.thumbnailItem}>
          <ReactRouterDom.Link to={'/Catalog'}>
            <img className={styles.thumbnailImage} src={url}/>
          </ReactRouterDom.Link>
        </div>
      );
    } else {
      return (
        <div className={styles.thumbnailLoading}>
          <FontAwesome name='spinner' cssModule={faStyles} pulse />
        </div>
      );
    }
  }

  public render() {
    return (
      <div className={styles.container}>
        {View.renderThumbnail(this.props.sourceThumbnailUrl)}
      </div>
    );
  }
}

export default View;
