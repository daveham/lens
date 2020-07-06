import Size from '../../../basic/size';
import DicePlan from '../../common/dicePlan';
import { HikerExitReason } from '../../constants';
import Hiker, { mixHikerStrategy } from '../../hikers/hiker';
import TrailHikerStrategyMixin from '../../hikers/trailHikerStrategy';
import Hike from '../../hikes/hike';
import LineTrailStrategyMixin from '../lineTrailStrategy';
import Trail, { mixTrailStrategy } from '../trail';

describe('trail', () => {
  describe('line trail', () => {
    let hike;
    let trail;
    beforeEach(() => {
      hike = new Hike(100, 'testHike', new Size(200, 100));
      const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);

      const LineTrailStrategy = mixTrailStrategy(LineTrailStrategyMixin);
      trail = new Trail(101, 'lineTrail', hike, plan, new LineTrailStrategy());
      hike.addTrail(trail);
    });

    test('take one step', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [1, 2], stepLimit: 1, initialLocation: [0, 50] },
        actionOptions: {},
      };
      const TrailHikerStrategy = mixHikerStrategy(TrailHikerStrategyMixin);
      const hiker = new Hiker(
        102,
        'testHiker',
        trail,
        new TrailHikerStrategy(hikerStrategyOptions),
      );
      trail.addHiker(hiker);

      hike.open();
      trail.open();
      hiker.step();

      expect(trail.isOpen).toBeTruthy();
      expect(hiker.started).toBeTruthy();
      expect(hiker.movementBehavior.started).toBeTruthy();
      expect(hiker.movementBehavior.strategy.steps).toBe(1);
      expect(hiker.movementBehavior.strategy.trailState.location.x).toBe(1);
      expect(hiker.movementBehavior.strategy.trailState.location.y).toBe(52);
    });

    test('run to step limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [1, 2], stepLimit: 5, initialLocation: [0, 50] },
        actionOptions: {},
      };
      const TrailHikerStrategy = mixHikerStrategy(TrailHikerStrategyMixin);
      const hiker = new Hiker(
        102,
        'testHiker',
        trail,
        new TrailHikerStrategy(hikerStrategyOptions),
      );
      trail.addHiker(hiker);

      hike.run();

      expect(trail.isOpen).toBeFalsy();
      expect(hiker.started).toBeTruthy();
      expect(hiker.movementBehavior.started).toBeTruthy();
      expect(hiker.movementBehavior.strategy.steps).toBe(5);
      expect(hiker.exitReason).toBe(HikerExitReason.reachedStepLimit);
      expect(hiker.movementBehavior.strategy.trailState.location.x).toBe(5);
      expect(hiker.movementBehavior.strategy.trailState.location.y).toBe(60);
    });

    test('run to bounds limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [1, 7], stepLimit: 100, initialLocation: [0, 50] },
        actionOptions: {},
      };
      const TrailHikerStrategy = mixHikerStrategy(TrailHikerStrategyMixin);
      const hiker = new Hiker(
        102,
        'testHiker',
        trail,
        new TrailHikerStrategy(hikerStrategyOptions),
      );
      trail.addHiker(hiker);

      hike.run();

      expect(trail.isOpen).toBeFalsy();
      expect(hiker.started).toBeTruthy();
      expect(hiker.movementBehavior.started).toBeTruthy();
      expect(hiker.movementBehavior.strategy.steps).toBe(8); // 50/7 + 1
      expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);
      expect(hiker.movementBehavior.strategy.trailState.location.x).toBe(8);
      expect(hiker.movementBehavior.strategy.trailState.location.y).toBeGreaterThan(100);
    });
  });
});
