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
});
