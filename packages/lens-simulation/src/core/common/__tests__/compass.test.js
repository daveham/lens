import Compass from '../compass';
import { ImageCompassMode } from '../imageCompass';

describe('compass', () => {
  test('first', () => {
    const mockImageCompass = {
      lapped: false,
      grainX: 8,
      grainY: 8,
      width: 64,
      height: 80,
    };

    const compass = Compass.CompassFor(mockImageCompass, ImageCompassMode.normal);

    expect(compass.slicesWide).toBe(8);
    expect(compass.slicesHigh).toBe(10);
  });
});
