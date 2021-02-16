import DefinitionFactory from '../../factories/definitionFactory';
import DicePlan from '../../common/dicePlan';
import SimulationFactory from '../../factories/simulationFactory';
import Size from '../../../basic/size';
import { HikerExitReason } from '../../constants';

// import getDebugLog from '../debugLog';
// const debug = getDebugLog('trailTests');

class MockBuildContext {
  idCounter = 0;

  getNextId() {
    this.idCounter += 1;
    return this.idCounter;
  }

  resolveIdAndName(label, id, name) {
    const resolvedId = id || this.getNextId();
    const resolvedName = name || `${label}-${resolvedId}`;
    return [resolvedId, resolvedName];
  }
}

function createTestObjects(trailOptions, { movementOptions, ...options }) {
  const model = { size: [200, 100] };
  const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);

  const simulationFactory = new SimulationFactory(new MockBuildContext());
  simulationFactory.initialize(plan, model, {});
  const df = new DefinitionFactory(simulationFactory);

  const hike = df.createHike({ id: 100, name: 'testHike' });

  const trail = df.createTrail(hike, { id: 101, name: 'lineTrail', ...trailOptions });

  const hiker = df.createHiker(trail, {
    id: 102,
    name: 'testHiker',
    type: 'Trail',
    options,
    movementBehavior: {
      type: 'Trail',
      options: movementOptions,
    },
  });

  return [hike, trail, hiker];
}

function runHike(hike) {
  const TEST_LIMIT = 1000;
  let stepLimitCounter = 0;
  while (hike.isActive() && stepLimitCounter < TEST_LIMIT) {
    hike.run(stepLimitCounter);
    stepLimitCounter += 1;
  }
}

