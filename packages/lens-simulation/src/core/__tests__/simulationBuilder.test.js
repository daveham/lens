import DicePlan from '../common/dicePlan';
import Point from '../../basic/point';
import Size from '../../basic/size';
import { build, parse, restore, suspend } from '../simulationBuilder';

import getDebugLog from '../debugLog';

const debug = getDebugLog('simulationBuilderTests');

const document = `
---
# test hike 1
description: >
  This is an example of a trail hike that covers
  the image in row-first order.
hikes:
  - id: 101
    name: Hike1
    type: Trail
    trails:
      - id: 102
        name: Trail1
        type: Line
        modifiers:
          - id: 105
            type: Line
        hikers:
          - id: 103
            name: Hiker1
            type: Trail
            movementBehavior:
              id: 104
              type: Trail
              options:
                displacementScheme: fixed
                fixedDisplacement: [10, 20]
                stepLimit: 45
                initialLocation: [0, 10]
            actionBehavior:
              id: 106
              type: Record
              options:
                trace: true
            dataBehavior:
              id: 107
`;

const model = { size: [100, 200] };
const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);
const testExecutionId = 201;
const testSimulationId = 202;

test('parse', () => {
  const definition = parse(document);
  expect(definition).toBeTruthy();
  expect(definition.hikes).toHaveLength(1);

  const [hike] = definition.hikes;
  expect(hike.type).toEqual('Trail');
  expect(hike.trails).toHaveLength(1);

  const [trail] = hike.trails;
  expect(trail.type).toEqual('Line');
  expect(trail.modifiers).toHaveLength(1);

  const [modifier] = trail.modifiers;
  expect(modifier.type).toEqual('Line');
  expect(trail.hikers).toHaveLength(1);

  const [hiker] = trail.hikers;
  expect(hiker.type).toEqual('Trail');

  const { movementBehavior } = hiker;
  expect(movementBehavior).toBeTruthy();
  expect(movementBehavior.type).toEqual('Trail');

  const { options } = movementBehavior;
  expect(options).toBeTruthy();
  expect(options.displacementScheme).toEqual('fixed');
  expect(options.fixedDisplacement[1]).toEqual(20);
});

describe('build', () => {
  test('single', () => {
    const definition = parse(document);
    const simulation = build(testExecutionId, testSimulationId, definition, {
      plan,
      model,
    });
    expect(simulation).toBeTruthy();

    expect(simulation.hikes).toBeTruthy();
    const [hike] = simulation.hikes;
    expect(hike).toBeTruthy();
    expect(hike.name).toEqual('Hike1');

    expect(hike.trails).toBeTruthy();
    const [trail] = hike.trails;
    expect(trail).toBeTruthy();

    expect(trail.modifiers).toBeTruthy();
    const [modifier] = trail.modifiers;
    expect(modifier).toBeTruthy();

    expect(trail.hikers).toBeTruthy();
    const [hiker] = trail.hikers;
    expect(hiker).toBeTruthy();

    const { movementBehavior } = hiker.strategy;
    expect(movementBehavior).toBeTruthy();
    expect(movementBehavior.strategy.displacementScheme).toEqual('fixed');
  });

  test('with addon', () => {
    const addonDocument = `
---
# second hiker
  id: 105
  name: Hiker2
  type: Trail
  movementBehavior:
    id: 106
    type: Trail
    options:
      displacementScheme: grid
      stepLimit: 45
      initialLocation: [0, 10]
`;

    const definition = parse(document);
    const addonDefinition = parse(addonDocument);

    const [trailDef] = definition.hikes[0].trails;
    trailDef.hikers.push(addonDefinition);

    const simulation = build(testExecutionId, testSimulationId, definition, {
      plan,
      model,
    });
    expect(simulation).toBeTruthy();

    const [trail] = simulation.hikes[0].trails;
    expect(trail.hikers).toHaveLength(2);
    const [, hiker] = trail.hikers;
    expect(hiker).toBeTruthy();
    expect(hiker.id).toEqual(105);

    const { movementBehavior } = hiker.strategy;
    expect(movementBehavior).toBeTruthy();
    expect(movementBehavior.strategy.displacementScheme).toEqual('grid');
  });
});

