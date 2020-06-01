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
import { getSizeParamsFromArguments } from './common';

class Size {
  width;
  height;

  constructor(...args) {
    [this.width, this.height] = getSizeParamsFromArguments(args);
  }

  equals(...args) {
    const [w, h] = getSizeParamsFromArguments(args);
    return w === this.width && h === this.height;
  }

  clone() {
    return new Size(this);
  }

  toString() {
    return `{ width: ${this.width}, height: ${this.height} }`;
  }

  add(...args) {
    const [w, h] = getSizeParamsFromArguments(args);
    return new Size(this.width + w, this.height + h);
  }

  subtract(...args) {
    const [w, h] = getSizeParamsFromArguments(args);
    return new Size(this.width - w, this.height - h);
  }

  multiply(...args) {
    const [w, h] = getSizeParamsFromArguments(args);
    return new Size(this.width * w, this.height * h);
  }

  divide(...args) {
    const [w, h] = getSizeParamsFromArguments(args);
    return new Size(this.width / w, this.height / h);
  }

  modulo(...args) {
    const [w, h] = getSizeParamsFromArguments(args);
    return new Size(this.width % w, this.height % h);
  }

  negate() {
    return new Size(-this.width, -this.height);
  }

  isZero() {
    return Numerical.isZero(this);
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
