import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';

const defaultMinSize = 100;

const styles: any = (theme) => ({
  root: {
    position: 'absolute',
    zIndex: 200,
    padding: theme.spacing.unit / 2,
    backgroundImage: 'linear-gradient(to top, #e3e3e3 0, #f0f0f0 20%, #fff 60%)',
    borderRadius: 6,
    boxShadow: '2px 3px 3px 0 rgba(0, 0, 0, .14), ' +
      '2px 2px 6px 0 rgba(0, 0, 0, .12), ' +
      '2px 4px 2px -2px rgba(0, 0, 0, .2)',
    opacity: .9,
    transition: 'opacity .2s ease-in',
    cursor: 'default',
  },
  moving: {
    opacity: .4,
    cursor: 'grab',
  },
});

interface IProps {
  classes: any;
  initialTop: number;
  initialLeft: number;
  minWidth?: number;
  minHeight?: number;
  constrainRect: any;
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

function coercePosition({ minWidth, minHeight, constrainRect }: IProps, position: any): any {
  const { height, width } = constrainRect;

  const checkHeight = minHeight || defaultMinSize;
  const checkWidth = minWidth || defaultMinSize;

  return {
    left: Math.min(Math.max(0, position.left), width - checkWidth),
    top: Math.min(Math.max(0, position.top), height - checkHeight)
  };
}

class MovablePanel extends React.Component<IProps, IState> {
  private trackLeft: number;
  private trackTop: number;
  private trackX: number;
  private trackY: number;

  constructor(props: IProps) {
    super(props);

    const position = coercePosition(props, { top: props.initialTop, left: props.initialLeft });

    this.state = {
      top: position.top,
      left: position.left,
      isMoving: false
    };
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState): void {
    const prevRect = prevProps.constrainRect;
    const curRect = this.props.constrainRect;
    if ((prevRect.right !== curRect.right) || (prevRect.bottom !== curRect.bottom)) {
      const { top, left } = this.state;
      const position = coercePosition(this.props, { top, left });
      if (position.top !== top || position.left !== left) {
        this.setState({ top: position.top, left: position.left });
      }
    }
  }

  public render(): any {
    const minWidth = this.props.minWidth || defaultMinSize;
    const minHeight = this.props.minHeight || defaultMinSize;
    const { top, left, isMoving } = this.state;
    const inlineStyles = { top, left, minWidth, minHeight };
    const { classes } = this.props;
    return (
      <div
        className={cx(classes.root, isMoving && classes.moving)}
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
    const newPosition = coercePosition(this.props, position);
    if (newPosition.left !== this.state.left || newPosition.top !== this.state.top) {
      this.setState(newPosition);
    }
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

export default withStyles(styles)(MovablePanel);
