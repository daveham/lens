import build, { parse } from '../simulationBuilder';

// import getDebugLog from '../debugLog';
// const debug = getDebugLog('simulationBuilderTests');

test('build', () => {
  const simulation = build();
  expect(simulation).toBeTruthy();
});

test('parse', () => {
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
              displacementScheme: fixed
              fixedDisplacement: [10, 20]
              stepLimit: 45
              initialLocation: [0, 10]
  `;
  const doc = parse(document);
  expect(doc).toBeTruthy();
  expect(doc.hikes).toHaveLength(1);
  const [hike] = doc.hikes;
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
  expect(hiker.movementBehavior).toBeTruthy();
  const { movementBehavior } = hiker;
  expect(movementBehavior.type).toBe('Trail');
  expect(movementBehavior.displacementScheme).toBe('fixed');
  expect(movementBehavior.fixedDisplacement[1]).toBe(20);
});
