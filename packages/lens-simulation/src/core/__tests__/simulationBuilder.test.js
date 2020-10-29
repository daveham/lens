import Size from '../../basic/size';
import DicePlan from '../common/dicePlan';
import build, { parse } from '../simulationBuilder';

// import getDebugLog from '../debugLog';
// const debug = getDebugLog('simulationBuilderTests');

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
`;

test('parse', () => {
  const definition = parse(document);
  expect(definition).toBeTruthy();
  expect(definition.hikes).toHaveLength(1);

  const [hike] = definition.hikes;
  expect(hike.type).toBe('Trail');
  expect(hike.trails).toHaveLength(1);

  const [trail] = hike.trails;
  expect(trail.type).toBe('Line');
  expect(trail.modifiers).toHaveLength(1);

  const [modifier] = trail.modifiers;
  expect(modifier.type).toBe('Line');
  expect(trail.hikers).toHaveLength(1);

  const [hiker] = trail.hikers;
  expect(hiker.type).toBe('Trail');

  const { movementBehavior } = hiker;
  expect(movementBehavior).toBeTruthy();
  expect(movementBehavior.type).toBe('Trail');

  const { options } = movementBehavior;
  expect(options).toBeTruthy();
  expect(options.displacementScheme).toBe('fixed');
  expect(options.fixedDisplacement[1]).toBe(20);
});

describe('build', () => {
  const model = { size: [100, 200] };
  const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);

  test('single', () => {
    const definition = parse(document);
    const simulation = build(model, plan, definition);
    expect(simulation).toBeTruthy();

    expect(simulation.hikes).toBeTruthy();
    const [hike] = simulation.hikes;
    expect(hike).toBeTruthy();
    expect(hike.name).toBe('Hike1');

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
    expect(movementBehavior.strategy.displacementScheme).toBe('fixed');
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

    const simulation = build(model, plan, definition);
    expect(simulation).toBeTruthy();

    const [trail] = simulation.hikes[0].trails;
    expect(trail.hikers).toHaveLength(2);
    const [, hiker] = trail.hikers;
    expect(hiker).toBeTruthy();
    expect(hiker.id).toBe(105);

    const { movementBehavior } = hiker.strategy;
    expect(movementBehavior).toBeTruthy();
    expect(movementBehavior.strategy.displacementScheme).toBe('grid');
  });
});
