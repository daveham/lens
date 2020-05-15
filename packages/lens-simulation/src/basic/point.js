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

class Point {
  x;
  y;

  constructor(arg0, arg1) {
    const type = typeof arg0;
    if (type === 'number') {
      this.x = arg0;
      this.y = arg1;
    } else if (type === 'undefined' || arg0 === null) {
      this.x = 0;
      this.y = 0;
    } else if (Array.isArray(arg0)) {
      this.x = arg0[0];
      this.y = arg0[1];
    } else if ('x' in arg0) {
      this.x = arg0.x;
      this.y = arg0.y || 0;
    } else if ('width' in arg0) {
      this.x = arg0.width;
      this.y = arg0.height || 0;
    } else if ('angle' in arg0) {
      this.x = arg0.length || 0;
      this.y = 0;
      this.setAngle(arg0.angle || 0);
    } else {
      this.x = 0;
      this.y = 0;
    }
  }

  equals(point) {
    return (
      this === point ||
      (point && this.x === point.x && this.y === point.y) ||
      (Array.isArray(point) && this.x === point[0] && this.y === point[1]) ||
      false
    );
  }

  clone() {
    return new Point(this.x, this.y);
  }

  toString() {
    return `{ x: ${this.x}, y: ${this.y} }`;
  }

  isZero() {
    const isZero = Numerical.isZero;
    return isZero(this.x) && isZero(this.y);
  }

  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  setLength(length) {
    if (this.isZero()) {
      const angle = this._angle || 0;
      this.x = Math.cos(angle) * length;
      this.y = Math.sin(angle) * length;
    } else {
      const scale = length / this.getLength();
      // Force calculation of angle now, so it will be preserved even when
      // x and y are 0
      if (Numerical.isZero(scale)) {
        this.getAngle();
      }
      this.x = this.x * scale;
      this.y = this.y * scale;
    }
  }

  get angle() {
    return this.getAngle();
  }

  set angle(value) {
    this.setAngle(value);
  }

  get length() {
    return this.getLength();
  }

  set length(value) {
    this.setLength(value);
  }

  getAngleInRadians(/* point */) {
    if (!arguments.length) {
      if (this.isZero()) {
        // Return the preserved angle in case the vector has no
        // length, and update the internal _angle in case the
        // vector has a length. See #setAngle() for more
        // explanations.
        return this._angle || 0;
      }
      this._angle = Math.atan2(this.y, this.x);
      return this._angle;
    } else {
      const point = new Point(...arguments);
      const div = this.getLength() * point.getLength();
      if (Numerical.isZero(div)) {
        return NaN;
      } else {
        const a = this.dot(point) / div;
        return Math.acos(a < -1 ? -1 : a > 1 ? 1 : a);
      }
    }
  }

  setAngleInRadians(angle) {
    // We store a reference to _angle internally so we still preserve it
    // when the vector's length is set to zero, and then anything else.
    // Note that we cannot rely on it if x and y are something else than 0,
    // since updating x / y does not automatically change _angle!
    this._angle = angle;
    if (!this.isZero()) {
      const length = this.getLength();
      this.x = Math.cos(angle) * length;
      this.y = Math.sin(angle) * length;
    }
  }

  getAngle(/* point */) {
    return (this.getAngleInRadians.apply(this, arguments) * 180) / Math.PI;
  }

  setAngle(angle) {
    this.setAngleInRadians((angle * Math.PI) / 180);
  }

  getQuadrant() {
    return this.x >= 0 ? (this.y >= 0 ? 1 : 4) : this.y >= 0 ? 2 : 3;
  }

  getDistance(point, squared) {
    const x = point.x - this.x;
    const y = point.y - this.y;
    const d = x * x + y * y;
    return squared ? d : Math.sqrt(d);
  }

  isClose(point, tolerance = Numerical.GEOMETRIC_EPSILON) {
    return this.getDistance(point) <= tolerance;
  }

