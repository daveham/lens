import Size from '../../../basic/size';
import DicePlan from '../../common/dicePlan';
import Hike from '../hike';
import Trail from '../../trails/trail';
import Hiker from '../../hikers/hiker';

describe('hike', () => {
  test('runs active hikers', () => {
    const testPlan = new DicePlan(new Size(8, 8), new Size(2, 2));
    const testHike = new Hike(1, 'mock-hike', new Size(200, 100));
    const testTrail = new Trail(2, 'mock-trail', testHike, testPlan);
    testHike.addTrail(testTrail);
    const testHiker = new Hiker(3, 'mock-hiker', testTrail);
    testTrail.addHiker(testHiker);

    testHike.run();

    expect(testHike.stepCount).toEqual(1);
  });
});
