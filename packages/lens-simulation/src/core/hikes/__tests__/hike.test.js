import Hike from '../hike';
import Trail from '../../trails/trail';
import Hiker from '../../hikers/hiker';

describe('hike', () => {
  class MockHike extends Hike {
    onRun() {
      super.onRun();
    }
  }

  test('constructs over base class', () => {
    const testHike = new MockHike();
    expect(testHike instanceof Hike).toBeTruthy();
  });

  test('runs through base class', () => {
    const testHike = new MockHike();
    testHike.onRun = jest.fn();

    testHike.run();
    expect(testHike.onRun).toHaveBeenCalled();
  });

  test('runs active hikers', () => {
    const testHike = new MockHike();
    const testTrail = new Trail();
    testHike.addTrail(testTrail);
    const testHiker = new Hiker();
    testTrail.addHiker(testHiker);

    testHike.run();

    // expect(testHiker.isActive()).toBeFalsy();
    expect(testHike.stepCount).toEqual(1);
  });
});
