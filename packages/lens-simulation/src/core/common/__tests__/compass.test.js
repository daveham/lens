import Size from '../../../basic/size';
import Point from '../../../basic/point';
import Rectangle from '../../../basic/rectangle';

import Compass from '../compass';
import { ImageCompassMode } from '../imageCompass';

/*
  DicePlan.creatCompass(), .createCompassAtDepth() - return ImageCompass
  ImageCompass knows about dicing parameters, creates and contains a Compass
  Compass has static factory method to create specialized compass
 */

describe('compass', () => {
  const onGrainBounds = new Rectangle(0, 0, 128, 64);
  const offGrainBounds = new Rectangle(0, 0, 129, 65);
  const grain = new Size(8, 8);
  const mockImageCompass = {
    bounds: onGrainBounds,
    grain,
    lapped: false,
  };
  const makeCompass = (mode, bounds = onGrainBounds) =>
    Compass.CompassFor({ ...mockImageCompass, bounds }, mode);

  describe('normal', () => {
    // derive slices from bounds and grain, round up on partial slices
    // limit based on number of (possibly rounded up) slices

    describe('on-grain', () => {
      const compass = makeCompass(ImageCompassMode.normal);

      test('correct slice size', () => {
        expect(compass.slicesSize).toEqual(new Size(16, 8));
      });

      test('gets bounds around center', () => {
        const loc = onGrainBounds.center;
        expect(loc).toEqual(new Point(64, 32));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(64);
        expect(compass.boundsFromLocation(loc).top).toBe(32);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(56);

        loc2 = loc.add([8, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(72);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(24);

        loc2 = loc.add([0, 8]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(40);
      });

      test('gets bounds around top left', () => {
        const loc = onGrainBounds.topLeft;
        expect(loc).toEqual(new Point(0, 0));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(0);
        expect(compass.boundsFromLocation(loc).top).toBe(0);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([8, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(8);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([0, 8]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(8);
      });

      test('gets bounds around bottom right', () => {
        const loc = onGrainBounds.bottomRight;
        expect(loc).toEqual(new Point(128, 64));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(128);
        expect(compass.boundsFromLocation(loc).top).toBe(64);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(120);

        loc2 = loc.add([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(56);

        loc2 = loc.add([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();
      });

      test('generates all slices', () => {
        let inCounter = 0;
        let outCounter = 0;
        for (const slice of compass.slices()) {
          expect(slice.width).toBe(grain.width);
          expect(slice.height).toBe(grain.height);
          if (onGrainBounds.contains(slice)) {
            inCounter++;
          } else {
            outCounter++;
          }
        }
        // Given an image with a size that is a multiple of the grain size, any
        // compass for that image will produce slices that always fit within
        // the compass' limits.
        const { slicesSize } = compass;
        const sliceCount = slicesSize.width * slicesSize.height;
        expect(inCounter).toBe(sliceCount);
        expect(outCounter).toBe(0);
      });
    });

    describe('off-grain', () => {
      const compass = makeCompass(ImageCompassMode.normal, offGrainBounds);

      test('correct slice size', () => {
        // "normal" mode treats partial as a full slice for bounds
        // and allows operations into the "extra" space
        expect(compass.slicesSize.toString()).toEqual('{ width: 17, height: 9 }');
      });

      test('gets bounds around center', () => {
        const loc = offGrainBounds.center;
        expect(loc).toEqual(new Point(64.5, 32.5));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(64);
        expect(compass.boundsFromLocation(loc).top).toBe(32);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(56);

        loc2 = loc.add([8, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(72);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(24);

        loc2 = loc.add([0, 8]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(40);
      });

      test('gets bounds around top left', () => {
        const loc = offGrainBounds.topLeft;
        expect(loc).toEqual(new Point(0, 0));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(0);
        expect(compass.boundsFromLocation(loc).top).toBe(0);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([8, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(8);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([0, 8]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(8);
      });

      test('gets bounds around bottom right', () => {
        const loc = offGrainBounds.bottomRight;
        expect(loc).toEqual(new Point(129, 65));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(128);
        expect(compass.boundsFromLocation(loc).top).toBe(64);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(128);

        loc2 = loc.add([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(128);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(64);

        loc2 = loc.add([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(64);
      });

      test('generates all slices', () => {
        let inCounter = 0;
        let outCounter = 0;
        for (const slice of compass.slices()) {
          expect(slice.width).toBe(grain.width);
          expect(slice.height).toBe(grain.height);
          if (offGrainBounds.contains(slice)) {
            inCounter++;
          } else {
            outCounter++;
          }
        }
        // Given an image with a size that is not a multiple of the grain size,
        // the normal compass will produce slices based on a size that is rounded
        // up to a multiple of the grain. The slices that cover the "rounded up"
        // area will not be within the bounds of the compass' limit.
        const { slicesSize } = compass;
        const flooredSize = slicesSize
          .divide(grain)
          .floor()
          .multiply(grain);
        const sliceCount = flooredSize.width * flooredSize.height;
        expect(inCounter).toBe(sliceCount);
        expect(outCounter).toBe(slicesSize.width * slicesSize.height - sliceCount);
        expect(outCounter).toBe(slicesSize.width + slicesSize.height - 1);
      });
    });
  });

  describe('constrained', () => {
    // derive slices from bounds and grain, floor any partial slices
    // limit based on number of (possibly floored) slices

    describe('on-grain', () => {
      const compass = makeCompass(ImageCompassMode.constrain);

      test('correct slice size', () => {
        expect(compass.slicesSize.toString()).toEqual('{ width: 16, height: 8 }');
      });

      test('gets bounds around center', () => {
        const loc = onGrainBounds.center;
        expect(loc).toEqual(new Point(64, 32));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(64);
        expect(compass.boundsFromLocation(loc).top).toBe(32);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(56);

        loc2 = loc.add([8, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(72);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(24);

        loc2 = loc.add([0, 8]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(40);
      });

      test('gets bounds around top left', () => {
        const loc = onGrainBounds.topLeft;
        expect(loc).toEqual(new Point(0, 0));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(0);
        expect(compass.boundsFromLocation(loc).top).toBe(0);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([8, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(8);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([0, 8]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(8);
      });

      test('gets bounds around bottom right', () => {
        const loc = onGrainBounds.bottomRight;
        expect(loc).toEqual(new Point(128, 64));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(128);
        expect(compass.boundsFromLocation(loc).top).toBe(64);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(120);

        loc2 = loc.add([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(56);

        loc2 = loc.add([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();
      });

      test('generates all slices', () => {
        let inCounter = 0;
        let outCounter = 0;
        for (const slice of compass.slices()) {
          expect(slice.width).toBe(grain.width);
          expect(slice.height).toBe(grain.height);
          if (onGrainBounds.contains(slice)) {
            inCounter++;
          } else {
            outCounter++;
          }
        }
        // Given an image with a size that is a multiple of the grain size, any
        // compass for that image will produce slices that always fit within
        // the compass' limits.
        const { slicesSize } = compass;
        const sliceCount = slicesSize.width * slicesSize.height;
        expect(inCounter).toBe(sliceCount);
        expect(outCounter).toBe(0);
      });
    });

    describe('off-grain', () => {
      const compass = makeCompass(ImageCompassMode.constrain, offGrainBounds);

      test('correct slice size', () => {
        // "constrain" mode ...
        expect(compass.slicesSize.toString()).toEqual('{ width: 16, height: 8 }');
      });

      test('gets bounds around center', () => {
        const loc = offGrainBounds.center;
        expect(loc).toEqual(new Point(64.5, 32.5));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(64);
        expect(compass.boundsFromLocation(loc).top).toBe(32);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(56);

        loc2 = loc.add([8, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(72);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(24);

        loc2 = loc.add([0, 8]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(40);
      });

      test('gets bounds around top left', () => {
        const loc = offGrainBounds.topLeft;
        expect(loc).toEqual(new Point(0, 0));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(0);
        expect(compass.boundsFromLocation(loc).top).toBe(0);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([8, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(8);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([0, 8]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(8);
      });

      test('gets bounds around bottom right', () => {
        const loc = offGrainBounds.bottomRight;
        expect(loc).toEqual(new Point(129, 65));
        expect(compass.isOutOfBounds(loc)).toBeTruthy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeTruthy();
        expect(compass.boundsFromLocation(loc).left).toBe(0);
        expect(compass.boundsFromLocation(loc).top).toBe(0);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.subtract([1, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(128);
        expect(compass.boundsFromLocation(loc2).top).toBe(64);

        loc2 = loc.add([1, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();
      });

      test('generates all slices', () => {
        let inCounter = 0;
        let outCounter = 0;
        for (const slice of compass.slices()) {
          expect(slice.width).toBe(grain.width);
          expect(slice.height).toBe(grain.height);
          if (offGrainBounds.contains(slice)) {
            inCounter++;
          } else {
            outCounter++;
          }
        }
        // Given an image with a size that is not a multiple of the grain size,
        // the constrain compass will produce slices based on a size that is floored
        // to a size that is a multiple of the grain. The slices produced by the
        // constrain compass will always fit within the compass' limit.
        const { slicesSize } = compass;
        const sliceCount = slicesSize.width * slicesSize.height;
        expect(inCounter).toBe(sliceCount);
        expect(outCounter).toBe(0);
      });
    });
  });

  describe('clipped', () => {
    // derive slices from bounds and grain, round up on partial slices
    // limit set directly from requested bounds

    describe('on-grain', () => {
      const compass = makeCompass(ImageCompassMode.clip);

      test('correct slice size', () => {
        expect(compass.slicesSize.toString()).toEqual('{ width: 16, height: 8 }');
      });

      test('gets bounds around center', () => {
        const loc = onGrainBounds.center;
        expect(loc).toEqual(new Point(64, 32));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(64);
        expect(compass.boundsFromLocation(loc).top).toBe(32);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(56);

        loc2 = loc.add([8, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(72);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(24);

        loc2 = loc.add([0, 8]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(40);
      });

      test('gets bounds around top left', () => {
        const loc = onGrainBounds.topLeft;
        expect(loc).toEqual(new Point(0, 0));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(0);
        expect(compass.boundsFromLocation(loc).top).toBe(0);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([8, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(8);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([0, 8]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(8);
      });

      test('gets bounds around bottom right', () => {
        const loc = onGrainBounds.bottomRight;
        expect(loc).toEqual(new Point(128, 64));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(128);
        expect(compass.boundsFromLocation(loc).top).toBe(64);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(120);

        loc2 = loc.add([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(56);

        loc2 = loc.add([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();
      });

      test('generates all slices', () => {
        let inCounter = 0;
        let outCounter = 0;
        for (const slice of compass.slices()) {
          expect(slice.width).toBe(grain.width);
          expect(slice.height).toBe(grain.height);
          if (onGrainBounds.contains(slice)) {
            inCounter++;
          } else {
            outCounter++;
          }
        }
        // Given an image with a size that is a multiple of the grain size, any
        // compass for that image will produce slices that always fit within
        // the compass' limits.
        const { slicesSize } = compass;
        const sliceCount = slicesSize.width * slicesSize.height;
        expect(inCounter).toBe(sliceCount);
        expect(outCounter).toBe(0);
      });
    });

    describe('off-grain', () => {
      // "clip" mode throws away partial and only counts full slices
      const compass = makeCompass(ImageCompassMode.clip, offGrainBounds);

      test('correct slice size', () => {
        expect(compass.slicesSize.toString()).toEqual('{ width: 17, height: 9 }');
      });

      test('gets bounds around center', () => {
        const loc = offGrainBounds.center;
        expect(loc).toEqual(new Point(64.5, 32.5));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(64);
        expect(compass.boundsFromLocation(loc).top).toBe(32);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(56);

        loc2 = loc.add([8, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(72);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(24);

        loc2 = loc.add([0, 8]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(40);
      });

      test('gets bounds around top left', () => {
        const loc = offGrainBounds.topLeft;
        expect(loc).toEqual(new Point(0, 0));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(0);
        expect(compass.boundsFromLocation(loc).top).toBe(0);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([8, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(8);

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.add([0, 8]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(8);
      });

      test('gets bounds around bottom right', () => {
        const loc = offGrainBounds.bottomRight;
        expect(loc).toEqual(new Point(129, 65));
        expect(compass.isOutOfBounds(loc)).toBeFalsy();
        expect(compass.boundsFromLocation(loc).isEmpty()).toBeFalsy();
        expect(compass.boundsFromLocation(loc).left).toBe(128);
        expect(compass.boundsFromLocation(loc).top).toBe(64);

        let loc2 = loc.subtract([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).left).toBe(128);

        loc2 = loc.add([1, 0]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();

        loc2 = loc.subtract([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeFalsy();
        expect(compass.boundsFromLocation(loc2).top).toBe(64);

        loc2 = loc.add([0, 1]);
        expect(compass.isOutOfBounds(loc2)).toBeTruthy();
        expect(compass.boundsFromLocation(loc2).isEmpty()).toBeTruthy();
      });

      test('generates all slices', () => {
        let inCounter = 0;
        let outCounter = 0;
        for (const slice of compass.slices()) {
          if (offGrainBounds.contains(slice)) {
            inCounter++;
            expect(slice.width).toBeLessThanOrEqual(grain.width);
            expect(slice.height).toBeLessThanOrEqual(grain.height);
          } else {
            outCounter++;
          }
        }
        // Given an image with a size that is not a multiple of the grain size,
        // the clipped compass will produce slices that fit within the compass'
        // limit by truncating the size of any slices that extend beyond the
        // limit. Therefore, all slices will fit within the compass' limit.
        const { slicesSize } = compass;
        const sliceCount = slicesSize.width * slicesSize.height;
        expect(inCounter).toBe(sliceCount);
        expect(outCounter).toBe(0);
      });
    });
  });
});
