import build, { parse } from '../simulationBuilder';

test('build', () => {
  const simulation = build();
  expect(simulation).toBeTruthy();
});

test('parse', () => {
  const document = `
---
hikes:
  - hike1:
      id: 101
      name: Hike1
      type: Trail
      trails:
        - trail1:
            id: 102
            name: Trail1
            type: Line
            trailStateModifiers:
              - stateModifier1:
                  id: 105
                  type: Line
            hikers:
              - hiker1:
                  id: 103
                  name: Hiker1
                  type: Trail
                  movementBehaviors:
                    - movement1:
                        id: 104
                        type: Trail
                        displacementScheme: fixed
                        fixedDisplacement: [10, 20]
                        stepLimit: 45
                        initialLocation: [0, 10]
  `;
  const doc = parse(document);
  expect(doc).toBeTruthy();
});
