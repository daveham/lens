import Size from '../../basic/size';
import { parse } from '../simulationBuilder';
import SimulationFactory from '../simulationFactory';
import DicePlan from '../common/dicePlan';

import getDebugLog from '../debugLog';
const debug = getDebugLog('simulationFactoryTests');

describe('SimulationFactory', () => {
  const model = { size: [100, 200] };
  const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);

  let factory;

  beforeEach(() => {
    factory = new SimulationFactory();
    factory.initialize(plan, model, {});
  });

  test('createHike', () => {
    const document = `
---
type: Trail
options:
  marker: testHike
  `;
    const definition = parse(document);
    const hike = factory.createHike(definition);
    debug('createHike', hike);
    expect(hike).toBeTruthy();
    expect(hike.strategy.options.marker).toBe('testHike');
  });

  test('createTrail', () => {
    const document = `
---
type: Cover
options:
  moveOrder: rowsFirst
  marker: testTrail
modifiers:
  - type: Line
    `;
    const definition = parse(document);
    const trail = factory.createTrail(definition);
    debug('createTrail', trail);
    expect(trail).toBeTruthy();
    expect(trail.strategy.options.marker).toBe('testTrail');
  });

  test('createHiker', () => {
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
    const definition = parse(document);
    const hiker = factory.createHiker(definition);
    debug('createHiker', hiker);
    expect(hiker).toBeTruthy();
    const { strategy: hikerStrategy } = hiker;
    expect(hikerStrategy).toBeTruthy();
    expect(hikerStrategy.options.marker).toBe('testHiker');
    const { movementBehavior } = hikerStrategy;
    expect(movementBehavior).toBeTruthy();
    debug('movementBehavior', movementBehavior);
    expect(movementBehavior.strategy.options.marker).toBe('testMovementBehavior');
  });
});
