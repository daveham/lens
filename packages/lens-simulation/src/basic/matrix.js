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

// Based on goog.graphics.AffineTransform, as part of the Closure Library.
// Copyright 2008 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");

/**
 * An affine transformation matrix performs a linear mapping from 2D
 *     coordinates to other 2D coordinates that preserves the "straightness" and
 *     "parallelness" of lines.
 *
 * Such a coordinate transformation can be represented by a 3 row by 3
 * column matrix with an implied last row of `[ 0 0 1 ]`. This matrix
 * transforms source coordinates `(x, y)` into destination coordinates `(x',y')`
 * by considering them to be a column vector and multiplying the coordinate
 * vector by the matrix according to the following process:
 *
 *     [ x ]   [ a  c  tx ] [ x ]   [ a * x + c * y + tx ]
 *     [ y ] = [ b  d  ty ] [ y ] = [ b * x + d * y + ty ]
 *     [ 1 ]   [ 0  0  1  ] [ 1 ]   [         1          ]
 *
 * Note the locations of b and c.
 *
 * This class is optimized for speed and minimizes calculations based on its
 * knowledge of the underlying matrix (as opposed to say simply performing
 * matrix multiplication).
 */

import Point from './point';
import Rectangle from './rectangle';

const _defaultCenter = new Point(0, 0);

class Matrix {
  a;
  b;
  c;
  d;
  tx;
  ty;

  constructor(arg0, b, c, d, tx, ty) {
    const args = arguments;
    const count = args.length;
    if (count >= 6) {
      this.a = arg0;
      this.b = b;
      this.c = c;
      this.d = d;
      this.tx = tx;
      this.ty = ty;
    } else if (count === 1) {
      if (arg0 instanceof Matrix) {
        this.a = arg0.a;
        this.b = arg0.b;
        this.c = arg0.c;
        this.d = arg0.d;
        this.tx = arg0.tx;
        this.ty = arg0.ty;
      } else if (Array.isArray(args)) {
        this.a = arg0[0];
        this.b = arg0[1];
        this.c = arg0[2];
        this.d = arg0[3];
        this.tx = arg0[4];
        this.ty = arg0[5];
      } else {
        throw new Error('Unsupported matrix parameters');
      }
    } else if (!count) {
      this.reset();
    } else {
      throw new Error('Unsupported matrix parameters');
    }
  }

  reset() {
    this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
    return this;
  }

  clone() {
    return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
  }

  equals(mx) {
    return (
      mx === this ||
      (mx &&
        this.a === mx.a &&
        this.b === mx.b &&
        this.c === mx.c &&
        this.d === mx.d &&
        this.tx === mx.tx &&
        this.ty === mx.ty)
    );
  }

  toString() {
    return `[[${this.a}, ${this.c}, ${this.tx}], [${this.b}, ${this.d}, ${this.ty}]]`;
  }

  translate({ x, y }) {
    this.tx += x * this.a + y * this.c;
    this.ty += x * this.b + y * this.d;
    return this;
  }

  scale({ x, y }, center = _defaultCenter) {
    if (center) {
      this.translate(center);
    }
    this.a *= x;
    this.b *= x;
    this.c *= y;
    this.d *= y;
    if (center) {
      this.translate(center.negate());
    }
    return this;
  }

  rotate(angle, center = _defaultCenter) {
    angle *= Math.PI / 180;
    // Concatenate rotation matrix into this one
    const { x, y } = center;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const tx = x - x * cos + y * sin;
    const ty = y - x * sin - y * cos;
    const { a, b, c, d } = this;
    // const a = this._a;
    // const b = this._b;
    // const c = this._c;
    // const d = this._d;
    this.a = cos * a + sin * c;
    this.b = cos * b + sin * d;
    this.c = -sin * a + cos * c;
    this.d = -sin * b + cos * d;
    this.tx += tx * a + ty * c;
    this.ty += tx * b + ty * d;
    return this;
  }

