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

describe('Rectangle', () => {
  test('new Rectangle(Point, Size)', () => {
    const rect = new Rectangle(new Point(10, 20), new Size(30, 40));
    expect(rect.toString()).toEqual('{ x: 10, y: 20, width: 30, height: 40 }');
  });

  test('new Rectangle({ point, size })', () => {
    let rect = new Rectangle({ point: new Point(10, 20), size: new Size(30, 40) });
    expect(rect.toString()).toEqual('{ x: 10, y: 20, width: 30, height: 40 }');

    rect = new Rectangle({ point: [10, 20], size: [30, 40] });
    expect(rect.toString()).toEqual('{ x: 10, y: 20, width: 30, height: 40 }');
  });

  test('new Rectangle(Array, Array)', () => {
    const rect = new Rectangle([10, 20], [30, 40]);
    expect(rect.toString()).toEqual('{ x: 10, y: 20, width: 30, height: 40 }');
  });

  test('new Rectangle(Point, Point)', () => {
    const rect = new Rectangle(new Point(10, 20), new Point(33, 48));
    expect(rect.toString()).toEqual('{ x: 10, y: 20, width: 23, height: 28 }');
  });

  test('new Rectangle(Point, Point, reversed)', () => {
    const rect = new Rectangle(new Point(33, 48), new Point(10, 20));
    expect(rect.toString()).toEqual('{ x: 10, y: 20, width: 23, height: 28 }');
  });

  test('new Rectangle({ top, left, right, bottom })', () => {
    const rect = new Rectangle({ left: 10, top: 20, right: 40, bottom: 60 });
    expect(rect.toString()).toEqual('{ x: 10, y: 20, width: 30, height: 40 }');
  });

  test('new Rectangle({ from, to })', () => {
    const rect = new Rectangle({ from: [10, 20], to: [40, 60] });
    expect(rect.toString()).toEqual('{ x: 10, y: 20, width: 30, height: 40 }');
  });

  test('new Rectangle({ to, from })', () => {
    const rect = new Rectangle({ to: [10, 20], from: [40, 60] });
    expect(rect.toString()).toEqual('{ x: 10, y: 20, width: 30, height: 40 }');
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
    const equalRectString = new Rectangle({
      top: expected.top,
      right: expected.right,
      bottom: expected.bottom,
      left: expected.left,
    }).toString();

    function testProperties(key1, key2) {
      const obj = {};
      obj[key1] = expected[key1];
      obj[key2] = expected[key2];
      const rect = new Rectangle(obj);
      expect(rect.toString()).toEqual(equalRectString);
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

  test('rect.topRight', () => {
    let rect = new Rectangle(10, 10, 20, 20);
    let point = rect.topRight;
    expect(point.equals({ x: 30, y: 10 })).toBeTruthy();

    rect = new Rectangle(10, 10, 20, 20);
    rect.topRight = [10, 15];
    point = rect.topRight;
    expect(point.equals({ x: 10, y: 15 })).toBeTruthy();
  });

  test('rect.bottomLeft', () => {
    let rect = new Rectangle(10, 10, 20, 20);
    let point = rect.bottomLeft;
    expect(point.equals({ x: 10, y: 30 })).toBeTruthy();

    rect = new Rectangle(10, 10, 20, 20);
    rect.bottomLeft = [10, 15];
    point = rect.bottomLeft;
    expect(point.equals({ x: 10, y: 15 })).toBeTruthy();
  });

  test('rect.bottomRight', () => {
    let rect = new Rectangle(10, 10, 20, 20);
    let point = rect.bottomRight;
    expect(point.equals({ x: 30, y: 30 })).toBeTruthy();

    rect = new Rectangle(10, 10, 20, 20);
    rect.bottomRight = [10, 15];
    point = rect.bottomRight;
    expect(point.equals({ x: 10, y: 15 })).toBeTruthy();
  });

  test('rect.bottomCenter', () => {
    let rect = new Rectangle(10, 10, 20, 20);
    let point = rect.bottomCenter;
    expect(point.equals({ x: 20, y: 30 })).toBeTruthy();

    rect = new Rectangle(10, 10, 20, 20);
    rect.bottomCenter = [10, 15];
    point = rect.bottomCenter;
    expect(point.equals({ x: 10, y: 15 })).toBeTruthy();
  });

  test('rect.topCenter', () => {
    let rect = new Rectangle(10, 10, 20, 20);
    let point = rect.topCenter;
    expect(point.equals({ x: 20, y: 10 })).toBeTruthy();

    rect = new Rectangle(10, 10, 20, 20);
    rect.topCenter = [10, 15];
    point = rect.topCenter;
    expect(point.equals({ x: 10, y: 15 })).toBeTruthy();
  });

  test('rect.leftCenter', () => {
    let rect = new Rectangle(10, 10, 20, 20);
    let point = rect.leftCenter;
    expect(point.equals({ x: 10, y: 20 })).toBeTruthy();

    rect = new Rectangle(10, 10, 20, 20);
    rect.leftCenter = [10, 15];
    point = rect.leftCenter;
    expect(point.equals({ x: 10, y: 15 })).toBeTruthy();
  });

  test('rect.rightCenter', () => {
    let rect = new Rectangle(10, 10, 20, 20);
    let point = rect.rightCenter;
    expect(point.equals({ x: 30, y: 20 })).toBeTruthy();

    rect = new Rectangle(10, 10, 20, 20);
    rect.rightCenter = [10, 15];
    point = rect.rightCenter;
    expect(point.equals({ x: 10, y: 15 })).toBeTruthy();
  });

  test('rect1.intersects(rect2)', () => {
    let rect1 = new Rectangle(160, 270, 20, 20);
    let rect2 = new Rectangle(195, 301, 19, 19);
    expect(rect1.intersects(rect2)).toBeFalsy();

    rect1 = new Rectangle(160, 270, 20, 20);
    rect2 = new Rectangle(170.5, 280.5, 19, 19);
    expect(rect1.intersects(rect2)).toBeTruthy();
  });

  test('rect1.intersects(rect2 from array)', () => {
    let rect1 = new Rectangle(160, 270, 20, 20);
    let rect2Array = [195, 301, 19, 19];
    expect(rect1.intersects(rect2Array)).toBeFalsy();

    rect1 = new Rectangle(160, 270, 20, 20);
    rect2Array = [170.5, 280.5, 19, 19];
    expect(rect1.intersects(rect2Array)).toBeTruthy();
  });

  test('rect1.contains(rect2)', () => {
    let rect1 = new Rectangle(160, 270, 20, 20);
    let rect2 = new Rectangle(195, 301, 19, 19);
    expect(rect1.contains(rect2)).toBeFalsy();

    rect1 = new Rectangle(160, 270, 20, 20);
    rect2 = new Rectangle(170.5, 280.5, 19, 19);
    expect(rect1.contains(rect2)).toBeFalsy();

    rect1 = new Rectangle(299, 161, 137, 129);
    rect2 = new Rectangle(340, 197, 61, 61);
    expect(rect1.contains(rect2)).toBeTruthy();
    expect(rect2.contains(rect1)).toBeFalsy();
  });

  test('rect.contains(point)', () => {
    const rect = new Rectangle(160, 270, 20, 20);
    let point = new Point(166, 280);
    expect(rect.contains(point)).toBeTruthy();

    point = new Point(30, 30);
    expect(rect.contains(point)).toBeFalsy();
  });

  test('rect.contains(array)', () => {
    const rect = new Rectangle(160, 270, 20, 20);
    let point = [166, 280];
    expect(rect.contains(point)).toBeTruthy();

    point = [30, 30];
    expect(rect.contains(point)).toBeFalsy();
  });

  test('rect1.intersect(rect2)', () => {
    const rect1 = new Rectangle(160, 270, 20, 20);
    const rect2 = new Rectangle(170.5, 280.5, 19, 19);
    const intersected = rect1.intersect(rect2);
    expect(intersected.equals(new Rectangle(170.5, 280.5, 9.5, 9.5))).toBeTruthy();
  });

  test('rect1.unite(rect2)', () => {
    const rect1 = new Rectangle(160, 270, 20, 20);
    const rect2 = new Rectangle(170.5, 280.5, 19, 19);
    const united = rect1.unite(rect2);
    expect(united.equals(new Rectangle(160, 270, 29.5, 29.5))).toBeTruthy();
  });

  test('rect.include(point)', () => {
    const rect1 = new Rectangle(95, 151, 20, 20);
    const included = rect1.include([50, 50]);
    expect(included.equals(new Rectangle(50, 50, 65, 121))).toBeTruthy();
  });

  test('rect.toString()', () => {
    const string = new Rectangle(10, 20, 30, 40).toString();
    expect(string).toEqual('{ x: 10, y: 20, width: 30, height: 40 }');
  });
});
