import DefinitionFactory from '../definitionFactory';
import DicePlan from '../../common/dicePlan';
import RestoreFactory from '../restoreFactory';
import SimulationFactory from '../simulationFactory';
import Size from '../../../basic/size';
import SuspendFactory from '../suspendFactory';
import { parse } from '../../simulationBuilder';

import getDebugLog from '../debugLog';

const debug = getDebugLog('simulationFactoryTests');

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

describe('SimulationFactory', () => {
  const model = { size: [100, 200] };
  const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);

  let df, sf, of;

  beforeEach(() => {
    const simulationFactory = new SimulationFactory(new MockBuildContext());
    simulationFactory.initialize(plan, model, {});
    df = new DefinitionFactory(simulationFactory);
    sf = new SuspendFactory();
    of = new RestoreFactory();
  });

  describe('hike', () => {
    const document = `
---
type: Trail
options:
  marker: testHike
  `;

    test('create hike', () => {
      const definition = parse(document);
      const hike = df.createHike(definition);

      expect(hike).toBeTruthy();
      expect(hike.strategy.options.marker).toEqual('testHike');
    });

    test('suspend hike', () => {
      const definition = parse(document);
      const hike = df.createHike(definition);
      hike.suspend(sf);
      const state = sf.stateMap.get(hike.id);

      expect(state).toBeDefined();
      expect(state.id).toEqual(hike.id);
      expect(state.name).toEqual(`hike-${hike.id}`);
    });

    test('restore hike', () => {
      const suspendedId = 101;
      const suspendedName = 'restoredHike';
      const stateMap = new Map();
      stateMap.set(suspendedId, { type: 'Hike', id: suspendedId, name: suspendedName });
      const hike = of.restoreHike({}, suspendedId, stateMap);

      expect(hike.id).toEqual(suspendedId);
      expect(hike.name).toEqual(suspendedName);
    });
  });

  describe('trail', () => {
    const document = `
---
type: Cover
options:
  moveOrder: rowsFirst
  marker: testTrail
modifiers:
  - type: Line
    `;

    test('create trail', () => {
      const definition = parse(document);
      const hike = { addTrail: jest.fn(), size: model.size };
      const trail = df.createTrail(hike, definition);

      expect(trail).toBeTruthy();
      expect(trail.strategy.options.marker).toEqual('testTrail');
    });

    test('suspend trail', () => {
      const definition = parse(document);
      const hike = { addTrail: jest.fn(), size: model.size };
      const trail = df.createTrail(hike, definition);
      trail.suspend(sf);
      const state = sf.stateMap.get(trail.id);

      expect(state.id).toEqual(trail.id);
      expect(state.name).toEqual(`trail-${trail.id}`);
    });

    test('restore trail', () => {
      const suspendedId = 101;
      const suspendedName = 'restoredTrail';
      const stateMap = new Map();
      stateMap.set(suspendedId, {
        type: 'Trail',
        id: suspendedId,
        name: suspendedName,
        modifiers: [],
      });
      const trail = of.restoreTrail({}, suspendedId, stateMap);

      expect(trail.id).toEqual(suspendedId);
      expect(trail.name).toEqual(suspendedName);
    });
  });

  describe('hiker', () => {
    const document = `
---
type: Trail
options:
  marker: testHiker
movementBehavior:
  type: Trail
  options:
    marker: testMovementBehavior
    displacementScheme: fixed
    fixedDisplacement: [10, 20]
    stepLimit: 45
    initialLocation: [0, 10]
    `;

    test('create hiker', () => {
      const definition = parse(document);
      const trail = { addHiker: jest.fn() };
      const hiker = df.createHiker(trail, definition);

      expect(hiker).toBeTruthy();
      const { strategy: hikerStrategy } = hiker;
      expect(hikerStrategy).toBeTruthy();
      expect(hikerStrategy.options.marker).toEqual('testHiker');
      const { movementBehavior } = hikerStrategy;
      expect(movementBehavior).toBeTruthy();
      debug('movementBehavior', movementBehavior);
      expect(movementBehavior.strategy.options.marker).toEqual('testMovementBehavior');
    });

    test('suspend hiker', () => {
      const definition = parse(document);
      const trail = { addHiker: jest.fn() };
      const hiker = df.createHiker(trail, definition);
      hiker.suspend(sf);
      const state = sf.stateMap.get(hiker.id);

      expect(state.id).toEqual(hiker.id);
      expect(state.name).toEqual(`hiker-${hiker.id}`);
    });

    test('restore hiker', () => {
      const suspendedId = 101;
      const suspendedName = 'restoredHiker';
      const stateMap = new Map();
      stateMap.set(suspendedId, { type: 'Hiker', id: suspendedId, name: suspendedName });
      const hiker = of.restoreHiker({}, suspendedId, stateMap);

      expect(hiker.id).toEqual(suspendedId);
      expect(hiker.name).toEqual(suspendedName);
    });
  });
});
