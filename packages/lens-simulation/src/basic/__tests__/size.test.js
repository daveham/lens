/*
 * Derived from Paper.js, evolved with Ramda.js.
 *
 * Ramda.js - A practical functional library for JavaScript programmers.
 * http://ramdajs.com
 *
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

import Point from '../point';
import Size from '../size';

describe('Size', () => {
  test('new Size(10, 20)', () => {
    const size = new Size(10, 20);
    expect(size.toString()).toEqual('{ width: 10, height: 20 }');
  });

  test('new Size([10, 20])', () => {
    const size = new Size([10, 20]);
    expect(size.toString()).toEqual('{ width: 10, height: 20 }');
  });

  test('new Size({width: 10, height: 20})', () => {
    const size = new Size({ width: 10, height: 20 });
    expect(size.toString()).toEqual('{ width: 10, height: 20 }');
  });

  test('new Size(new Point(10, 20))', () => {
    const size = new Size(new Point(10, 20));
    expect(size.toString()).toEqual('{ width: 10, height: 20 }');
  });

  test('new Size({ x: 10, y: 20})', () => {
    const size = new Size({ x: 10, y: 20 });
    expect(size.toString()).toEqual('{ width: 10, height: 20 }');
  });

  test('size.clone', () => {
    const size = new Size([10, 20]).clone();
    expect(size.toString()).toEqual('{ width: 10, height: 20 }');
  });

  test('size.add', () => {
    const size = new Size([10, 20]).add({ width: 5, height: 7 });
    expect(size.toString()).toEqual('{ width: 15, height: 27 }');
  });

  test('size.subtract', () => {
    const size = new Size([10, 20]).subtract({ width: 4, height: 2 });
    expect(size.toString()).toEqual('{ width: 6, height: 18 }');
  });

  test('size.multiply', () => {
    const size = new Size([10, 20]).multiply({ width: 6, height: 4 });
    expect(size.toString()).toEqual('{ width: 60, height: 80 }');
  });

  test('size.divide', () => {
    const size = new Size([10, 20]).divide({ width: 5, height: 4 });
    expect(size.toString()).toEqual('{ width: 2, height: 5 }');
  });

  test('size.modulo', () => {
    const size = new Size([10, 20]).modulo({ width: 3, height: 7 });
    expect(size.toString()).toEqual('{ width: 1, height: 6 }');
  });

  test('size.negate', () => {
    const size = new Size([10, 20]).negate();
    expect(size.toString()).toEqual('{ width: -10, height: -20 }');
  });

  test('size.isZero', () => {
    const size = new Size();
    expect(size.isZero()).toBeTruthy();
  });

  test('Size.min', () => {
    const size1 = new Size(6, 13);
    const size2 = new Size(14, 7);
    const size = Size.min(size1, size2);
    expect(size.toString()).toEqual('{ width: 6, height: 7 }');
  });

  test('Size.max', () => {
    const size1 = new Size(6, 13);
    const size2 = new Size(14, 7);
    const size = Size.max(size1, size2);
    expect(size.toString()).toEqual('{ width: 14, height: 13 }');
  });
});