  shear({ x, y }, center) {
    // Do not modify point, center, since that would change arguments of which
    // we're reading from!
    if (center) {
      this.translate(center);
    }
    const { a, b, c, d } = this;
    this.a += y * c;
    this.b += y * d;
    this.c += x * a;
    this.d += x * b;
    if (center) {
      this.translate(center.negate());
    }
    return this;
  }

  skew({ x, y }, center) {
    const toRadians = Math.PI / 180;
    const shear = new Point(Math.tan(x * toRadians), Math.tan(y * toRadians));
    return this.shear(shear, center);
  }

  append(mx) {
    if (mx) {
      const { a: a1, b: b1, c: c1, d: d1 } = this;
      // const a1 = this._a;
      // const b1 = this._b;
      // const c1 = this._c;
      // const d1 = this._d;
      const { a: a2, c: b2, b: c2, d: d2, tx: tx2, ty: ty2 } = mx;
      // const a2 = mx._a;
      // const b2 = mx._c;
      // const c2 = mx._b;
      // const d2 = mx._d;
      // const tx2 = mx._tx;
      // const ty2 = mx._ty;
      this.a = a2 * a1 + c2 * c1;
      this.c = b2 * a1 + d2 * c1;
      this.b = a2 * b1 + c2 * d1;
      this.d = b2 * b1 + d2 * d1;
      this.tx += tx2 * a1 + ty2 * c1;
      this.ty += tx2 * b1 + ty2 * d1;
    }
    return this;
  }

  prepend(mx) {
    if (mx) {
      const { a: a1, b: b1, c: c1, d: d1, tx: tx1, ty: ty1 } = this;
      // const a1 = this._a;
      // const b1 = this._b;
      // const c1 = this._c;
      // const d1 = this._d;
      // const tx1 = this._tx;
      // const ty1 = this._ty;
      const { a: a2, c: b2, b: c2, d: d2, tx: tx2, ty: ty2 } = mx;
      // const a2 = mx._a;
      // const b2 = mx._c;
      // const c2 = mx._b;
      // const d2 = mx._d;
      // const tx2 = mx._tx;
      // const ty2 = mx._ty;
      this.a = a2 * a1 + b2 * b1;
      this.c = a2 * c1 + b2 * d1;
      this.b = c2 * a1 + d2 * b1;
      this.d = c2 * c1 + d2 * d1;
      this.tx = a2 * tx1 + b2 * ty1 + tx2;
      this.ty = c2 * tx1 + d2 * ty1 + ty2;
    }
    return this;
  }

  appended(mx) {
    return this.clone().append(mx);
  }

  prepended(mx) {
    return this.clone().prepend(mx);
  }

  invert() {
    const { a, b, c, d, tx, ty } = this;
    const det = a * d - b * c;
    let res = null;
    if (det && !isNaN(det) && isFinite(tx) && isFinite(ty)) {
      this.a = d / det;
      this.b = -b / det;
      this.c = -c / det;
      this.d = a / det;
      this.tx = (c * ty - d * tx) / det;
      this.ty = (b * tx - a * ty) / det;
      res = this;
    }
    return res;
  }

  inverted() {
    return this.clone().invert();
  }

  isIdentity() {
    return (
      this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0
    );
  }

  isInvertible() {
    const det = this.a * this.d - this.c * this.b;
    return det && !isNaN(det) && isFinite(this.tx) && isFinite(this.ty);
  }

  isSingular() {
    return !this.isInvertible();
  }

  /**
   * A faster version of transform that only takes one point and does not
   * attempt to convert it.
   */
  _transformPoint({ x, y }, dest) {
    if (!dest) {
      dest = new Point();
    }
    dest.x = x * this.a + y * this.c + this.tx;
    dest.y = x * this.b + y * this.d + this.ty;
    return dest;
  }

  _transformCoordinates(src, dst, count) {
    const { a, b, c, d, tx, ty } = this;
    for (let i = 0, max = 2 * count; i < max; i += 2) {
      const x = src[i];
      const y = src[i + 1];
      dst[i] = x * a + y * c + tx;
      dst[i + 1] = x * b + y * d + ty;
    }
    return dst;
  }

