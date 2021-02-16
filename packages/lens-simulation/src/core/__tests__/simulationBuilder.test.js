import DicePlan from '../common/dicePlan';
import Point from '../../basic/point';
import Size from '../../basic/size';
import getDebugLog from '../debugLog';
import { build, parse, restore, suspend } from '../simulationBuilder';
import { getEndType } from '../factories/utils';

const debug = getDebugLog('simulationBuilderTests');

const testExecutionId = 101;
const testSimulationId = 102;

const hikeId = 201;
const trailId = 301;
const lineTrailModifierId = 302;

const trailHikerId = 401;
const trailHikerDataBehaviorId = 402;
const trailHikerRecordShapeActionBehaviorId = 403;
const trailHikerTrailMovementBehaviorId = 404;

const trailHikerTwoId = 501;
const trailHikerTwoTrailMovementBehaviorId = 502;

const document = `
---
# test hike 1
description: >
  This is an example of a trail hike that covers
  the image in row-first order.
hikes:
  - id: ${hikeId}
    name: Hike1
    type: Record
    trails:
      - id: ${trailId}
        name: Trail1
        type: Line
        modifiers:
          - id: ${lineTrailModifierId}
            type: Line
        hikers:
          - id: ${trailHikerId}
            name: Hiker1
            type: Trail
            movementBehavior:
              id: ${trailHikerTrailMovementBehaviorId}
              type: Trail
              options:
                displacementScheme: fixed
                fixedDisplacement: [10, 20]
                stepLimit: 45
                initialLocation: [0, 10]
            actionBehavior:
              id: ${trailHikerRecordShapeActionBehaviorId}
              type: RecordShape
              options:
                trace: true
                sizeScheme: fixed
                borderSize: 0
                fixedSize: [4, 4]
            dataBehavior:
              id: ${trailHikerDataBehaviorId}
`;

const model = { size: [100, 200] };
const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);

