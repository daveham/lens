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

import Numerical from '../numerical';

describe('Numerical', () => {
  describe('isZero', () => {
    test('from EPSILON', () => {
      expect(Numerical.isZero(0)).toBeTruthy();
      expect(Numerical.isZero(1)).toBeFalsy();
      expect(Numerical.isZero(Numerical.EPSILON)).toBeTruthy();
      expect(Numerical.isZero(Numerical.EPSILON + Numerical.EPSILON)).toBeFalsy();
    });

    test('from [EPSILON, EPSILON]', () => {
      expect(Numerical.isZero([0, 0])).toBeTruthy();
      expect(Numerical.isZero([1, 1])).toBeFalsy();
      expect(Numerical.isZero([Numerical.EPSILON, Numerical.EPSILON])).toBeTruthy();
      expect(
        Numerical.isZero([Numerical.EPSILON + Numerical.EPSILON, Numerical.EPSILON]),
      ).toBeFalsy();
    });

    test('from { x: EPSILON, y: EPSILON }', () => {
      expect(Numerical.isZero({ x: 0, y: 0 })).toBeTruthy();
      expect(Numerical.isZero({ x: 1, y: 1 })).toBeFalsy();
      expect(Numerical.isZero({ x: Numerical.EPSILON, y: Numerical.EPSILON })).toBeTruthy();
      expect(
        Numerical.isZero({ x: Numerical.EPSILON + Numerical.EPSILON, y: Numerical.EPSILON }),
      ).toBeFalsy();
    });

    test('from { width: EPSILON, height: EPSILON }', () => {
      expect(Numerical.isZero({ width: 0, height: 0 })).toBeTruthy();
      expect(Numerical.isZero({ width: 1, height: 1 })).toBeFalsy();
      expect(
        Numerical.isZero({ width: Numerical.EPSILON, height: Numerical.EPSILON }),
      ).toBeTruthy();
      expect(
        Numerical.isZero({
          width: Numerical.EPSILON + Numerical.EPSILON,
          height: Numerical.EPSILON + Numerical.EPSILON,
        }),
      ).toBeFalsy();
    });
  });

  describe('isMachineZero', () => {
    test('from MACHINE_EPSILON', () => {
      expect(Numerical.isMachineZero(0)).toBeTruthy();
      expect(Numerical.isMachineZero(1)).toBeFalsy();
      expect(Numerical.isMachineZero(Numerical.MACHINE_EPSILON)).toBeTruthy();
      expect(
        Numerical.isMachineZero(Numerical.MACHINE_EPSILON + Numerical.MACHINE_EPSILON),
      ).toBeFalsy();
    });

    test('from [MACHINE_EPSILON, MACHINE_EPSILON]', () => {
      expect(Numerical.isMachineZero([0, 0])).toBeTruthy();
      expect(Numerical.isMachineZero([1, 1])).toBeFalsy();
      expect(
        Numerical.isMachineZero([Numerical.MACHINE_EPSILON, Numerical.MACHINE_EPSILON]),
      ).toBeTruthy();
      expect(
        Numerical.isMachineZero([
          Numerical.MACHINE_EPSILON + Numerical.MACHINE_EPSILON,
          Numerical.MACHINE_EPSILON,
        ]),
      ).toBeFalsy();
    });

    test('from { x: MACHINE_EPSILON, y: MACHINE_EPSILON }', () => {
      expect(Numerical.isMachineZero({ x: 0, y: 0 })).toBeTruthy();
      expect(Numerical.isMachineZero({ x: 1, y: 1 })).toBeFalsy();
      expect(
        Numerical.isMachineZero({ x: Numerical.MACHINE_EPSILON, y: Numerical.MACHINE_EPSILON }),
      ).toBeTruthy();
      expect(
        Numerical.isMachineZero({
          x: Numerical.MACHINE_EPSILON + Numerical.MACHINE_EPSILON,
          y: Numerical.MACHINE_EPSILON,
        }),
      ).toBeFalsy();
    });

    test('from { width: MACHINE_EPSILON, height: MACHINE_EPSILON }', () => {
      expect(Numerical.isMachineZero({ width: 0, height: 0 })).toBeTruthy();
      expect(Numerical.isMachineZero({ width: 1, height: 1 })).toBeFalsy();
      expect(
        Numerical.isZero({ width: Numerical.MACHINE_EPSILON, height: Numerical.MACHINE_EPSILON }),
      ).toBeTruthy();
      expect(
        Numerical.isMachineZero({
          width: Numerical.MACHINE_EPSILON + Numerical.MACHINE_EPSILON,
          height: Numerical.MACHINE_EPSILON + Numerical.MACHINE_EPSILON,
        }),
      ).toBeFalsy();
    });
  });

  describe('isGeometricZero', () => {
    test('from GEOMETRIC_EPSILON', () => {
      expect(Numerical.isGeometricZero(0)).toBeTruthy();
      expect(Numerical.isGeometricZero(1)).toBeFalsy();
      expect(Numerical.isGeometricZero(Numerical.GEOMETRIC_EPSILON)).toBeTruthy();
      expect(
        Numerical.isGeometricZero(Numerical.GEOMETRIC_EPSILON + Numerical.GEOMETRIC_EPSILON),
      ).toBeFalsy();
    });

    test('from [GEOMETRIC_EPSILON, GEOMETRIC_EPSILON]', () => {
      expect(Numerical.isGeometricZero([0, 0])).toBeTruthy();
      expect(Numerical.isGeometricZero([1, 1])).toBeFalsy();
      expect(
        Numerical.isGeometricZero([Numerical.GEOMETRIC_EPSILON, Numerical.GEOMETRIC_EPSILON]),
      ).toBeTruthy();
      expect(
        Numerical.isGeometricZero([
          Numerical.GEOMETRIC_EPSILON + Numerical.GEOMETRIC_EPSILON,
          Numerical.GEOMETRIC_EPSILON,
        ]),
      ).toBeFalsy();
    });

    test('from { x: GEOMETRIC_EPSILON, y: GEOMETRIC_EPSILON }', () => {
      expect(Numerical.isGeometricZero({ x: 0, y: 0 })).toBeTruthy();
      expect(Numerical.isGeometricZero({ x: 1, y: 1 })).toBeFalsy();
      expect(
        Numerical.isGeometricZero({
          x: Numerical.GEOMETRIC_EPSILON,
          y: Numerical.GEOMETRIC_EPSILON,
        }),
      ).toBeTruthy();
      expect(
        Numerical.isGeometricZero({
          x: Numerical.GEOMETRIC_EPSILON + Numerical.GEOMETRIC_EPSILON,
          y: Numerical.GEOMETRIC_EPSILON,
        }),
      ).toBeFalsy();
    });

    test('from { width: GEOMETRIC_EPSILON, height: GEOMETRIC_EPSILON }', () => {
      expect(Numerical.isMachineZero({ width: 0, height: 0 })).toBeTruthy();
      expect(Numerical.isMachineZero({ width: 1, height: 1 })).toBeFalsy();
      expect(
        Numerical.isGeometricZero({
          width: Numerical.GEOMETRIC_EPSILON,
          height: Numerical.GEOMETRIC_EPSILON,
        }),
      ).toBeTruthy();
      expect(
        Numerical.isGeometricZero({
          width: Numerical.GEOMETRIC_EPSILON + Numerical.GEOMETRIC_EPSILON,
          height: Numerical.GEOMETRIC_EPSILON + Numerical.GEOMETRIC_EPSILON,
        }),
      ).toBeFalsy();
    });
  });

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
