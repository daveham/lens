/*
 * Derived from Paper.js, evolved with Ramda.js.
 *
 * Ramda.js - A practical functional library for JavaScript programmers.
 * http://ramdajs.com
 *
 * Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2019, Juerg Lehni & Jonathan Puckey
 * http://scratchdisk.com/ & https://puckey.studio/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

import Numerical from './numerical';
import Point from './point';
import Size from './size';

import {
  getRectParamsFromArguments,
  getRectParamsFromOneArg,
  getSizeParamsFromArguments,
  getPointParamsFromArguments,
} from './common';

const getRectParamsUsingPrototype = options => {
  const proto = new Rectangle();
  Object.keys(options).forEach(k => (proto[k] = options[k]));
  return [proto.x, proto.y, proto.width, proto.height];
};

let emptyRectangle;

class Rectangle {
  x;
  y;
  width;
  height;

  constructor(...args) {
    let rectParams = getRectParamsFromArguments(args);
    if (!Array.isArray(rectParams)) {
      rectParams = getRectParamsUsingPrototype(args[0]);
    }
    [this.x, this.y, this.width, this.height] = rectParams;

    /*
    const args = arguments;
    const type = typeof arg0;
    if (type === 'number') {
      this.x = arg0;
      this.y = arg1;
      this.width = arg2;
      this.height = arg3;
    } else if (type === 'undefined' || arg0 === null) {
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
    } else if (args.length === 1) {
      if (Array.isArray(arg0)) {
        this.x = arg0[0];
        this.y = arg0[1];
        this.width = arg0[2];
        this.height = arg0[3];
      } else if ('x' in arg0) {
        this.x = arg0.x;
        this.y = arg0.y || 0;
        this.width = arg0.width || 0;
        this.height = arg0.height || 0;
      } else if ('point' in arg0) {
        // handle ctor({ point, size })
        const { point, size } = arg0;
        const { x, y } = new Point(point);
        this.x = x;
        this.y = y;
        if (size) {
          const { width, height } = new Size(size);
          this.width = width;
          this.height = height;
        }
      } else if ('from' in arg0) {
        // handle ctor({ from: [], to: [] })
        const { from, to } = arg0;
        this.x = from[0];
        this.y = from[1];
        this.width = to[0] - this.x;
        this.height = to[1] - this.y;
      } else {
        const proto = new Rectangle();
        Object.keys(arg0).forEach(k => (proto[k] = arg0[k]));
        this.x = proto.x;
        this.y = proto.y;
        this.width = proto.width;
        this.height = proto.height;
      }
    } else {
      if (Array.isArray(arg0)) {
        this.x = arg0[0];
        this.y = arg0[1];
      } else if ('x' in arg0) {
        this.x = arg0.x;
        this.y = arg0.y;
      }
      if (Array.isArray(arg1)) {
        // handle ctor([x,y],[width,height])
        this.width = arg1[0];
        this.height = arg1[1];
      } else if ('x' in arg1) {
        // handle ctor(point, point)
        this.width = arg1.x - this.x;
        this.height = (arg1.y || 0) - this.y;
      } else if ('width' in arg1) {
        // handle ctor(point, size)
        this.width = arg1.width;
        this.height = arg1.height || 0;
      }
    }
    if (this.width < 0) {
      this.x = this.x + this.width;
      this.width = -this.width;
    }
    if (this.height < 0) {
      this.y = this.y + this.height;
      this.height = -this.height;
    }
   */
  }

  static get Empty() {
    if (!emptyRectangle) {
      emptyRectangle = new Rectangle();
    }
    return emptyRectangle;
  }

  clone() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }

  equals(/* rect */ ...args) {
    let rectParams = getRectParamsFromArguments(args);
    if (!Array.isArray(rectParams)) {
      rectParams = getRectParamsUsingPrototype(args[0]);
    }
    const [x, y, width, height] = rectParams;

    return this.x === x && this.y === y && this.width === width && this.height === height;
  }

  toString() {
    return `{ x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height} }`;
  }

  getPoint() {
    return new Point(this.x, this.y);
  }

  setPoint({ x, y }) {
    this.x = x;
    this.y = y;
  }

  getSize() {
    return new Size(this.width, this.height);
  }

  _fw = 1;
  _fh = 1;
  _sx;
  _sy;

  setSize(/* size */ ...args) {
    const [w, h] = getSizeParamsFromArguments(args);
    const sx = this._sx;
    const sy = this._sy;
    // Keep track of how dimensions were specified through this._s*
    // attributes.
    // _sx / _sy can either be 0 (left), 0.5 (center) or 1 (right), and is
    // used as direct factors to calculate the x / y adjustments from the
    // size differences.
    // _fw / _fh can either be 0 (off) or 1 (on), and is used to protect
    // width / height values against changes.
    if (sx) {
      this.x += (this.width - w) * sx;
    }
    if (sy) {
      this.y += (this.height - h) * sy;
    }
    this.width = w;
    this.height = h;
    this._fw = this._fh = 1;
  }

  /**
   * The position of the left hand side of the rectangle. Note that this
   * doesn't move the whole rectangle; the right hand side stays where it was.
   */
  getLeft() {
    return this.x;
  }

  setLeft(left) {
    if (!this._fw) {
      const amount = left - this.x;
      this.width -= this._sx === 0.5 ? amount * 2 : amount;
    }
    this.x = left;
    this._sx = this._fw = 0;
  }

  /**
   * The top coordinate of the rectangle. Note that this doesn't move the
   * whole rectangle: the bottom won't move.
   */
  getTop() {
    return this.y;
  }

  setTop(top) {
    if (!this._fh) {
      const amount = top - this.y;
      this.height -= this._sy === 0.5 ? amount * 2 : amount;
    }
    this.y = top;
    this._sy = this._fh = 0;
  }

  /**
   * The position of the right hand side of the rectangle. Note that this
   * doesn't move the whole rectangle; the left hand side stays where it was.
   */
  getRight() {
    return this.x + this.width;
  }

  setRight(right) {
    if (!this._fw) {
      const amount = right - this.x;
      this.width = this._sx === 0.5 ? amount * 2 : amount;
    }
    this.x = right - this.width;
    this._sx = 1;
    this._fw = 0;
  }

  /**
   * The bottom coordinate of the rectangle. Note that this doesn't move the
   * whole rectangle: the top won't move.
   */
  getBottom() {
    return this.y + this.height;
  }

  setBottom(bottom) {
    if (!this._fh) {
      const amount = bottom - this.y;
      this.height = this._sy === 0.5 ? amount * 2 : amount;
    }
    this.y = bottom - this.height;
    this._sy = 1;
    this._fh = 0;
  }

  getCenterX() {
    return this.x + this.width / 2;
  }

  setCenterX(x) {
    // If we're asked to fix the width or if _sx is already in center mode,
    // just keep moving the center.
    if (this._fw || this._sx === 0.5) {
      this.x = x - this.width / 2;
    } else {
      if (this._sx) {
        this.x += (x - this.x) * 2 * this._sx;
      }
      this.width = (x - this.x) * 2;
    }
    this._sx = 0.5;
    this._fw = 0;
  }

  getCenterY() {
    return this.y + this.height / 2;
  }

  setCenterY(y) {
    // If we're asked to fix the height or if _sy is already in center mode,
    // just keep moving the center.
    if (this._fh || this._sy === 0.5) {
      this.y = y - this.height / 2;
    } else {
      if (this._sy) {
        this.y += (y - this.y) * 2 * this._sy;
      }
      this.height = (y - this.y) * 2;
    }
    this._sy = 0.5;
    this._fh = 0;
  }

  getCenter() {
    return new Point(this.getCenterX(), this.getCenterY());
  }

  setCenter(/* point */ value) {
    const isValueArray = Array.isArray(value);
    this.setCenterX(isValueArray ? value[0] : value.x);
    this.setCenterY(isValueArray ? value[1] : value.y);
    // A special setter where we allow chaining, because it comes in handy
    // in a couple of places in core.
    return this;
  }

  getArea() {
    return this.width * this.height;
  }

  isEmpty() {
    return this.width === 0 || this.height === 0;
  }

  contains(arg) {
    // Detect rectangles either by checking for 'width' on the passed object
    // or by looking at the amount of elements in the arguments list,
    // or the passed array:
    return (arg && arg.width !== undefined) || (Array.isArray(arg) ? arg : arguments).length === 4
      ? this.containsRectangle(new Rectangle(...arguments))
      : this.containsPoint(new Point(...arguments));
  }

  containsPoint(/* point */ ...args) {
    const [x, y] = getPointParamsFromArguments(args);
    return x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height;
  }

  containsRectangle(/* rect */ ...args) {
    let rectParams = getRectParamsFromArguments(args);
    if (!Array.isArray(rectParams)) {
      rectParams = getRectParamsUsingPrototype(args[0]);
    }
    const [x, y, width, height] = rectParams;

    return (
      x >= this.x &&
      y >= this.y &&
      x + width <= this.x + this.width &&
      y + height <= this.y + this.height
    );
  }

  intersects(/* rect */ arg0, epsilon = Numerical.GEOMETRIC_EPSILON) {
    let rectParams = getRectParamsFromOneArg(arg0);
    if (!Array.isArray(rectParams)) {
      rectParams = getRectParamsUsingPrototype(arg0);
    }
    const [x, y, width, height] = rectParams;

    return (
      x + width > this.x - epsilon &&
      y + height > this.y - epsilon &&
      x < this.x + this.width + epsilon &&
      y < this.y + this.height + epsilon
    );
  }

  intersect(/* rect */ ...args) {
    let rectParams = getRectParamsFromArguments(args);
    if (!Array.isArray(rectParams)) {
      rectParams = getRectParamsUsingPrototype(args[0]);
    }
    const [x, y, width, height] = rectParams;

    const x1 = Math.max(this.x, x);
    const y1 = Math.max(this.y, y);
    const x2 = Math.min(this.x + this.width, x + width);
    const y2 = Math.min(this.y + this.height, y + height);
    return new Rectangle(x1, y1, x2 - x1, y2 - y1);
  }

  unite(/* rect */ ...args) {
    let rectParams = getRectParamsFromArguments(args);
    if (!Array.isArray(rectParams)) {
      rectParams = getRectParamsUsingPrototype(args[0]);
    }
    const [x, y, width, height] = rectParams;

    const x1 = Math.min(this.x, x);
    const y1 = Math.min(this.y, y);
    const x2 = Math.max(this.x + this.width, x + width);
    const y2 = Math.max(this.y + this.height, y + height);
    return new Rectangle(x1, y1, x2 - x1, y2 - y1);
  }

  include(/* point */ arg0) {
    const argIsArray = Array.isArray(arg0);
    const x = argIsArray ? arg0[0] : arg0.x;
    const y = argIsArray ? arg0[1] : arg0.y;

    const x1 = Math.min(this.x, x);
    const y1 = Math.min(this.y, y);
    const x2 = Math.max(this.x + this.width, x);
    const y2 = Math.max(this.y + this.height, y);
    return new Rectangle(x1, y1, x2 - x1, y2 - y1);
  }

  offset(/* point */ ...args) {
    const [x, y] = getPointParamsFromArguments(args);
    return new Rectangle(this.x + x, this.y + y, this.width, this.height);
  }

  expand(arg0, arg1) {
    let hor;
    let ver;
    if (typeof arg0 === 'number') {
      hor = arg0;
      ver = arg1;
    } else if ('width' in arg0) {
      hor = arg0.width;
      ver = arg0.height;
    } else {
      throw new Error('Unsupported arguments in Rect.expand()');
    }
    return new Rectangle(this.x - hor / 2, this.y - ver / 2, this.width + hor, this.height + ver);
  }

  scale(hor, ver) {
    return this.expand(
      this.width * hor - this.width,
      this.height * (ver === undefined ? hor : ver) - this.height,
    );
  }

  getTopLeft() {
    return new Point(this.getLeft(), this.getTop());
  }

  getTopRight() {
    return new Point(this.getRight(), this.getTop());
  }

  getBottomLeft() {
    return new Point(this.getLeft(), this.getBottom());
  }

  getBottomRight() {
    return new Point(this.getRight(), this.getBottom());
  }

  getLeftCenter() {
    return new Point(this.getLeft(), this.getCenterY());
  }

  getTopCenter() {
    return new Point(this.getCenterX(), this.getTop());
  }

  getRightCenter() {
    return new Point(this.getRight(), this.getCenterY());
  }

  getBottomCenter() {
    return new Point(this.getCenterX(), this.getBottom());
  }

  get top() {
    return this.getTop();
  }

  set top(value) {
    this.setTop(value);
  }

  get left() {
    return this.getLeft();
  }

  set left(value) {
    this.setLeft(value);
  }

  get bottom() {
    return this.getBottom();
  }

  set bottom(value) {
    this.setBottom(value);
  }

  get right() {
    return this.getRight();
  }

  set right(value) {
    this.setRight(value);
  }

  get center() {
    return this.getCenter();
  }

  set center(value) {
    this.setCenter(value);
  }

  get size() {
    return this.getSize();
  }

  set size(value) {
    this.setSize(value);
  }

  get topLeft() {
    return this.getTopLeft();
  }

  set topLeft(value) {
    const isArray = Array.isArray(value);
    this.setLeft(isArray ? value[0] : value.x);
    this.setTop(isArray ? value[1] : value.y);
  }

  get topRight() {
    return this.getTopRight();
  }

  set topRight(value) {
    const isArray = Array.isArray(value);
    this.setRight(isArray ? value[0] : value.x);
    this.setTop(isArray ? value[1] : value.y);
  }

  get bottomLeft() {
    return this.getBottomLeft();
  }

  set bottomLeft(value) {
    const isArray = Array.isArray(value);
    this.setLeft(isArray ? value[0] : value.x);
    this.setBottom(isArray ? value[1] : value.y);
  }

  get bottomRight() {
    return this.getBottomRight();
  }

  set bottomRight(value) {
    const isArray = Array.isArray(value);
    this.setRight(isArray ? value[0] : value.x);
    this.setBottom(isArray ? value[1] : value.y);
  }

  get leftCenter() {
    return this.getLeftCenter();
  }

  set leftCenter(value) {
    const isArray = Array.isArray(value);
    this.setLeft(isArray ? value[0] : value.x);
    this.setCenterY(isArray ? value[1] : value.y);
  }

  get topCenter() {
    return this.getTopCenter();
  }

  set topCenter(value) {
    const isArray = Array.isArray(value);
    this.setCenterX(isArray ? value[0] : value.x);
    this.setTop(isArray ? value[1] : value.y);
  }

  get rightCenter() {
    return this.getRightCenter();
  }

  set rightCenter(value) {
    const isArray = Array.isArray(value);
    this.setRight(isArray ? value[0] : value.x);
    this.setCenterY(isArray ? value[1] : value.y);
  }

  get bottomCenter() {
    return this.getBottomCenter();
  }

  set bottomCenter(value) {
    const isArray = Array.isArray(value);
    this.setCenterX(isArray ? value[0] : value.x);
    this.setBottom(isArray ? value[1] : value.y);
  }
}

export default Rectangle;
