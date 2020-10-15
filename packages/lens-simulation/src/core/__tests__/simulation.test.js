import Size from '../../basic/size';
import DicePlan from '../common/dicePlan';
import { HikerExitReason } from '../constants';
import build, { parse } from '../simulationBuilder';

// import getDebugLog from '../debugLog';
// const debug = getDebugLog('simulationTests');

const model = { size: [100, 200] };
const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);

test('line hiker, fixed displacement, left to right', () => {
  const document = `
---
# test hike 1
description: >
  Single hiker, start left edge, move right 10 at a time.
  Stop after 50 steps or after hitting right edge.
hikes:
  - type: Trail
    trails:
      - type: Line
        modifiers:
          - type: Line
        hikers:
          - type: Trail
            movementBehavior:
              type: Trail
              options:
                displacement: fixed
                fixedDisplacement: [10, 0]
                stepLimit: 50
                initialLocation: [0, 10]
  `;

  const definition = parse(document);
  const simulation = build(model, plan, definition);

  return simulation.run(0).then(() => {
    const [hiker] = simulation.hikes[0].trails[0].hikers;
    // should have hit the right edge
    expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);

    const { movementBehavior } = hiker.strategy;
    // in 10 steps
    expect(movementBehavior.strategy.steps).toBe(10);
  });
});

test('line hiker, fixed displacement, right to left', () => {
  const document = `
---
# test hike 1
description: >
  Single hiker, start right edge, move left 5 at a time.
  Stop after 50 steps or after hitting left edge.
hikes:
  - type: Trail
    trails:
      - type: Line
        modifiers:
          - type: Line
        hikers:
          - type: Trail
            movementBehavior:
              type: Trail
              options:
                displacement: fixed
                fixedDisplacement: [-5, 0]
                stepLimit: 50
                initialLocation: [99.9999, 30]
  `;

  const definition = parse(document);
  const simulation = build(model, plan, definition);

  return simulation.run(0).then(() => {
    const [hiker] = simulation.hikes[0].trails[0].hikers;
    // should have hit the left edge
    expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);

    const { movementBehavior } = hiker.strategy;
    // in 20 steps
    expect(movementBehavior.strategy.steps).toBe(20);
  });
});

test('cover hiker, rows first', () => {
  const document = `
---
# test hike 1
description: >
  Single hiker, cover image left to right, rows first.
  Stop after 500 steps or after covering image.
hikes:
  - type: Trail
    trails:
      - type: Cover
        modifiers:
          - type: RowsFirst
            options:
              rightToLeft: false
              positionByCenter: true
        hikers:
          - type: Trail
            movementBehavior:
              type: Trail
              options:
                displacement: fixed
                fixedDisplacement: [10, 10]
                stepLimit: 500
                initialLocation: [0, 0]
  `;

  const definition = parse(document);
  const simulation = build(model, plan, definition);

  return simulation.run(0).then(() => {
    const [hiker] = simulation.hikes[0].trails[0].hikers;
    // should have hit the left edge
    expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);

    const { movementBehavior } = hiker.strategy;
    // in 20 steps
    expect(movementBehavior.strategy.steps).toBe(200);
  });
});