describe('suspend', () => {
  test('after build', () => {
    const definition = parse(document);
    const simulation = build(testExecutionId, testSimulationId, definition, {
      plan,
      model,
    });

    const state = suspend(simulation);

    expect(state).toBeTruthy();
    debug('suspend', state);

    // simulation
    const objSimulation = state.get(testSimulationId);
    expect(objSimulation.id).toEqual(testSimulationId);
    expect(objSimulation.executionId).toEqual(testExecutionId);

    // hike
    const obj101 = state.get(101);
    expect(obj101).toBeTruthy();
    expect(obj101.type).toEqual('Hike');
    expect(obj101.id).toEqual(101);
    expect(obj101.name).toEqual('Hike1');
    expect(obj101.size).toEqual(new Size(100, 200));
    expect(obj101.bounds.width).toEqual(100);
    expect(obj101.bounds.height).toEqual(200);
    expect(obj101.options).toBeTruthy();

    // trails list
    const list101 = state.get('T.101');
    expect(list101).toBeTruthy();
    expect(Array.isArray(list101)).toBeTruthy();
    expect(list101).toHaveLength(1);
    expect(list101[0]).toEqual(102);

    // trail
    const obj102 = state.get(102);
    expect(obj102).toBeTruthy();
    expect(obj102.type).toEqual('Trail:Line');
    expect(obj102.id).toEqual(102);
    expect(obj102.name).toEqual('Trail1');
    expect(obj102.options).toBeTruthy();

    // trail modifier
    const obj105 = state.get(105);
    expect(obj105).toBeTruthy();
    expect(obj105.type).toEqual('Line');

    // hikers list
    const list102 = state.get('K.102');
    expect(list102).toBeTruthy();
    expect(Array.isArray(list102)).toBeTruthy();
    expect(list102).toHaveLength(1);
    expect(list102[0]).toEqual(103);

    // hiker
    const obj103 = state.get(103);
    expect(obj103).toBeTruthy();
    expect(obj103.type).toEqual('Hiker:Trail');
    expect(obj103.id).toEqual(103);
    expect(obj103.name).toEqual('Hiker1');
    expect(obj103.options).toBeTruthy();

    // hiker movement behavior
    const obj104 = state.get(104);
    expect(obj104).toBeTruthy();
    expect(obj104.type).toEqual('MovementBehavior:Trail');
    expect(obj104.id).toEqual(104);
    expect(obj104.name).toEqual('movementBehavior-104');
    expect(obj104.started).toBeFalsy();
    expect(obj104.steps).toBeUndefined();
    expect(obj104.trailState).toBeUndefined();

    // hiker action behavior
    const obj106 = state.get(106);
    expect(obj106).toBeTruthy();
    expect(obj106.type).toEqual('ActionBehavior:Trace:Record');

    // hiker data behavior
    const obj107 = state.get(107);
    expect(obj107).toBeTruthy();
  });

  test('after single step', () => {
    const definition = parse(document);
    const simulation = build(testExecutionId, testSimulationId, definition, {
      plan,
      model,
    });

    simulation.run();

    const state = suspend(simulation);

    expect(state).toBeTruthy();

    // hiker movement behavior
    const obj104 = state.get(104);
    debug('suspend', obj104);
    expect(obj104).toBeTruthy();
    expect(obj104.type).toEqual('MovementBehavior:Trail');
    expect(obj104.id).toEqual(104);
    expect(obj104.name).toEqual('movementBehavior-104');
    expect(obj104.displacementScheme).toEqual('fixed');
    expect(obj104.fixedDisplacement).toEqual([10, 20]);
    expect(obj104.initialLocation).toEqual([0, 10]);
    expect(obj104.stepLimit).toEqual(45);
    expect(obj104.started).toBeTruthy();
    expect(obj104.steps).toEqual(1);

    const trailState = obj104.trailState;
    expect(trailState).toBeDefined();
    expect(trailState.orientation).toBeUndefined();
    expect(trailState._initialLocation).toEqual(new Point([0, 10]));
    expect(trailState._movement).toEqual(new Size([10, 20]));
    expect(trailState._location).toEqual(new Point([10, 30]));
  });

  test('after multiple steps', () => {
    const definition = parse(document);
    const simulation = build(testExecutionId, testSimulationId, definition, {
      plan,
      model,
    });

    simulation.run();
    simulation.run();
    simulation.run();

    const state = suspend(simulation);

    expect(state).toBeTruthy();

    // hiker movement behavior
    const obj104 = state.get(104);
    debug('suspend', obj104);
    expect(obj104).toBeTruthy();
    expect(obj104.type).toEqual('MovementBehavior:Trail');
    expect(obj104.id).toEqual(104);
    expect(obj104.name).toEqual('movementBehavior-104');
    expect(obj104.displacementScheme).toEqual('fixed');
    expect(obj104.fixedDisplacement).toEqual([10, 20]);
    expect(obj104.initialLocation).toEqual([0, 10]);
    expect(obj104.stepLimit).toEqual(45);
    expect(obj104.started).toBeTruthy();
    expect(obj104.steps).toEqual(3);

    const trailState = obj104.trailState;
    expect(trailState).toBeDefined();
    expect(trailState.orientation).toBeUndefined();
    expect(trailState._initialLocation).toEqual(new Point([0, 10]));
    expect(trailState._movement).toEqual(new Size([10, 20]));
    expect(trailState._location).toEqual(new Point([30, 70]));
  });
});

