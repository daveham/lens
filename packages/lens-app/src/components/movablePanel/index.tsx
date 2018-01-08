import * as React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

const defaultMinSize = 100;

interface IProps {
  initialTop: number;
  initialLeft: number;
  minWidth?: number;
  minHeight?: number;
  parentRect: any;
  children?: any;
}

interface IState {
  top: number;
  left: number;
  isMoving: boolean;
}

function nullifyEvent(e: any) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (e.preventDefault) {
    e.preventDefault();
  }
}

class MovablePanel extends React.Component<IProps, IState> {
  private trackLeft: number;
  private trackTop: number;
  private trackX: number;
  private trackY: number;

  constructor(props: IProps) {
    super(props);

    this.state = {
      top: props.initialTop,
      left: props.initialLeft,
      isMoving: false
    };
  }

  public render(): any {
    const minWidth = this.props.minWidth || defaultMinSize;
    const minHeight = this.props.minHeight || defaultMinSize;
    const { top, left, isMoving } = this.state;
    const inlineStyles = { top, left, minWidth, minHeight };
    const classes = classNames(styles.infoContainer, isMoving && styles.moving);
    return (
      <div
        className={classes}
        style={inlineStyles}
        onMouseDown={this.handleMouseDown}
      >
        {this.props.children}
      </div>
    );
  }

  private handleMouseDown = (e: any) => {
    nullifyEvent(e);

    if (!this.state.isMoving) {
      this.trackStartOfMove(e.clientX, e.clientY);
      this.addMouseEvents();
      this.setState({ isMoving: true });
    }
  };

  private handleMouseUp = (ignore: any) => {
    if (this.state.isMoving) {
      this.removeMouseEvents();
      this.setState({ isMoving: false });
    }
  };

  private handleMouseMove = (e: any) => {
    this.performMove(e.clientX, e.clientY);
  };

  private trackStartOfMove(x: number, y: number) {
    this.trackLeft = this.state.left;
    this.trackTop = this.state.top;
    this.trackX = x;
    this.trackY = y;
  }

  private performMove(x: number, y: number) {
    const deltaX = x - this.trackX;
    const deltaY = y - this.trackY;
    const position = {
      left: this.trackLeft + deltaX,
      top: this.trackTop + deltaY
    };
    const newPosition = this.coerceMove(position);
    if (newPosition.left !== this.state.left || newPosition.top !== this.state.top) {
      this.setState(newPosition);
    }
  }

  private coerceMove(position: any): any {
    const { minWidth, minHeight, parentRect } = this.props;
    const { height, width } = parentRect;

    const checkHeight = minHeight || defaultMinSize;
    const checkWidth = minWidth || defaultMinSize;

    return {
      left: Math.min(Math.max(0, position.left), width - checkWidth),
      top: Math.min(Math.max(0, position.top), height - checkHeight)
    };
  }

  private addMouseEvents() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  private removeMouseEvents() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }
}

export default MovablePanel;
