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

import Point from '../point';
import Size from '../size';

describe('Point', () => {
  test('new Point(10, 20)', () => {
    const point = new Point(10, 20);
    expect(point.x).toEqual(10);
    expect(point.y).toEqual(20);
  });

  test('new Point([10, 20])', () => {
    const point = new Point([10, 20]);
    expect(point.x).toEqual(10);
    expect(point.y).toEqual(20);
  });

  test('new Point({x: 10, y: 20})', () => {
    const point = new Point({ x: 10, y: 20 });
    expect(point.x).toEqual(10);
    expect(point.y).toEqual(20);
  });

  test('new Point(new Size(10, 20))', () => {
    expect(new Point(new Size(10, 20))).toEqual(new Point(10, 20));
  });

  test('new Point({ width: 10, height: 20})', () => {
    expect(new Point({ width: 10, height: 20 })).toEqual(new Point(10, 20));
  });

  test('new Point({ angle: 40, length: 20})', () => {
    const pointFromAngle = new Point({ angle: 40, length: 20 });
    const expectedPoint = new Point(15.32088886, 12.85575219);
    expect(pointFromAngle.isClose(expectedPoint)).toBeTruthy();
  });

  test('normalize(length)', () => {
    const point = new Point(0, 10).normalize(20);
    expect(point).toEqual(new Point(0, 20));
  });

  test('set length', () => {
    const point = new Point(0, 10);
    point.length = 20;
    expect(point).toEqual(new Point(0, 20));
  });

  test('get angle', () => {
    const angle = new Point(0, 10).angle;
    expect(angle).toEqual(90);
  });

  test('getAngle(point)', () => {
    const angle = new Point(0, 10).getAngle([10, 10]);
    expect(Math.round(angle)).toEqual(45);
  });

  test('rotate(degrees)', () => {
    const point = new Point(100, 50).rotate(90);
    expect(point.isClose(new Point(-50, 100))).toBeTruthy();
    expect(point.round()).toEqual(new Point(-50, 100));
  });

  test('set angle', () => {
    const point = new Point(10, 20);
    point.angle = 92;
    expect(point.angle).toEqual(92);
    expect(point).toEqual(
      new Point({
        angle: 92,
        length: Math.sqrt(10 * 10 + 20 * 20),
      }),
    );
  });

  test('set angle & length', () => {
    const point1 = new Point();
    point1.length = Math.SQRT2;
    point1.angle = -45;

    const point2 = new Point();
    point2.angle = -45;
    point2.length = Math.SQRT2;

    expect(point2).toEqual(point1);
  });

  test('getting angle after x / y change', () => {
    const vector = new Point(1, 0);
    expect(vector.angle).toEqual(0);
    vector.x = 0;
    vector.y = 1;
    expect(vector.angle).toEqual(90);
  });

  test('getDirectedAngle(point)', () => {
    expect(new Point(10, 10).getDirectedAngle(new Point(1, 0))).toEqual(-45);
    expect(new Point(-10, 10).getDirectedAngle(new Point(1, 0))).toEqual(-135);
    expect(new Point(-10, -10).getDirectedAngle(new Point(1, 0))).toEqual(135);
    expect(new Point(10, -10).getDirectedAngle(new Point(1, 0))).toEqual(45);
  });

  test('equals()', () => {
    expect(new Point(10, 10).equals([10, 10])).toBeTruthy();
    expect(new Point(0, 0).equals({})).toBeTruthy();
    expect(new Point(0, 0).equals(null)).toBeTruthy();
    expect(new Point({ length: 10, angle: 90 }).equals([0, 10])).toBeTruthy();
    expect(new Point([0, 10]).equals({ length: 10, angle: 90 })).toBeTruthy();
  });

  test('isCollinear()', function() {
    expect(new Point(10, 5).isCollinear(new Point(20, 10))).toBeTruthy();
    expect(new Point(5, 10).isCollinear(new Point(-5, -10))).toBeTruthy();
    expect(new Point(10, 10).isCollinear(new Point(20, 10))).toBeFalsy();
    expect(new Point(10, 10).isCollinear(new Point(10, -10))).toBeFalsy();
  });

  test('isOrthogonal()', function() {
    expect(new Point(10, 5).isOrthogonal(new Point(5, -10))).toBeTruthy();
    expect(new Point(5, 10).isOrthogonal(new Point(-10, 5))).toBeTruthy();
    expect(new Point(10, 10).isOrthogonal(new Point(20, 20))).toBeFalsy();
    expect(new Point(10, 10).isOrthogonal(new Point(10, -20))).toBeFalsy();
  });

  test('isZero()', () => {
    const point = new Point();
    expect(point.isZero()).toBeTruthy();
  });

  test('clone', () => {
    const point = new Point([10, 20]).clone();
    expect(point.toString()).toEqual('{ x: 10, y: 20 }');
  });
});