describe('trail', () => {
  describe('line trail', () => {
    test('take one step', () => {
      const hikerOptions = {
        movementOptions: { fixedDisplacement: [1, 2], stepLimit: 1, initialLocation: [0, 50] },
      };
      const trailOptions = {
        type: 'Line',
        modifiers: [{ type: 'Line' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailOptions, hikerOptions);

      hike.open();
      trail.open();
      hiker.step();

      expect(trail.isOpen).toBeTruthy();
      expect(hiker.started).toBeTruthy();
      const { movementBehavior } = hiker;
      expect(movementBehavior.started).toBeTruthy();
      expect(movementBehavior.steps).toEqual(1);
      expect(hiker.trailState.location.x).toEqual(1);
      expect(hiker.trailState.location.y).toEqual(52);
    });

    test('run to step limit', () => {
      const hikerOptions = {
        movementOptions: { fixedDisplacement: [1, 2], stepLimit: 5, initialLocation: [0, 50] },
      };
      const trailOptions = {
        type: 'Line',
        modifiers: [{ type: 'Line' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailOptions, hikerOptions);

      runHike(hike);

      expect(trail.isOpen).toBeFalsy();
      expect(hiker.started).toBeTruthy();
      expect(hiker.exitReason).toEqual(HikerExitReason.reachedStepLimit);
      const { movementBehavior } = hiker;
      expect(movementBehavior.started).toBeTruthy();
      expect(movementBehavior.steps).toEqual(5);
      expect(hiker.trailState.location.x).toEqual(5);
      expect(hiker.trailState.location.y).toEqual(60);
    });

    test('run to bounds limit', () => {
      const hikerOptions = {
        movementOptions: { fixedDisplacement: [1, 7], stepLimit: 100, initialLocation: [0, 50] },
      };
      const trailOptions = {
        type: 'Line',
        modifiers: [{ type: 'Line' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailOptions, hikerOptions);

      runHike(hike);

      expect(trail.isOpen).toBeFalsy();
      expect(hiker.started).toBeTruthy();
      expect(hiker.exitReason).toEqual(HikerExitReason.exceededImageBounds);
      const { movementBehavior } = hiker;
      expect(movementBehavior.started).toBeTruthy();
      expect(movementBehavior.steps).toEqual(8); // 50/7 + 1
      expect(hiker.trailState.location.x).toEqual(8);
      expect(hiker.trailState.location.y).toBeGreaterThan(100);
    });
  });

  describe('cover trail by rows', () => {
    test('take one step', () => {
      const hikerOptions = {
        movementOptions: { fixedDisplacement: [10, 20], stepLimit: 1 },
      };
      const trailOptions = {
        type: 'Cover',
        modifiers: [{ type: 'RowsFirst' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailOptions, hikerOptions);

      hike.open();
      trail.open();
      hiker.step();

      expect(trail.isOpen).toBeTruthy();
      expect(hiker.started).toBeTruthy();
      const { movementBehavior } = hiker;
      expect(movementBehavior.started).toBeTruthy();
      expect(movementBehavior.steps).toEqual(1);
      expect(hiker.trailState.location.x).toEqual(10);
      expect(hiker.trailState.location.y).toEqual(0);
    });

    test('run to step limit', () => {
      const hikerOptions = {
        movementOptions: { fixedDisplacement: [10, 20], stepLimit: 25 },
      };
      const trailOptions = {
        type: 'Cover',
        modifiers: [{ type: 'RowsFirst' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailOptions, hikerOptions);

      runHike(hike);

      expect(trail.isOpen).toBeFalsy();
      expect(hiker.started).toBeTruthy();
      expect(hiker.exitReason).toEqual(HikerExitReason.reachedStepLimit);
      const { movementBehavior } = hiker;
      expect(movementBehavior.started).toBeTruthy();
      expect(movementBehavior.steps).toEqual(25);
      expect(hiker.trailState.location.x).toEqual(50);
      expect(hiker.trailState.location.y).toEqual(20);
    });

    test('run to bounds limit', () => {
      const hikerOptions = {
        movementOptions: { fixedDisplacement: [40, 20], stepLimit: 30 },
      };
      const trailOptions = {
        type: 'Cover',
        modifiers: [{ type: 'RowsFirst' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailOptions, hikerOptions);

      runHike(hike);

      expect(trail.isOpen).toBeFalsy();
      expect(hiker.started).toBeTruthy();
      expect(hiker.exitReason).toEqual(HikerExitReason.exceededImageBounds);
      const { movementBehavior } = hiker;
      expect(movementBehavior.started).toBeTruthy();
      expect(movementBehavior.steps).toEqual(25); // 200/40 * 100/20
      expect(hiker.trailState.location.x).toEqual(0);
      expect(hiker.trailState.location.y).toBeGreaterThanOrEqual(100);
    });
  });

  describe('cover trail by columns', () => {
    test('take one step', () => {
      const hikerOptions = {
        movementOptions: { fixedDisplacement: [10, 20], stepLimit: 1 },
      };
      const trailOptions = {
        type: 'Cover',
        modifiers: [{ type: 'ColumnsFirst' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailOptions, hikerOptions);

      hike.open();
      trail.open();
      hiker.step();

      expect(trail.isOpen).toBeTruthy();
      expect(hiker.started).toBeTruthy();
      const { movementBehavior } = hiker;
      expect(movementBehavior.started).toBeTruthy();
      expect(movementBehavior.steps).toEqual(1);
      expect(hiker.trailState.location.x).toEqual(0);
      expect(hiker.trailState.location.y).toEqual(20);
    });

    test('run to step limit', () => {
      const hikerOptions = {
        movementOptions: { fixedDisplacement: [10, 20], stepLimit: 21 },
      };
      const trailOptions = {
        type: 'Cover',
        modifiers: [{ type: 'ColumnsFirst' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailOptions, hikerOptions);

      runHike(hike);

      expect(trail.isOpen).toBeFalsy();
      expect(hiker.started).toBeTruthy();
      expect(hiker.exitReason).toEqual(HikerExitReason.reachedStepLimit);
      const { movementBehavior } = hiker;
      expect(movementBehavior.started).toBeTruthy();
      expect(movementBehavior.steps).toEqual(21);
      expect(hiker.trailState.location.x).toEqual(40);
      expect(hiker.trailState.location.y).toEqual(20);
    });

    test('run to bounds limit', () => {
      const hikerOptions = {
        movementOptions: { fixedDisplacement: [40, 20], stepLimit: 30 },
      };
      const trailOptions = {
        type: 'Cover',
        modifiers: [{ type: 'ColumnsFirst' }],
      };
      const [hike, trail, hiker] = createTestObjects(trailOptions, hikerOptions);

      runHike(hike);

      expect(trail.isOpen).toBeFalsy();
      expect(hiker.started).toBeTruthy();
      expect(hiker.exitReason).toEqual(HikerExitReason.exceededImageBounds);
      const { movementBehavior } = hiker;
      expect(movementBehavior.started).toBeTruthy();
      expect(movementBehavior.steps).toEqual(25); // 200/40 * 100/20
      expect(hiker.trailState.location.x).toBeGreaterThanOrEqual(200);
      expect(hiker.trailState.location.y).toEqual(0);
    });
  });
});
