import * as React from 'react';
import { default as getConfig } from '../../../../../config';
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
    const { top, left, url, height, width } = this.props;
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
    return <div className={styles.tile} style={divStyles}/>;
  }
}

export default Tile;
