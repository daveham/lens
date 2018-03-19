import React from 'react';
import throttle from 'lodash.throttle';
import { makeImgUrl } from '../../../utils';
import MovablePanel from '../../../MovablePanel';
import Stats from './Stats';

import styles from './styles.scss';

const backgroundImage = `url(${makeImgUrl('beSample.png')}`;

const mockData = {
  data: {
    filename: 'PaintedBricks.jpg',
    red: { histogram: [1, 0, 3, 48, 36, 75, 66, 40, 38, 8] },
    green: { histogram: [1, 36, 75, 66, 40, 0, 0, 3, 48, 0] },
    blue: { histogram: [0, 0, 0, 38, 26, 55, 46, 20, 0, 8] },
    hue: { histogram: [0, 0, 10, 20, 30, 40, 50, 0, 0, 0] },
    saturation: { histogram: [0, 0, 0, 0, 0, 80, 77, 30, 2, 0] },
    luminance: { histogram: [98, 20, 0, 0, 0, 30, 17, 0, 5, 0] }
  },
  loading: false
};

export default class ImageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { sizeSet: false };

    this.controlledResize = throttle(this.updateSize, 50, { leading: true, trailing: true });
  }

  componentDidMount() {
    window.addEventListener('resize', this.controlledResize, false);
    setTimeout(() => {
      this.updateSize();
    }, 100);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.controlledResize);
  }

  render() {
    const style = { backgroundImage };
    return (
      <div
        style={style}
        ref={(node) => this.containerNode = node }
        className={styles.imageContainer}
      >
        {this.renderPanel()}
      </div>
    );
  }

  renderPanel() {
    if (this.containerNode) {
      return (
        <MovablePanel
          initialLeft={250}
          initialTop={40}
          constrainRect={this.containerNode.getBoundingClientRect()}
        >
          <div>
            <Stats
              row={72}
              col={45}
              offsetX={2304}
              offsetY={1440}
              stats={mockData}
            />
          </div>
        </MovablePanel>
      );
    }
    return null;
  }

  updateSize = () => {
    if (this.containerNode) {
      this.setState({ sizeSet: true });
    }
  };
}
