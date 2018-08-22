import * as React from 'react';
import classNames from 'classnames';
import { default as getConfig } from 'src/config';
import styles from './styles.scss';

interface IProps {
  left: number;
  top: number;
  width: number;
  height: number;
  loading?: boolean;
  url?: string;
}

class Tile extends React.Component<IProps, any> {
  public render(): any {
    const { top, left, url, height, width, loading } = this.props;
    if (url) {
      const dataHost = getConfig().dataHost;
      const fullUrl = `${dataHost}${url}`;
      const imageStyles = { top, left };
      return <img src={fullUrl} className={styles.image} style={imageStyles}/>;
    }
    const divStyles = {
      minWidth: width,
      minHeight: height,
      top,
      left
    };
    const tileClasses = classNames(styles.tile, loading && styles.loading);
    return <div className={tileClasses} style={divStyles}/>;
  }
}

export default Tile;
