import * as R from 'ramda';

import {
  getWidthAndHeightFrom,
  getWidthAndHeightFromArguments,
  getXAndYFromArguments,
  isHeadEmpty,
  isZeroFromArguments,
  twoEmptyNumbers,
} from '../common';

function testSizeWith(...args) {
  console.log('testSizeWith', { a: arguments, args });
  return getWidthAndHeightFromArguments(args);
}

function testPointWith(...args) {
  console.log('testPointWith', { a: arguments, args });
  return getXAndYFromArguments(args);
}

function testZeroWith(fn, ...args) {
  console.log('testZeroWith', { a: arguments, args });
  return isZeroFromArguments(fn)(args);
}

describe('common', () => {
  test('isEmpty', () => {
    expect(isHeadEmpty([])).toBeTruthy();
  });

  test('twoEmptyNumbers', () => {
    expect(twoEmptyNumbers([])).toEqual([0, 0]);
  });

  test('two props with null check', () => {
    expect(R.props(['width', 'height'])({ width: 20, height: 10 })).toEqual([20, 10]);
    expect(R.props(['width', 'height'])({ width: 20 })).toEqual([20, undefined]);
    expect(R.pipe(R.props(['width', 'height']), R.map(R.defaultTo(0)))({ width: 20 })).toEqual([
      20,
      0,
    ]);
  });

  describe('getWidthAndHeightFrom', () => {
    test('from [10, 20]', () => {
      expect(getWidthAndHeightFrom([10, 20])).toEqual([10, 20]);
    });

    test('from { width: 10, height: 20 }', () => {
      expect(getWidthAndHeightFrom({ width: 10, height: 20 })).toEqual([10, 20]);
    });

    test('from { width: 10 } defaults height to 0', () => {
      expect(getWidthAndHeightFrom({ width: 10 })).toEqual([10, 0]);
    });

    test('from { x: 10, y: 20 }', () => {
      expect(getWidthAndHeightFrom({ x: 10, y: 20 })).toEqual([10, 20]);
    });

    test('from { x: 10 } defaults y to 0', () => {
      expect(getWidthAndHeightFrom({ x: 10 })).toEqual([10, 0]);
    });

    test('from empty', () => {
      expect(getWidthAndHeightFrom(null)).toEqual([0, 0]);
    });
  });

  describe('getWidthAndHeightFromArguments', () => {
    test('from 10, 20', () => {
      expect(testSizeWith(10, 20)).toEqual([10, 20]);
    });

    test('from [10, 20]', () => {
      expect(testSizeWith([10, 20])).toEqual([10, 20]);
    });

    test('from { width: 10, height: 20 }', () => {
      expect(testSizeWith({ width: 10, height: 20 })).toEqual([10, 20]);
    });

    test('from { width: 10 } defaults height to 0', () => {
      expect(testSizeWith({ width: 10 })).toEqual([10, 0]);
    });

    test('from { x: 10, y: 20 }', () => {
      expect(testSizeWith({ x: 10, y: 20 })).toEqual([10, 20]);
    });

    test('from { x: 10 } defaults y to 0', () => {
      expect(testSizeWith({ x: 10 })).toEqual([10, 0]);
    });

    test('from empty', () => {
      expect(testSizeWith()).toEqual([0, 0]);
    });
  });

  describe('getXAndYFromArguments', () => {
    test('from 10, 20', () => {
      expect(testPointWith(10, 20)).toEqual([10, 20]);
    });

    test('from [10, 20]', () => {
      expect(testPointWith([10, 20])).toEqual([10, 20]);
    });

    test('from { x: 10, y: 20 }', () => {
      expect(testPointWith({ x: 10, y: 20 })).toEqual([10, 20]);
    });

    test('from { angle: 90, length: 1 }', () => {
      expect(testPointWith({ angle: 90, length: 1 })).toEqual([1, 90, true]);
    });

    test('from empty', () => {
      expect(testPointWith()).toEqual([0, 0]);
    });
  });

  describe('isZeroFromArguments', () => {
    const fn = n => n === 0;

    test('from 0', () => {
      expect(testZeroWith(fn, 0)).toBeTruthy();
      expect(testZeroWith(fn, 1)).toBeFalsy();
    });

    test('from [0, 0]', () => {
      expect(testZeroWith(fn, [0, 0])).toBeTruthy();
      expect(testZeroWith(fn, [0, 1])).toBeFalsy();
    });

    test('from { x: 0, y: 0 }', () => {
      expect(testZeroWith(fn, { x: 0, y: 0 })).toBeTruthy();
      expect(testZeroWith(fn, { x: 10, y: 0 })).toBeFalsy();
      expect(testZeroWith(fn, { x: 0, y: 10 })).toBeFalsy();
      expect(testZeroWith(fn, { x: 10, y: 10 })).toBeFalsy();
    });

    test('from { width: 0, height: 0 }', () => {
      expect(testZeroWith(fn, { width: 0, height: 0 })).toBeTruthy();
      expect(testZeroWith(fn, { width: 10, height: 0 })).toBeTruthy();
      expect(testZeroWith(fn, { width: 0, height: 10 })).toBeTruthy();
      expect(testZeroWith(fn, { width: 10, height: 10 })).toBeFalsy();
    });
  });
});