  _transformCorners(rect) {
    const { x: x1, y: y1, width, height } = rect;
    const x2 = x1 + width;
    const y2 = y1 + height;
    const coords = [x1, y1, x2, y1, x2, y2, x1, y2];
    return this._transformCoordinates(coords, coords, 4);
  }

  /**
   * Returns the 'transformed' bounds rectangle by transforming each corner
   * point and finding the new bounding box to these points. This is not
   * really the transformed rectangle!
   */
  _transformBounds(bounds, dest) {
    const coords = this._transformCorners(bounds);
    const min = coords.slice(0, 2);
    const max = min.slice();
    for (let i = 2; i < 8; i++) {
      const val = coords[i];
      const j = i & 1;
      if (val < min[j]) {
        min[j] = val;
      } else if (val > max[j]) {
        max[j] = val;
      }
    }
    if (!dest) {
      dest = new Rectangle();
    }
    dest.x = min[0];
    dest.y = min[1];
    dest.width = max[0] - min[0];
    dest.height = max[1] - min[1];
  }

  transform(/* point | */ src, dst, count) {
    // TODO: Check for rectangle and use _transformBounds?
    return arguments.length < 3
      ? this._transformPoint(new Point(...arguments))
      : this._transformCoordinates(src, dst, count);
  }

  _inverseTransform(point, dest) {
    const { a, b, c, d, tx, ty } = this;
    // var a = this._a,
    //   b = this._b,
    //   c = this._c,
    //   d = this._d,
    //   tx = this._tx,
    //   ty = this._ty,
    const det = a * d - b * c;
    if (det && !isNaN(det) && isFinite(tx) && isFinite(ty)) {
      const x = point.x - this.tx;
      const y = point.y - this.ty;
      if (!dest) {
        dest = new Point();
      }
      dest.x = (x * d - y * c) / det;
      dest.y = (y * a - x * b) / det;
      return dest;
    }
    return null;
  }

  inverseTransform(/* point */) {
    return this._inverseTransform(new Point(...arguments));
  }

  getValues() {
    return [this.a, this.b, this.c, this.d, this.tx, this.ty];
  }

  getTranslation() {
    // No decomposition is required to extract translation.
    return new Point(this.tx, this.ty);
  }

  /**
   * Decomposes the affine transformation described by this matrix into
   * `scaling`, `rotation` and `skewing`, and returns an object with
   * these properties.
   */
  decompose() {
    // http://dev.w3.org/csswg/css3-2d-transforms/#matrix-decomposition
    // http://www.maths-informatique-jeux.com/blog/frederic/?post/2013/12/01/Decomposition-of-2D-transform-matrices
    // https://github.com/wisec/DOMinator/blob/master/layout/style/nsStyleAnimation.cpp#L946
    const { a, b, c, d } = this;
    // const a = this._a,
    //   b = this._b,
    //   c = this._c,
    //   d = this._d,
    const det = a * d - b * c;
    const sqrt = Math.sqrt;
    const atan2 = Math.atan2;
    const degrees = 180 / Math.PI;
    let rotate;
    let scale;
    let skew;
    if (a !== 0 || b !== 0) {
      const r = sqrt(a * a + b * b);
      rotate = Math.acos(a / r) * (b > 0 ? 1 : -1);
      scale = [r, det / r];
      skew = [atan2(a * c + b * d, r * r), 0];
    } else if (c !== 0 || d !== 0) {
      const s = sqrt(c * c + d * d);
      // rotate = Math.PI/2 - (d > 0 ? Math.acos(-c/s) : -Math.acos(c/s));
      rotate = Math.asin(c / s) * (d > 0 ? 1 : -1);
      scale = [det / s, s];
      skew = [0, atan2(a * c + b * d, s * s)];
    } else {
      // a = b = c = d = 0
      rotate = 0;
      skew = scale = [0, 0];
    }
    return {
      translation: this.getTranslation(),
      rotation: rotate * degrees,
      scaling: new Point(scale),
      skewing: new Point(skew[0] * degrees, skew[1] * degrees),
    };
  }

  getScaling() {
    return this.decompose().scaling;
  }

  getRotation() {
    return this.decompose().rotation;
  }
}

export default Matrix;
