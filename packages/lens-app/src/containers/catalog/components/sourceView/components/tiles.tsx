import * as React from 'react';
import { throttle } from 'lodash';
import styles from './styles.scss';
import Tile from './tile';

import _debug from 'debug';
const debug = _debug('lens:sourceView:tiles');

interface IProps {
  imageKeys: ReadonlyArray<string>;
  images: {[id: string]: any};
  onSizeChanged?: (width: number, height: number) => void;
}

interface IState {
  width: number;
  height: number;
}

class Tiles extends React.Component<IProps, IState> {
  private containerNode: any;
  private controlledResize: () => void;

  constructor(props: IProps) {
    super(props);

    this.state = {
      width: 0,
      height: 0
    };

    this.controlledResize = throttle(this.updateSize, 50, { leading: true, trailing: true });
  }

  public componentDidMount(): any {
    window.addEventListener('resize', this.controlledResize, false);
    this.updateSize();
  }

  public componentWillUnmount(): any {
    window.removeEventListener('resize', this.controlledResize);
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { width, height } = this.state;
    if (prevState.width !== width ||
      prevState.height !== height) {
      debug('componentDidUpdate - size changed', { width, height });
      if (this.props.onSizeChanged) {
        this.props.onSizeChanged(width, height);
      }
    }
  }

  public render() {
    const { imageKeys, images } = this.props;
    const imageElements = imageKeys.map((key) => {
      const image = images[key];
      return image ? (
        <Tile
          key={key}
          left={image.x}
          top={image.y}
          width={32}
          height={32}
          url={image.url}
          loading={image.loading}
        />
      ) : null;
    });

    return (
      <div
        className={styles.tilesContainer}
        ref={(node) => this.containerNode = node}
      >
        {imageElements}
      </div>
    );
  }

  private updateSize = () => {
    if (this.containerNode) {
      const { width, height } = this.state;
      const { offsetWidth, offsetHeight } = this.containerNode;
      if (width !== offsetWidth || height !== offsetHeight) {
        this.setState({
          width: offsetWidth,
          height: offsetHeight
        });
      }
    }
  };
}

export default Tiles;