test('parse', () => {
  const definition = parse(document);
  expect(definition).toBeTruthy();
  expect(definition.hikes).toHaveLength(1);

  const [hike] = definition.hikes;
  expect(hike.type).toEqual('Record');
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

  const { actionBehavior } = hiker;
  expect(actionBehavior).toBeTruthy();
  expect(actionBehavior.type).toEqual('RecordShape');
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

    const { movementBehavior } = hiker;
    expect(movementBehavior).toBeTruthy();
    expect(movementBehavior.displacementScheme).toEqual('fixed');

    const { actionBehavior } = hiker;
    expect(actionBehavior).toBeTruthy();
    expect(getEndType(actionBehavior)).toEqual('RecordShape');
  });

  test('with addon', () => {
    const addonDocument = `
---
# second hiker
  id: ${trailHikerTwoId}
  name: Hiker2
  type: Trail
  movementBehavior:
    id: ${trailHikerTwoTrailMovementBehaviorId}
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
    const [, trailHikerTwo] = trail.hikers;
    expect(trailHikerTwo).toBeTruthy();
    expect(trailHikerTwo.id).toEqual(trailHikerTwoId);

    const { movementBehavior: trailHikerTwoMovementBehavior } = trailHikerTwo;
    expect(trailHikerTwoMovementBehavior).toBeTruthy();
    expect(trailHikerTwoMovementBehavior.displacementScheme).toEqual('grid');
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
    const objHike = state.get(hikeId);
    expect(objHike).toBeTruthy();
    expect(objHike.type).toEqual('Hike:Record');
    expect(objHike.id).toEqual(hikeId);
    expect(objHike.name).toEqual('Hike1');
    expect(objHike.size).toEqual(new Size(100, 200));
    expect(objHike.bounds.width).toEqual(100);
    expect(objHike.bounds.height).toEqual(200);
    expect(objHike.options).toBeTruthy();

    // trails list
    const listTrails = state.get(`T.${hikeId}`);
    expect(listTrails).toBeTruthy();
    expect(Array.isArray(listTrails)).toBeTruthy();
    expect(listTrails).toHaveLength(1);
    expect(listTrails[0]).toEqual(trailId);

    // trail
    const objTrail = state.get(trailId);
    expect(objTrail).toBeTruthy();
    expect(objTrail.type).toEqual('Trail:Line');
    expect(objTrail.id).toEqual(trailId);
    expect(objTrail.name).toEqual('Trail1');
    expect(objTrail.options).toBeTruthy();

    // trail modifier
    const objLineTrailModifier = state.get(lineTrailModifierId);
    expect(objLineTrailModifier).toBeTruthy();
    expect(objLineTrailModifier.type).toEqual('Line');

    // hikers list
    const listHikers = state.get(`K.${trailId}`);
    expect(listHikers).toBeTruthy();
    expect(Array.isArray(listHikers)).toBeTruthy();
    expect(listHikers).toHaveLength(1);
    expect(listHikers[0]).toEqual(trailHikerId);

    // hiker
    const objTrailHikerId = state.get(trailHikerId);
    expect(objTrailHikerId).toBeTruthy();
    expect(objTrailHikerId.type).toEqual('Hiker:Trail');
    expect(objTrailHikerId.id).toEqual(trailHikerId);
    expect(objTrailHikerId.name).toEqual('Hiker1');
    expect(objTrailHikerId.options).toBeTruthy();

    // hiker movement behavior
    const objTrailHikerTrailMovementBehavior = state.get(trailHikerTrailMovementBehaviorId);
    expect(objTrailHikerTrailMovementBehavior).toBeTruthy();
    expect(objTrailHikerTrailMovementBehavior.type).toEqual('MovementBehavior:Trail');
    expect(objTrailHikerTrailMovementBehavior.id).toEqual(trailHikerTrailMovementBehaviorId);
    expect(objTrailHikerTrailMovementBehavior.name).toEqual(
      `movementBehavior-${trailHikerTrailMovementBehaviorId}`,
    );
    expect(objTrailHikerTrailMovementBehavior.started).toBeFalsy();
    expect(objTrailHikerTrailMovementBehavior.steps).toBeUndefined();
    expect(objTrailHikerTrailMovementBehavior.trailState).toBeUndefined();

    // hiker action behavior
    const objTrailHikerRecordShapeActionBehavior = state.get(trailHikerRecordShapeActionBehaviorId);
    expect(objTrailHikerRecordShapeActionBehavior).toBeTruthy();
    expect(objTrailHikerRecordShapeActionBehavior.type).toEqual(
      'ActionBehavior:Trace:Record:RecordShape',
    );

    // hiker data behavior
    const objTrailHikerDataBehavior = state.get(trailHikerDataBehaviorId);
    expect(objTrailHikerDataBehavior).toBeTruthy();
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
    const objTrailHikerTrailMovementBehavior = state.get(trailHikerTrailMovementBehaviorId);
    debug('suspend', objTrailHikerTrailMovementBehavior);
    expect(objTrailHikerTrailMovementBehavior).toBeTruthy();
    expect(objTrailHikerTrailMovementBehavior.type).toEqual('MovementBehavior:Trail');
    expect(objTrailHikerTrailMovementBehavior.id).toEqual(trailHikerTrailMovementBehaviorId);
    expect(objTrailHikerTrailMovementBehavior.name).toEqual(
      `movementBehavior-${trailHikerTrailMovementBehaviorId}`,
    );
    expect(objTrailHikerTrailMovementBehavior.displacementScheme).toEqual('fixed');
    expect(objTrailHikerTrailMovementBehavior.fixedDisplacement).toEqual([10, 20]);
    expect(objTrailHikerTrailMovementBehavior.initialLocation).toEqual([0, 10]);
    expect(objTrailHikerTrailMovementBehavior.stepLimit).toEqual(45);
    expect(objTrailHikerTrailMovementBehavior.started).toBeTruthy();
    expect(objTrailHikerTrailMovementBehavior.steps).toEqual(1);

    const trailState = objTrailHikerTrailMovementBehavior.trailState;
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
    const objTrailHikerTrailMovementBehavior = state.get(trailHikerTrailMovementBehaviorId);
    debug('suspend', objTrailHikerTrailMovementBehavior);
    expect(objTrailHikerTrailMovementBehavior).toBeTruthy();
    expect(objTrailHikerTrailMovementBehavior.type).toEqual('MovementBehavior:Trail');
    expect(objTrailHikerTrailMovementBehavior.id).toEqual(trailHikerTrailMovementBehaviorId);
    expect(objTrailHikerTrailMovementBehavior.name).toEqual(
      `movementBehavior-${trailHikerTrailMovementBehaviorId}`,
    );
    expect(objTrailHikerTrailMovementBehavior.displacementScheme).toEqual('fixed');
    expect(objTrailHikerTrailMovementBehavior.fixedDisplacement).toEqual([10, 20]);
    expect(objTrailHikerTrailMovementBehavior.initialLocation).toEqual([0, 10]);
    expect(objTrailHikerTrailMovementBehavior.stepLimit).toEqual(45);
    expect(objTrailHikerTrailMovementBehavior.started).toBeTruthy();
    expect(objTrailHikerTrailMovementBehavior.steps).toEqual(3);

    const trailState = objTrailHikerTrailMovementBehavior.trailState;
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
    const objHike = state.get(hikeId);
    expect(objHike).toBeTruthy();
    expect(objHike.type).toEqual('Hike:Record');
    expect(objHike.id).toEqual(hikeId);
    expect(objHike.name).toEqual('Hike1');
    expect(objHike.size).toEqual(new Size(100, 200));
    expect(objHike.bounds.width).toEqual(100);
    expect(objHike.bounds.height).toEqual(200);
    expect(objHike.options).toBeTruthy();

    // trails list
    const listTrails = state.get(`T.${hikeId}`);
    expect(listTrails).toBeTruthy();
    expect(Array.isArray(listTrails)).toBeTruthy();
    expect(listTrails).toHaveLength(1);
    expect(listTrails[0]).toEqual(trailId);

    // trail
    const objTrail = state.get(trailId);
    expect(objTrail).toBeTruthy();
    expect(objTrail.type).toEqual('Trail:Line');
    expect(objTrail.id).toEqual(trailId);
    expect(objTrail.name).toEqual('Trail1');
    expect(objTrail.options).toBeTruthy();

    // hikers list
    const listHikers = state.get(`K.${trailId}`);
    expect(listHikers).toBeTruthy();
    expect(Array.isArray(listHikers)).toBeTruthy();
    expect(listHikers).toHaveLength(1);
    expect(listHikers[0]).toEqual(trailHikerId);

    // hiker
    const objTrailHiker = state.get(trailHikerId);
    expect(objTrailHiker).toBeTruthy();
    expect(objTrailHiker.type).toEqual('Hiker:Trail');
    expect(objTrailHiker.id).toEqual(trailHikerId);
    expect(objTrailHiker.name).toEqual('Hiker1');
    expect(objTrailHiker.options).toBeTruthy();

    // hiker movement behavior
    const objTrailHikerTrailMovementBehavior = state.get(trailHikerTrailMovementBehaviorId);
    expect(objTrailHikerTrailMovementBehavior).toBeTruthy();
    expect(objTrailHikerTrailMovementBehavior.type).toEqual('MovementBehavior:Trail');
    expect(objTrailHikerTrailMovementBehavior.id).toEqual(trailHikerTrailMovementBehaviorId);
    expect(objTrailHikerTrailMovementBehavior.name).toEqual(
      `movementBehavior-${trailHikerTrailMovementBehaviorId}`,
    );
    expect(objTrailHikerTrailMovementBehavior.started).toBeFalsy();
    expect(objTrailHikerTrailMovementBehavior.steps).toBeUndefined();
    expect(objTrailHikerTrailMovementBehavior.trailState).toBeUndefined();
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
    const objTrailHikerTrailMovementBehavior = state.get(trailHikerTrailMovementBehaviorId);
    debug('second suspend', objTrailHikerTrailMovementBehavior);
    expect(objTrailHikerTrailMovementBehavior).toBeTruthy();
    expect(objTrailHikerTrailMovementBehavior.type).toEqual('MovementBehavior:Trail');
    expect(objTrailHikerTrailMovementBehavior.id).toEqual(trailHikerTrailMovementBehaviorId);
    expect(objTrailHikerTrailMovementBehavior.name).toEqual(
      `movementBehavior-${trailHikerTrailMovementBehaviorId}`,
    );
    expect(objTrailHikerTrailMovementBehavior.displacementScheme).toEqual('fixed');
    expect(objTrailHikerTrailMovementBehavior.fixedDisplacement).toEqual([10, 20]);
    expect(objTrailHikerTrailMovementBehavior.initialLocation).toEqual([0, 10]);
    expect(objTrailHikerTrailMovementBehavior.stepLimit).toEqual(45);
    expect(objTrailHikerTrailMovementBehavior.started).toBeTruthy();
    expect(objTrailHikerTrailMovementBehavior.steps).toEqual(1);

    const trailState = objTrailHikerTrailMovementBehavior.trailState;
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
    const objTrailHikerTrailMovementBehavior = state.get(trailHikerTrailMovementBehaviorId);
    expect(objTrailHikerTrailMovementBehavior.steps).toEqual(iterations);

    const trailState = objTrailHikerTrailMovementBehavior.trailState;
    const { _initialLocation, _location, _movement } = trailState;
    expect(_location).toEqual(
      new Point([
        _initialLocation.x + iterations * _movement.width,
        _initialLocation.y + iterations * _movement.height,
      ]),
    );
  });
});
