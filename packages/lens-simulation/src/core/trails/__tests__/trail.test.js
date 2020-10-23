import Size from '../../../basic/size';
import DicePlan from '../../common/dicePlan';
import { HikerExitReason } from '../../constants';
import SimulationFactory from '../../simulationFactory';

// import getDebugLog from '../debugLog';
// const debug = getDebugLog('trailTests');

function createTestObjects(trailStrategyOptions, { movementOptions, ...options }) {
  const factory = new SimulationFactory();
  const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);
  factory.initialize(plan, { size: new Size(200, 100) });

  const hike = factory.createHike({ id: 100, name: 'testHike' });

  const trail = factory.createTrail({ id: 101, name: 'lineTrail', ...trailStrategyOptions });
  trail.initialize(plan, hike);
  hike.addTrail(trail);

  const hiker = factory.createHiker({
    id: 102,
    name: 'testHiker',
    type: 'Trail',
    options,
    movementBehavior: {
      type: 'Trail',
      options: movementOptions,
    },
  });
  hiker.trail = trail;
  trail.addHiker(hiker);

  return [hike, trail, hiker];
}

describe('trail', () => {
  describe('line trail', () => {
    test('take one step', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [1, 2], stepLimit: 1, initialLocation: [0, 50] },
      };
      const trailStrategyOptions = {
        type: 'Line',
        modifiers: [{ type: 'Line' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailStrategyOptions, hikerStrategyOptions);

      hike.open();
      trail.open();
      return hiker.step().then(() => {
        expect(trail.isOpen).toBeTruthy();
        expect(hiker.started).toBeTruthy();
        const { movementBehavior } = hiker.strategy;
        expect(movementBehavior.started).toBeTruthy();
        expect(movementBehavior.strategy.steps).toBe(1);
        expect(movementBehavior.strategy.trailState.location.x).toBe(1);
        expect(movementBehavior.strategy.trailState.location.y).toBe(52);
      });
    });

    test('run to step limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [1, 2], stepLimit: 5, initialLocation: [0, 50] },
      };
      const trailStrategyOptions = {
        type: 'Line',
        modifiers: [{ type: 'Line' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailStrategyOptions, hikerStrategyOptions);

      return hike.run().then(() => {
        expect(trail.isOpen).toBeFalsy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.exitReason).toBe(HikerExitReason.reachedStepLimit);
        const { movementBehavior } = hiker.strategy;
        expect(movementBehavior.started).toBeTruthy();
        expect(movementBehavior.strategy.steps).toBe(5);
        expect(movementBehavior.strategy.trailState.location.x).toBe(5);
        expect(movementBehavior.strategy.trailState.location.y).toBe(60);
      });
    });

    test('run to bounds limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [1, 7], stepLimit: 100, initialLocation: [0, 50] },
      };
      const trailStrategyOptions = {
        type: 'Line',
        modifiers: [{ type: 'Line' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailStrategyOptions, hikerStrategyOptions);

      return hike.run().then(() => {
        expect(trail.isOpen).toBeFalsy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);
        const { movementBehavior } = hiker.strategy;
        expect(movementBehavior.started).toBeTruthy();
        expect(movementBehavior.strategy.steps).toBe(8); // 50/7 + 1
        expect(movementBehavior.strategy.trailState.location.x).toBe(8);
        expect(movementBehavior.strategy.trailState.location.y).toBeGreaterThan(100);
      });
    });
  });

  describe('cover trail by rows', () => {
    test('take one step', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [10, 20], stepLimit: 1 },
      };
      const trailStrategyOptions = {
        type: 'Cover',
        modifiers: [{ type: 'RowsFirst' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailStrategyOptions, hikerStrategyOptions);

      hike.open();
      trail.open();
      return hiker.step().then(() => {
        expect(trail.isOpen).toBeTruthy();
        expect(hiker.started).toBeTruthy();
        const { movementBehavior } = hiker.strategy;
        expect(movementBehavior.started).toBeTruthy();
        expect(movementBehavior.strategy.steps).toBe(1);
        expect(movementBehavior.strategy.trailState.location.x).toBe(10);
        expect(movementBehavior.strategy.trailState.location.y).toBe(0);
      });
    });

    test('run to step limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [10, 20], stepLimit: 25 },
      };
      const trailStrategyOptions = {
        type: 'Cover',
        modifiers: [{ type: 'RowsFirst' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailStrategyOptions, hikerStrategyOptions);

      return hike.run().then(() => {
        expect(trail.isOpen).toBeFalsy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.exitReason).toBe(HikerExitReason.reachedStepLimit);
        const { movementBehavior } = hiker.strategy;
        expect(movementBehavior.started).toBeTruthy();
        expect(movementBehavior.strategy.steps).toBe(25);
        expect(movementBehavior.strategy.trailState.location.x).toBe(50);
        expect(movementBehavior.strategy.trailState.location.y).toBe(20);
      });
    });

    test('run to bounds limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [40, 20], stepLimit: 30 },
      };
      const trailStrategyOptions = {
        type: 'Cover',
        modifiers: [{ type: 'RowsFirst' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailStrategyOptions, hikerStrategyOptions);

      return hike.run().then(() => {
        expect(trail.isOpen).toBeFalsy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);
        const { movementBehavior } = hiker.strategy;
        expect(movementBehavior.started).toBeTruthy();
        expect(movementBehavior.strategy.steps).toBe(25); // 200/40 * 100/20
        expect(movementBehavior.strategy.trailState.location.x).toBe(0);
        expect(movementBehavior.strategy.trailState.location.y).toBeGreaterThanOrEqual(100);
      });
    });
  });

  describe('cover trail by columns', () => {
    test('take one step', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [10, 20], stepLimit: 1 },
      };
      const trailStrategyOptions = {
        type: 'Cover',
        modifiers: [{ type: 'ColumnsFirst' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailStrategyOptions, hikerStrategyOptions);

      hike.open();
      trail.open();
      return hiker.step().then(() => {
        expect(trail.isOpen).toBeTruthy();
        expect(hiker.started).toBeTruthy();
        const { movementBehavior } = hiker.strategy;
        expect(movementBehavior.started).toBeTruthy();
        expect(movementBehavior.strategy.steps).toBe(1);
        expect(movementBehavior.strategy.trailState.location.x).toBe(0);
        expect(movementBehavior.strategy.trailState.location.y).toBe(20);
      });
    });

    test('run to step limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [10, 20], stepLimit: 21 },
      };
      const trailStrategyOptions = {
        type: 'Cover',
        modifiers: [{ type: 'ColumnsFirst' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailStrategyOptions, hikerStrategyOptions);

      return hike.run().then(() => {
        expect(trail.isOpen).toBeFalsy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.exitReason).toBe(HikerExitReason.reachedStepLimit);
        const { movementBehavior } = hiker.strategy;
        expect(movementBehavior.started).toBeTruthy();
        expect(movementBehavior.strategy.steps).toBe(21);
        expect(movementBehavior.strategy.trailState.location.x).toBe(40);
        expect(movementBehavior.strategy.trailState.location.y).toBe(20);
      });
    });

    test('run to bounds limit', () => {
      const hikerStrategyOptions = {
        movementOptions: { fixedDisplacement: [40, 20], stepLimit: 30 },
      };
      const trailStrategyOptions = {
        type: 'Cover',
        modifiers: [{ type: 'ColumnsFirst' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailStrategyOptions, hikerStrategyOptions);

      return hike.run().then(() => {
        expect(trail.isOpen).toBeFalsy();
        expect(hiker.started).toBeTruthy();
        expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);
        const { movementBehavior } = hiker.strategy;
        expect(movementBehavior.started).toBeTruthy();
        expect(movementBehavior.strategy.steps).toBe(25); // 200/40 * 100/20
        expect(movementBehavior.strategy.trailState.location.x).toBeGreaterThanOrEqual(200);
        expect(movementBehavior.strategy.trailState.location.y).toBe(0);
      });
    });
  });
});
