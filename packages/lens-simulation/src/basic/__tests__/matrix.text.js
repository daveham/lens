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

import Matrix from '../matrix';
import Point from '../point';

describe('Matrix', () => {
  test('Decomposition: rotate()', () => {
    function testAngle(a, ea) {
      const m = new Matrix().rotate(a);
      const r = ea || a;
      expect(Math.round(m.getRotation()) === r).toBeTruthy(); // because jest and -0
      expect(m.getScaling()).toEqual(new Point(1, 1));
    }

    testAngle(0);
    testAngle(1);
    testAngle(45);
    testAngle(90);
    testAngle(135);
    testAngle(180);
    testAngle(270, -90);
    testAngle(-1);
    testAngle(-45);
    testAngle(-90);
    testAngle(-135);
    testAngle(-180);
    testAngle(-270, 90);
  });

  test('Decomposition: scale()', () => {
    function testScale(sx, sy, ex, ey, ea) {
      const m = new Matrix().scale({ x: sx, y: sy });
      const r = ea || 0;
      expect(m.getRotation() === r).toBeTruthy(); // because jest and -0
      const esx = ex || sx;
      const esy = ey || sy;
      expect(m.getScaling()).toEqual(new Point(esx, esy));
    }

    testScale(1, 1);
    testScale(1, -1);
    testScale(-1, 1, 1, -1, -180); // Decomposing results in correct flipping
    testScale(-1, -1, 1, 1, -180); // Decomposing results in correct flipping
    testScale(2, 4);
    testScale(2, -4);
    testScale(4, 2);
    testScale(-4, 2, 4, -2, -180); // Decomposing results in correct flipping
    testScale(-4, -4, 4, 4, -180); // Decomposing results in correct flipping
  });

  test('Decomposition: scale() & rotate()', () => {
    function testAngleAndScale(sx, sy, a, ex, ey, ea) {
      const m = new Matrix().rotate(a).scale({ x: sx, y: sy });
      const r = ea || a;
      expect(m.getRotation() === r).toBeTruthy();
      const esx = ex || sx;
      const esy = ey || sy;
      expect(m.getScaling()).toEqual(new Point(esx, esy));
    }

    testAngleAndScale(2, 4, 45);
    testAngleAndScale(2, -4, 45);
    testAngleAndScale(-2, 4, 45, 2, -4, -135);
    testAngleAndScale(-2, -4, 45, 2, 4, -135);
  });
});
