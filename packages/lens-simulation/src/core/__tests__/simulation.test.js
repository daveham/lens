import Controller from '../controller';
import DicePlan from '../common/dicePlan';
import Size from '../../basic/size';
import { HikerExitReason } from '../constants';
import { build, parse } from '../simulationBuilder';

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
      type: RecordShape
      options:
        trace: true
    movementBehavior:
      type: Trail
`;

const shapeHikerDocument = `
---
# shape hiker with fixed displacement movement
hikers:
  - type: Trail
    actionBehavior:
      type: RecordShape
      options:
        trace: true
    movementBehavior:
      type: Trail
`;

const testExecutionId = 101;
const testSimulationId = 202;

function makeTestSimulation(hikeDocument, hikerDocument, movementOptions) {
  const definition = parse(hikeDocument);
  const hikersDefinition = parse(hikerDocument);
  definition.hikes[0].trails[0].hikers = hikersDefinition.hikers;
  hikersDefinition.hikers[0].movementBehavior.options = movementOptions;

  return build(testExecutionId, testSimulationId, definition, { plan, model });
}

const TEST_LIMIT = 1000;

function runTestSimulation(simulation) {
  const controller = new Controller();
  let testLimitCounter = 0;
  while (controller.isActive(simulation) && testLimitCounter < TEST_LIMIT) {
    controller.run(simulation);
    testLimitCounter += 1;
  }
  controller.finish(simulation);
  return simulation;
}

test('line hiker, fixed displacement, left to right', () => {
  const simulation = runTestSimulation(
    makeTestSimulation(trailHikeWithLineTrailDocument, trailHikerDocument, {
      displacementScheme: 'fixed',
      fixedDisplacement: [10, 0],
      stepLimit: 50,
      initialLocation: [0, 10],
    }),
  );

  const [hiker] = simulation.hikes[0].trails[0].hikers;
  // should have hit the right edge
  expect(hiker.exitReason).toEqual(HikerExitReason.exceededImageBounds);

  const { movementBehavior } = hiker.strategy;
  // in 10 steps
  expect(movementBehavior.strategy.steps).toEqual(10);
});

test('line hiker, fixed displacement, right to left', () => {
  const simulation = runTestSimulation(
    makeTestSimulation(trailHikeWithLineTrailDocument, trailHikerDocument, {
      displacementScheme: 'fixed',
      fixedDisplacement: [-5, 0],
      stepLimit: 50,
      initialLocation: [99.9999, 30],
    }),
  );

  const [hiker] = simulation.hikes[0].trails[0].hikers;
  // should have hit the left edge
  expect(hiker.exitReason).toEqual(HikerExitReason.exceededImageBounds);

  const { movementBehavior } = hiker.strategy;
  // in 20 steps
  expect(movementBehavior.strategy.steps).toEqual(20);
});

test('cover hiker, fixed displacement, rows first', () => {
  const simulation = runTestSimulation(
    makeTestSimulation(trailHikeWithCoverTrailDocument, trailHikerDocument, {
      displacementScheme: 'fixed',
      fixedDisplacement: [10, 10],
      stepLimit: 500,
      initialLocation: [0, 0],
    }),
  );

  const [hiker] = simulation.hikes[0].trails[0].hikers;
  // should have hit the left edge
  expect(hiker.exitReason).toEqual(HikerExitReason.exceededImageBounds);

  const { movementBehavior } = hiker.strategy;
  // in 20 steps
  expect(movementBehavior.strategy.steps).toEqual(200);
});

test('line hiker, grid displacement, left to right', () => {
  const simulation = runTestSimulation(
    makeTestSimulation(trailHikeWithLineTrailDocument, shapeHikerDocument, {
      displacementScheme: 'grid',
      stepLimit: 50,
      initialLocation: [0, 10],
    }),
  );

  const [hiker] = simulation.hikes[0].trails[0].hikers;
  // should have hit the right edge
  expect(hiker.exitReason).toEqual(HikerExitReason.exceededImageBounds);

  const { movementBehavior } = hiker.strategy;
  // in 7 steps (100 / 16)
  expect(movementBehavior.strategy.steps).toEqual(7);
});