describe('restore', () => {
  test('after build', () => {
    const definition = parse(document);
    const simulation = build(testExecutionId, testSimulationId, definition, {
      plan,
      model,
    });

    const testState = suspend(simulation);

    const restored = restore(testExecutionId, testSimulationId, testState, {
      plan,
      model,
    });

    expect(restored).toBeTruthy();

    const state = suspend(restored);

    // simulation
    const objSimulation = state.get(testSimulationId);
    expect(objSimulation.id).toEqual(testSimulationId);
    expect(objSimulation.executionId).toEqual(testExecutionId);

    // hike
    const obj101 = state.get(101);
    expect(obj101).toBeTruthy();
    expect(obj101.type).toEqual('Hike');
    expect(obj101.id).toEqual(101);
    expect(obj101.name).toEqual('Hike1');
    expect(obj101.size).toEqual(new Size(100, 200));
    expect(obj101.bounds.width).toEqual(100);
    expect(obj101.bounds.height).toEqual(200);
    expect(obj101.options).toBeTruthy();

    // trails list
    const list101 = state.get('T.101');
    expect(list101).toBeTruthy();
    expect(Array.isArray(list101)).toBeTruthy();
    expect(list101).toHaveLength(1);
    expect(list101[0]).toEqual(102);

    // trail
    const obj102 = state.get(102);
    expect(obj102).toBeTruthy();
    expect(obj102.type).toEqual('Trail:Line');
    expect(obj102.id).toEqual(102);
    expect(obj102.name).toEqual('Trail1');
    expect(obj102.options).toBeTruthy();

    // hikers list
    const list102 = state.get('K.102');
    expect(list102).toBeTruthy();
    expect(Array.isArray(list102)).toBeTruthy();
    expect(list102).toHaveLength(1);
    expect(list102[0]).toEqual(103);

    // hiker
    const obj103 = state.get(103);
    expect(obj103).toBeTruthy();
    expect(obj103.type).toEqual('Hiker:Trail');
    expect(obj103.id).toEqual(103);
    expect(obj103.name).toEqual('Hiker1');
    expect(obj103.options).toBeTruthy();

    // hiker movement behavior
    const obj104 = state.get(104);
    expect(obj104).toBeTruthy();
    expect(obj104.type).toEqual('MovementBehavior:Trail');
    expect(obj104.id).toEqual(104);
    expect(obj104.name).toEqual('movementBehavior-104');
    expect(obj104.started).toBeFalsy();
    expect(obj104.steps).toBeUndefined();
    expect(obj104.trailState).toBeUndefined();
  });

  test('after single step', () => {
    const definition = parse(document);
    const simulation = build(testExecutionId, testSimulationId, definition, {
      plan,
      model,
    });

    simulation.run();

    const testState = suspend(simulation);

    const restored = restore(testExecutionId, testSimulationId, testState, {
      plan,
      model,
    });

    expect(restored).toBeTruthy();

    const state = suspend(restored);

    // hiker movement behavior
    const obj104 = state.get(104);
    debug('second suspend', obj104);
    expect(obj104).toBeTruthy();
    expect(obj104.type).toEqual('MovementBehavior:Trail');
    expect(obj104.id).toEqual(104);
    expect(obj104.name).toEqual('movementBehavior-104');
    expect(obj104.displacementScheme).toEqual('fixed');
    expect(obj104.fixedDisplacement).toEqual([10, 20]);
    expect(obj104.initialLocation).toEqual([0, 10]);
    expect(obj104.stepLimit).toEqual(45);
    expect(obj104.started).toBeTruthy();
    expect(obj104.steps).toEqual(1);

    const trailState = obj104.trailState;
    expect(trailState).toBeDefined();
    expect(trailState.orientation).toBeUndefined();
    expect(trailState._initialLocation).toEqual(new Point([0, 10]));
    expect(trailState._movement).toEqual(new Size([10, 20]));
    expect(trailState._location).toEqual(new Point([10, 30]));
  });

  test('after multiple steps', () => {
    const definition = parse(document);
    const simulation = build(testExecutionId, testSimulationId, definition, {
      plan,
      model,
    });

    const iterations = 5;
    for (let i = 0; i < iterations; i++) {
      simulation.run();
    }

    const restored = restore(testExecutionId, testSimulationId, suspend(simulation), {
      plan,
      model,
    });

    const state = suspend(restored);

    // hiker movement behavior
    const hikerMovementBehavior = state.get(104);
    expect(hikerMovementBehavior.steps).toEqual(iterations);

    const trailState = hikerMovementBehavior.trailState;
    const { _initialLocation, _location, _movement } = trailState;
    expect(_location).toEqual(
      new Point([
        _initialLocation.x + iterations * _movement.width,
        _initialLocation.y + iterations * _movement.height,
      ]),
    );
  });
});