  /**
   * Checks if the vector is within the specified quadrant. Note that if the
   * vector lies on the boundary between two quadrants, `true` will be
   * returned for both quadrants.
   */
  isInQuadrant(q) {
    // Map quadrant to x & y coordinate pairs and multiply with coordinates,
    // then check sign:
    // 1: [ 1,  1]
    // 2: [-1,  1]
    // 3: [-1, -1]
    // 4: [ 1, -1]
    return this.x * (q > 1 && q < 4 ? -1 : 1) >= 0 && this.y * (q > 2 ? -1 : 1) >= 0;
  }

  dot(point) {
    return this.x * point.x + this.y * point.y;
  }

  cross(point) {
    return this.x * point.y - this.y * point.x;
  }

  project(point) {
    const scale = point.isZero() ? 0 : this.dot(point) / point.dot(point);
    return new Point(point.x * scale, point.y * scale);
  }

  getDirectedAngle(point) {
    return (Math.atan2(this.cross(point), this.dot(point)) * 180) / Math.PI;
  }

  /**
   * Normalize modifies the length of the vector to `1` without
   * changing its angle and returns it as a new point. The optional `length`
   * parameter defines the length to normalize to. The object itself is not
   * modified!
   */
  normalize(length) {
    if (length === undefined) {
      length = 1;
    }
    const current = this.getLength();
    const scale = current !== 0 ? length / current : 0;
    const point = new Point(this.x * scale, this.y * scale);
    // Preserve angle.
    if (scale >= 0) {
      point._angle = this._angle;
    }
    return point;
  }

  /**
   * Rotates the point by the given angle around an optional center point.
   * The object itself is not modified.
   *
   * Read more about angle units and orientation in the description of the
   * angle property.
   */
  rotate(angle, center) {
    if (angle === 0) {
      return this.clone();
    }
    angle = (angle * Math.PI) / 180;
    const { x, y } = center ? this.subtract(center) : this;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const point = new Point(x * cos - y * sin, x * sin + y * cos);
    return center ? point.add(center) : point;
  }

  /**
   * Transforms the point by the matrix as a new point. The object itself is
   * not modified!
   */
  transform(matrix) {
    return matrix ? matrix._transformPoint(this) : this;
  }

  add(point) {
    return new Point(this.x + point.x, this.y + point.y);
  }

  subtract(point) {
    return new Point(this.x - point.x, this.y - point.y);
  }

  multiply(point) {
    return new Point(this.x * point.x, this.y * point.y);
  }

  divide(point) {
    return new Point(this.x / point.x, this.y / point.y);
  }

  modulo(point) {
    return new Point(this.x % point.x, this.y % point.y);
  }

  negate() {
    return new Point(-this.x, -this.y);
  }

  isInside(rect) {
    return rect.contains(this);
  }

  isCollinear(point) {
    return Point.isCollinear(this.x, this.y, point.x, point.y);
  }

  isOrthogonal(point) {
    return Point.isOrthogonal(this.x, this.y, point.x, point.y);
  }

  isNaN() {
    return isNaN(this.x) || isNaN(this.y);
  }

  round() {
    return new Point(Math.round(this.x), Math.round(this.y));
  }

  ceil() {
    return new Point(Math.ceil(this.x), Math.ceil(this.y));
  }

  floor() {
    return new Point(Math.floor(this.x), Math.floor(this.y));
  }

  abs() {
    return new Point(Math.abs(this.x), Math.abs(this.y));
  }

  static min(point1, point2) {
    return new Point(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
  }

  static max(point1, point2) {
    return new Point(Math.max(point1.x, point2.x), Math.max(point1.y, point2.y));
  }

  static random() {
    return new Point(Math.random(), Math.random());
  }

  static isCollinear(x1, y1, x2, y2) {
    // NOTE: We use normalized vectors so that the epsilon comparison is
    // reliable. We could instead scale the epsilon based on the vector
    // length. But instead of normalizing the vectors before calculating
    // the cross product, we can scale the epsilon accordingly.
    return (
      Math.abs(x1 * y2 - y1 * x2) <=
      Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)) * Numerical.TRIGONOMETRIC_EPSILON
    );
  }

  static isOrthogonal(x1, y1, x2, y2) {
    // See Point.isCollinear()
    return (
      Math.abs(x1 * x2 + y1 * y2) <=
      Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)) * Numerical.TRIGONOMETRIC_EPSILON
    );
  }
}

export default Point;
