import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const defaultMinSize = 100;

function nullifyEvent(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (e.preventDefault) {
    e.preventDefault();
  }
}

function coercePosition({ minWidth, minHeight, constrainRect }, position) {
  const { height, width } = constrainRect;

  const checkHeight = minHeight || defaultMinSize;
  const checkWidth = minWidth || defaultMinSize;

  return {
    left: Math.min(Math.max(0, position.left), width - checkWidth),
    top: Math.min(Math.max(0, position.top), height - checkHeight)
  };
}

export default class MovablePanel extends React.Component {
  constructor(props) {
    super(props);

    const position = coercePosition(props, { top: props.initialTop, left: props.initialLeft });

    this.trackLeft = 0;
    this.trackTop = 0;
    this.trackX = 0;
    this.trackY = 0;

    this.state = {
      top: position.top,
      left: position.left,
      isMoving: false
    };
  }

  componentDidUpdate(prevProps) {
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

  render() {
    const minWidth = this.props.minWidth || defaultMinSize;
    const minHeight = this.props.minHeight || defaultMinSize;
    const { top, left, isMoving } = this.state;
    const inlineStyles = { top, left, minWidth, minHeight };
    const classes = classNames(styles.container, isMoving && styles.moving);
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

  handleMouseDown = (e) => {
    nullifyEvent(e);

    if (!this.state.isMoving) {
      this.trackStartOfMove(e.clientX, e.clientY);
      this.addMouseEvents();
      this.setState({ isMoving: true });
    }
  };

  handleMouseUp = (ignore) => {
    if (this.state.isMoving) {
      this.removeMouseEvents();
      this.setState({ isMoving: false });
    }
  };

  handleMouseMove = (e) => {
    this.performMove(e.clientX, e.clientY);
  };

  trackStartOfMove(x, y) {
    this.trackLeft = this.state.left;
    this.trackTop = this.state.top;
    this.trackX = x;
    this.trackY = y;
  }

  performMove(x, y) {
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

  addMouseEvents() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  removeMouseEvents() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }
}

MovablePanel.propTypes = {
  initialTop: PropTypes.number,
  initialLeft: PropTypes.number,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  constrainRect: PropTypes.object,
  children: PropTypes.node
};
