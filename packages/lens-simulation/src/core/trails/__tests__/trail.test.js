import Size from '../../../basic/size';
import DicePlan from '../../common/dicePlan';
import { HikerExitReason } from '../../constants';
import Hiker, { mixHikerStrategy } from '../../hikers/hiker';
import TrailHikerStrategyMixin from '../../hikers/trailHikerStrategy';
import Hike from '../../hikes/hike';
import LineTrailStrategyMixin from '../lineTrailStrategy';
import CoverTrailStrategyMixin, { CoverTrailMoveOrder } from '../coverTrailStrategy';
import Trail, { mixTrailStrategy } from '../trail';

// import getDebugLog from '../debugLog';
// const debug = getDebugLog('trailTests');

function createTestObjects(trailStrategy, hikerOptions) {
  const hike = new Hike(100, 'testHike', new Size(200, 100));
  const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);

  const trail = new Trail(101, 'lineTrail', hike, plan, trailStrategy);
  hike.addTrail(trail);

  const TrailHikerStrategy = mixHikerStrategy(TrailHikerStrategyMixin);

  const hiker = new Hiker(102, 'testHiker', trail, new TrailHikerStrategy(hikerOptions));
  trail.addHiker(hiker);

  return [hike, trail, hiker];
}

describe('trail', () => {
  describe('line trail', () => {
    test('take one step', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [1, 2], stepLimit: 1, initialLocation: [0, 50] },
      };
      const LineTrailStrategy = mixTrailStrategy(LineTrailStrategyMixin);
      const [hike, trail, hiker] = createTestObjects(new LineTrailStrategy(), hikerStrategyOptions);

      hike.open();
      trail.open();
      return hiker.step().then(() => {
        expect(trail.isOpen).toBeTruthy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.movementBehavior.started).toBeTruthy();
        expect(hiker.movementBehavior.strategy.steps).toBe(1);
        expect(hiker.movementBehavior.strategy.trailState.location.x).toBe(1);
        expect(hiker.movementBehavior.strategy.trailState.location.y).toBe(52);
      });
    });

    test('run to step limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [1, 2], stepLimit: 5, initialLocation: [0, 50] },
      };
      const LineTrailStrategy = mixTrailStrategy(LineTrailStrategyMixin);
      const [hike, trail, hiker] = createTestObjects(new LineTrailStrategy(), hikerStrategyOptions);

      return hike.run().then(() => {
        expect(trail.isOpen).toBeFalsy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.movementBehavior.started).toBeTruthy();
        expect(hiker.exitReason).toBe(HikerExitReason.reachedStepLimit);
        expect(hiker.movementBehavior.strategy.steps).toBe(5);
        expect(hiker.movementBehavior.strategy.trailState.location.x).toBe(5);
        expect(hiker.movementBehavior.strategy.trailState.location.y).toBe(60);
      });
    });

    test('run to bounds limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [1, 7], stepLimit: 100, initialLocation: [0, 50] },
      };
      const LineTrailStrategy = mixTrailStrategy(LineTrailStrategyMixin);
      const [hike, trail, hiker] = createTestObjects(new LineTrailStrategy(), hikerStrategyOptions);

      return hike.run().then(() => {
        expect(trail.isOpen).toBeFalsy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.movementBehavior.started).toBeTruthy();
        expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);
        expect(hiker.movementBehavior.strategy.steps).toBe(8); // 50/7 + 1
        expect(hiker.movementBehavior.strategy.trailState.location.x).toBe(8);
        expect(hiker.movementBehavior.strategy.trailState.location.y).toBeGreaterThan(100);
      });
    });
  });

  describe('cover trail by rows', () => {
    test('take one step', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [10, 20], stepLimit: 1 },
      };
      const CoverTrailStrategy = mixTrailStrategy(CoverTrailStrategyMixin);
      const [hike, trail, hiker] = createTestObjects(
        new CoverTrailStrategy({ moveOrder: CoverTrailMoveOrder.rowsFirst }),
        hikerStrategyOptions,
      );

      hike.open();
      trail.open();
      return hiker.step().then(() => {
        expect(trail.isOpen).toBeTruthy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.movementBehavior.started).toBeTruthy();
        expect(hiker.movementBehavior.strategy.steps).toBe(1);
        expect(hiker.movementBehavior.strategy.trailState.location.x).toBe(10);
        expect(hiker.movementBehavior.strategy.trailState.location.y).toBe(0);
      });
    });

    test('run to step limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [10, 20], stepLimit: 25 },
      };
      const CoverTrailStrategy = mixTrailStrategy(CoverTrailStrategyMixin);
      const [hike, trail, hiker] = createTestObjects(
        new CoverTrailStrategy({ moveOrder: CoverTrailMoveOrder.rowsFirst }),
        hikerStrategyOptions,
      );

      return hike.run().then(() => {
        expect(trail.isOpen).toBeFalsy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.movementBehavior.started).toBeTruthy();
        expect(hiker.exitReason).toBe(HikerExitReason.reachedStepLimit);
        expect(hiker.movementBehavior.strategy.steps).toBe(25);
        expect(hiker.movementBehavior.strategy.trailState.location.x).toBe(50);
        expect(hiker.movementBehavior.strategy.trailState.location.y).toBe(20);
      });
    });

    test('run to bounds limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [40, 20], stepLimit: 30 },
      };
      const CoverTrailStrategy = mixTrailStrategy(CoverTrailStrategyMixin);
      const [hike, trail, hiker] = createTestObjects(
        new CoverTrailStrategy({ moveOrder: CoverTrailMoveOrder.rowsFirst }),
        hikerStrategyOptions,
      );

      return hike.run().then(() => {
        expect(trail.isOpen).toBeFalsy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.movementBehavior.started).toBeTruthy();
        expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);
        expect(hiker.movementBehavior.strategy.steps).toBe(25); // 200/40 * 100/20
        expect(hiker.movementBehavior.strategy.trailState.location.x).toBe(0);
        expect(hiker.movementBehavior.strategy.trailState.location.y).toBeGreaterThanOrEqual(100);
      });
    });
  });

  describe('cover trail by columns', () => {
    test('take one step', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [10, 20], stepLimit: 1 },
      };
      const CoverTrailStrategy = mixTrailStrategy(CoverTrailStrategyMixin);
      const [hike, trail, hiker] = createTestObjects(
        new CoverTrailStrategy({ moveOrder: CoverTrailMoveOrder.columnsFirst }),
        hikerStrategyOptions,
      );

      hike.open();
      trail.open();
      return hiker.step().then(() => {
        expect(trail.isOpen).toBeTruthy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.movementBehavior.started).toBeTruthy();
        expect(hiker.movementBehavior.strategy.steps).toBe(1);
        expect(hiker.movementBehavior.strategy.trailState.location.x).toBe(0);
        expect(hiker.movementBehavior.strategy.trailState.location.y).toBe(20);
      });
    });

    test('run to step limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [10, 20], stepLimit: 21 },
      };
      const CoverTrailStrategy = mixTrailStrategy(CoverTrailStrategyMixin);
      const [hike, trail, hiker] = createTestObjects(
        new CoverTrailStrategy({ moveOrder: CoverTrailMoveOrder.columnsFirst }),
        hikerStrategyOptions,
      );

      return hike.run().then(() => {
        expect(trail.isOpen).toBeFalsy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.movementBehavior.started).toBeTruthy();
        expect(hiker.exitReason).toBe(HikerExitReason.reachedStepLimit);
        expect(hiker.movementBehavior.strategy.steps).toBe(21);
        expect(hiker.movementBehavior.strategy.trailState.location.x).toBe(40);
        expect(hiker.movementBehavior.strategy.trailState.location.y).toBe(20);
      });
    });

    test('run to bounds limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [40, 20], stepLimit: 30 },
      };
      const CoverTrailStrategy = mixTrailStrategy(CoverTrailStrategyMixin);
      const [hike, trail, hiker] = createTestObjects(
        new CoverTrailStrategy({ moveOrder: CoverTrailMoveOrder.columnsFirst }),
        hikerStrategyOptions,
      );

      return hike.run().then(() => {
        expect(trail.isOpen).toBeFalsy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.movementBehavior.started).toBeTruthy();
        expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);
        expect(hiker.movementBehavior.strategy.steps).toBe(25); // 200/40 * 100/20
        expect(hiker.movementBehavior.strategy.trailState.location.x).toBeGreaterThanOrEqual(200);
        expect(hiker.movementBehavior.strategy.trailState.location.y).toBe(0);
      });
    });
  });
});
