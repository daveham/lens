import Size from '../../basic/size';
import DicePlan from '../common/dicePlan';
import { HikerExitReason } from '../constants';
import build, { parse } from '../simulationBuilder';

// import getDebugLog from '../debugLog';
// const debug = getDebugLog('simulationTests');

const model = { size: [100, 200] };
const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);

const trailHikeWithLineTrailDocument = `
---
# trail hike with line trail
hikes:
  - type: Trail
    trails:
      - type: Line
        modifiers:
          - type: Line
`;

const trailHikeWithCoverTrailDocument = `
---
# trail hike with line trail
hikes:
  - type: Trail
    trails:
      - type: Cover
        modifiers:
          - type: RowsFirst
            options:
              rightToLeft: false
              positionByCenter: true
`;

const trailHikerDocument = `
---
# trail hiker with fixed displacement movement
hikers:
  - type: Trail
    actionBehavior:
      type: Record
      options:
        trace: true
    movementBehavior:
      type: Trail
`;

function makeSimulation(hikeDocument, hikerDocument, movementOptions) {
  const definition = parse(hikeDocument);
  const hikersDefinition = parse(hikerDocument);
  definition.hikes[0].trails[0].hikers = hikersDefinition.hikers;
  hikersDefinition.hikers[0].movementBehavior.options = movementOptions;
  return build(model, plan, definition);
}

test('line hiker, fixed displacement, left to right', () => {
  const simulation = makeSimulation(trailHikeWithLineTrailDocument, trailHikerDocument, {
    displacementScheme: 'fixed',
    fixedDisplacement: [10, 0],
    stepLimit: 50,
    initialLocation: [0, 10],
  });

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
  const simulation = makeSimulation(trailHikeWithLineTrailDocument, trailHikerDocument, {
    displacementScheme: 'fixed',
    fixedDisplacement: [-5, 0],
    stepLimit: 50,
    initialLocation: [99.9999, 30],
  });

  return simulation.run(0).then(() => {
    const [hiker] = simulation.hikes[0].trails[0].hikers;
    // should have hit the left edge
    expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);

    const { movementBehavior } = hiker.strategy;
    // in 20 steps
    expect(movementBehavior.strategy.steps).toBe(20);
  });
});

test('cover hiker, fixed displacement, rows first', () => {
  const simulation = makeSimulation(trailHikeWithCoverTrailDocument, trailHikerDocument, {
    displacementScheme: 'fixed',
    fixedDisplacement: [10, 10],
    stepLimit: 500,
    initialLocation: [0, 0],
  });

  return simulation.run(0).then(() => {
    const [hiker] = simulation.hikes[0].trails[0].hikers;
    // should have hit the left edge
    expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);

    const { movementBehavior } = hiker.strategy;
    // in 20 steps
    expect(movementBehavior.strategy.steps).toBe(200);
  });
});

test('line hiker, grid displacement, left to right', () => {
  const simulation = makeSimulation(trailHikeWithLineTrailDocument, trailHikerDocument, {
    displacementScheme: 'grid',
    stepLimit: 50,
    initialLocation: [0, 10],
  });

  return simulation.run(0).then(() => {
    const [hiker] = simulation.hikes[0].trails[0].hikers;
    // should have hit the right edge
    expect(hiker.exitReason).toBe(HikerExitReason.exceededImageBounds);

    const { movementBehavior } = hiker.strategy;
    // in 7 steps (100 / 16)
    expect(movementBehavior.strategy.steps).toBe(7);
  });
});
