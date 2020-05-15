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

// import Numerical from './numerical';
import Point from '../point';
import Size from '../size';
import Rectangle from '../rectangle';

describe('Size', () => {
  test('new Rectangle(Point, Size)', () => {
    const rect = new Rectangle(new Point(10, 20), new Size(30, 40));
    expect(rect).toEqual(new Rectangle(10, 20, 30, 40));
  });

  test('new Rectangle({ point, size })', () => {
    let rect = new Rectangle({ point: [10, 20], size: [30, 40] });
    expect(rect).toEqual(new Rectangle(10, 20, 30, 40));
    rect = new Rectangle({ point: new Point(10, 20), size: new Size(30, 40) });
    expect(rect).toEqual(new Rectangle(10, 20, 30, 40));
  });

  test('new Rectangle(Array, Array)', () => {
    const rect = new Rectangle([10, 20], [30, 40]);
    expect(rect).toEqual(new Rectangle(10, 20, 30, 40));
  });

  test('new Rectangle(Point, Point)', () => {
    const rect = new Rectangle(new Point(10, 20), new Point(30, 40));
    expect(rect).toEqual(new Rectangle(10, 20, 20, 20));
  });

  test('new Rectangle({ from, to })', () => {
    const rect = new Rectangle({ from: [10, 20], to: [30, 40] });
    expect(rect).toEqual(new Rectangle(10, 20, 20, 20));
  });

  test('new Rectangle({ to, from })', () => {
    const rect = new Rectangle({ to: [10, 20], from: [30, 40] });
    expect(rect).toEqual(new Rectangle(10, 20, 20, 20));
  });

  test('new Rectangle(x, y, width, height)', () => {
    const rect = new Rectangle(10, 20, 30, 40);
    expect(rect).toEqual(new Rectangle(10, 20, 30, 40));
  });

  test('new Rectangle({ x, y, width, height })', () => {
    const rect = new Rectangle({ x: 10, y: 20, width: 30, height: 40 });
    expect(rect).toEqual(new Rectangle(10, 20, 30, 40));
  });

  test('new Rectangle(object)', () => {
    const expected = new Rectangle(100, 50, 100, 200);
    const equalRect = new Rectangle({
      top: expected.top,
      right: expected.right,
      bottom: expected.bottom,
      left: expected.left,
    });

    function testProperties(key1, key2) {
      const obj = {};
      obj[key1] = expected[key1];
      obj[key2] = expected[key2];
      const rect = new Rectangle(obj);
      expect(rect).toEqual(equalRect);
    }

    const tests = [
      ['center', 'size'],
      ['topLeft', 'size'],
      ['topRight', 'size'],
      ['bottomRight', 'size'],
      ['bottomLeft', 'size'],
      ['leftCenter', 'size'],
      ['topCenter', 'size'],
      ['rightCenter', 'size'],
      ['bottomCenter', 'size'],
      ['topLeft', 'bottomRight'],
      ['topRight', 'bottomLeft'],
      ['topLeft', 'bottomCenter'],
      ['topLeft', 'rightCenter'],
      ['topRight', 'bottomCenter'],
      ['topRight', 'leftCenter'],
      ['bottomLeft', 'topCenter'],
      ['bottomLeft', 'rightCenter'],
      ['bottomRight', 'topCenter'],
      ['bottomRight', 'leftCenter'],
    ];

    tests.forEach(function(test) {
      testProperties(test[0], test[1]);
      testProperties(test[1], test[0]);
    });
  });

  test('rect.left / rect.top VS rect.right / rect.bottom', () => {
    let rect = new Rectangle({
      point: [0, 0],
      size: [100, 100],
    });
    rect.left -= 10;
    rect.top -= 10;
    expect(rect.right).toEqual(90);
    expect(rect.bottom).toEqual(90);

    rect = new Rectangle([0, 0], [100, 100]);
    rect.left -= 10;
    rect.top -= 10;
    expect(rect.right).toEqual(90);
    expect(rect.bottom).toEqual(90);

    rect = new Rectangle({
      topLeft: [0, 0],
      bottomRight: [100, 100],
    });
    rect.left += 10;
    rect.top += 10;
    expect(rect.right).toEqual(110);
    expect(rect.bottom).toEqual(110);
  });

  test('rect.size', () => {
    const rect = new Rectangle(10, 10, 20, 30);
    expect(rect.size.equals([20, 30])).toBeTruthy();
    rect.size = [30, 40];
    expect(rect).toEqual(new Rectangle(10, 10, 30, 40));
  });

  test('rect.center', () => {
    const rect = new Rectangle(10, 10, 20, 30);
    expect(rect.size.equals(new Size(20, 30))).toBeTruthy();
    expect(rect.center.equals(new Point(20, 25))).toBeTruthy();

    rect.center = [100, 100];
    expect(rect.center.equals(new Point(100, 100))).toBeTruthy();
    expect(rect.size.equals(new Size(20, 30))).toBeTruthy();

    rect.center = [200, 200];
    expect(rect.center.equals(new Point(200, 200))).toBeTruthy();
    expect(rect.size.equals(new Size(20, 30))).toBeTruthy();
  });

  test('rect.topLeft', () => {
    const rect = new Rectangle(10, 10, 20, 20);
    let point = rect.topLeft;
    expect(point.equals({ x: 10, y: 10 })).toBeTruthy();

    rect.topLeft = [10, 15];
    point = rect.topLeft;
    expect(point.equals({ x: 10, y: 15 })).toBeTruthy();
  });
});
