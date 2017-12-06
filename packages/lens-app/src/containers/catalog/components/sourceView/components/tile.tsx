import * as React from 'react';
import styles from './styles.scss';

interface IProps {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
}

class Tile extends React.Component<IProps, any> {
  public render(): any {
    const { top, left, height, width } = this.props;
    const customStyles = {
      minWidth: width,
      minHeight: height,
      top,
      left
    };
    return (
      <div
        className={styles.tile}
        style={customStyles}
      />
    );
  }
}

export default Tile;
