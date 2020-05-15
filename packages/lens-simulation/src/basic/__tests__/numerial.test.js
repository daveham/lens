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

import Numerical from '../numerical';

describe('Numerical', () => {
  test('solveQuadratic()', () => {
    function solve(s) {
      const roots = [];
      // const count =
      Numerical.solveQuadratic(s, 0, -s, roots);
      return roots;
    }

    const expected = [1, -1];

    expect(solve(1)).toEqual(expected);
    expect(solve(Numerical.EPSILON)).toEqual(expected);
  });

  test('solveCubic', () => {
    function solve(s) {
      const roots = [];
      // const count =
      Numerical.solveCubic(0.5 * s, -s, -s, -s, roots);
      return roots;
    }

    const expected = [2.919639565839418];

    expect(solve(1)).toEqual(expected);
    expect(solve(Numerical.EPSILON)).toEqual(expected);
  });
});
