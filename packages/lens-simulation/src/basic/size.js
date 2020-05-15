/*
 * Derived from:
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

class Size {
  width;
  height;

  constructor(arg0, arg1) {
    const type = typeof arg0;
    if (type === 'number') {
      this.width = arg0;
      this.height = arg1;
    } else if (type === 'undefined' || arg0 === null) {
      this.width = 0;
      this.height = 0;
    } else if (Array.isArray(arg0)) {
      this.width = arg0[0];
      this.height = arg0[1];
    } else if ('width' in arg0) {
      this.width = arg0.width || 0;
      this.height = arg0.height || 0;
    } else if ('x' in arg0) {
      this.width = arg0.x || 0;
      this.height = arg0.y || 0;
    } else {
      this.width = 0;
      this.height = 0;
    }
  }

  equals(size) {
    return (
      size === this ||
      (size &&
        ((this.width === size.width && this.height === size.height) ||
          (Array.isArray(size) && this.width === size[0] && this.height === size[1]))) ||
      false
    );
  }

  clone() {
    return new Size(this.width, this.height);
  }

  toString() {
    return `{ width: ${this.width}, height: ${this.height} }`;
  }

  add(size) {
    return new Size(this.width + size.width, this.height + size.height);
  }

  subtract(size) {
    return new Size(this.width - size.width, this.height - size.height);
  }

  multiply(size) {
    return new Size(this.width * size.width, this.height * size.height);
  }

  divide(size) {
    return new Size(this.width / size.width, this.height / size.height);
  }

  modulo(size) {
    return new Size(this.width % size.width, this.height % size.height);
  }

  negate() {
    return new Size(-this.width, -this.height);
  }

  isZero() {
    const isZero = Numerical.isZero;
    return isZero(this.width) && isZero(this.height);
  }

  isNaN() {
    return isNaN(this.width) || isNaN(this.height);
  }

  round() {
    return new Size(Math.round(this.width), Math.round(this.height));
  }

  ceil() {
    return new Size(Math.ceil(this.width), Math.ceil(this.height));
  }

  floor() {
    return new Size(Math.floor(this.width), Math.floor(this.height));
  }

  abs() {
    return new Size(Math.abs(this.width), Math.abs(this.height));
  }

  static min(size1, size2) {
    return new Size(Math.min(size1.width, size2.width), Math.min(size1.height, size2.height));
  }

  static max(size1, size2) {
    return new Size(Math.max(size1.width, size2.width), Math.max(size1.height, size2.height));
  }
}

export default Size;
