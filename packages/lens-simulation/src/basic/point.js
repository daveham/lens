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
import { getXAndYFromArguments } from './common';

const toDegrees = radians => (radians * 180) / Math.PI;
const toRadians = degrees => (degrees * Math.PI) / 180;

// angle is in radians
const locationFromLengthAndAngle = (length, angle = 0) =>
  length ? [Math.cos(angle) * length, Math.sin(angle) * length] : [0, 0];

const rotateLocation = (angle, x, y) => {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  return [x * cos - y * sin, x * sin + y * cos];
};

class Point {
  x;
  y;

  constructor(...args) {
    let angleFlag;
    [this.x, this.y, angleFlag] = getXAndYFromArguments(args);

    if (angleFlag) {
      // The argument was a point specified with length and angle (in degrees)
      // so an extra step is required to get x, y from length, angle.
      // Currently, this.x = requested length, this.y = requested angle (degrees).
      this._angle = toRadians(this.y);
      [this.x, this.y] = rotateLocation(this._angle, this.x, 0);
    }
  }

  equals(...args) {
    let [x, y, angleFlag] = getXAndYFromArguments(args);

    if (angleFlag) {
      // The argument was a point specified with length and angle (in degrees)
      // so an extra step is required to get x, y from length, angle.
      // Currently, this.x = requested length, this.y = requested angle (degrees).
      [x, y] = rotateLocation(toRadians(y), x, 0);
    }

    return Numerical.isZero(this.subtract([x, y]));
  }

  clone() {
    return new Point(this);
  }

  toString() {
    return `{ x: ${this.x}, y: ${this.y} }`;
  }

  isZero() {
    return Numerical.isZero(this);
  }

  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  setLength(length) {
    if (this.isZero()) {
      [this.x, this.y] = locationFromLengthAndAngle(length, this._angle);
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

  getAngleInRadians(/* point */ ...args) {
    if (args.length) {
      const point = new Point(...args);
      const div = this.getLength() * point.getLength();
      if (Numerical.isZero(div)) {
        return NaN;
      }
      const a = this.dot(point) / div;
      return Math.acos(a < -1 ? -1 : a > 1 ? 1 : a);
    }

    if (!this.isZero()) {
      this._angle = Math.atan2(this.y, this.x);
    }
    // Return the preserved angle in case the vector has no
    // length, and update the internal _angle in case the
    // vector has a length. See #setAngle() for more
    // explanations.
    return this._angle || 0;
  }

  setAngleInRadians(angle) {
    // We store a reference to _angle internally so we still preserve it
    // when the vector's length is set to zero, and then anything else.
    // Note that we cannot rely on it if x and y are something else than 0,
    // since updating x / y does not automatically change _angle!
    this._angle = angle;
    if (!this.isZero()) {
      [this.x, this.y] = locationFromLengthAndAngle(this.getLength(), angle);
    }
  }

  // Returns the smaller angle between two vectors. The angle is unsigned, no
  // information about rotational direction is given.
  getAngle(/* point */ ...args) {
    return toDegrees(this.getAngleInRadians(...args));
  }

  setAngle(angle) {
    this.setAngleInRadians(toRadians(angle));
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

  dot(...args) {
    const [x, y] = getXAndYFromArguments(args);
    return this.x * x + this.y * y;
  }

  cross(...args) {
    const [x, y] = getXAndYFromArguments(args);
    return this.x * y - this.y * x;
  }

  project(point) {
    const scale = point.isZero() ? 0 : this.dot(point) / point.dot(point);
    return new Point(point.x * scale, point.y * scale);
  }

  getDirectedAngle(point) {
    return toDegrees(Math.atan2(this.cross(point), this.dot(point)));
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
    const { x, y } = center ? this.subtract(center) : this;
    const point = new Point(rotateLocation(toRadians(angle), x, y));
    return center ? point.add(center) : point;
  }

  /**
   * Transforms the point by the matrix as a new point. The object itself is
   * not modified!
   */
  transform(matrix) {
    return matrix ? matrix._transformPoint(this) : this;
  }

  add(...args) {
    const [x, y] = getXAndYFromArguments(args);
    return new Point(this.x + x, this.y + y);
  }

  subtract(...args) {
    const [x, y] = getXAndYFromArguments(args);
    return new Point(this.x - x, this.y - y);
  }

  multiply(...args) {
    const [x, y] = getXAndYFromArguments(args);
    return new Point(this.x * x, this.y * y);
  }

  divide(...args) {
    const [x, y] = getXAndYFromArguments(args);
    return new Point(this.x / x, this.y / y);
  }

  modulo(...args) {
    const [x, y] = getXAndYFromArguments(args);
    return new Point(this.x % x, this.y % y);
  }

  negate() {
    return new Point(-this.x, -this.y);
  }

  isInside(rect) {
    return rect.contains(this);
  }

  isCollinear(...args) {
    const [x, y] = getXAndYFromArguments(args);
    return Point.isCollinear(this.x, this.y, x, y);
  }

  isOrthogonal(...args) {
    const [x, y] = getXAndYFromArguments(args);
    return Point.isOrthogonal(this.x, this.y, x, y);
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
