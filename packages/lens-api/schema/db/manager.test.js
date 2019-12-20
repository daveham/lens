import memdown from 'memdown';

import {
  createManager,
  extendDatabase,
  createMockSimulation,
  createMockExecution,
  createMockRendering,
} from './utils';

import _debug from 'debug';
const debug = _debug('lvl:manager:test');

const debugOptions = {
  // db: true,
  // read: true,
  // write: true,
  // delete: true,
  // batch: true,
};

describe('db manager', () => {
  const sourceId = '1001';
  let mgr;
  let s1, e1, e2, r1, r2, r3, r4;
  beforeEach(() => {
    mgr = createManager(extendDatabase(memdown(), debugOptions));
    s1 = createMockSimulation(sourceId);
    e1 = createMockExecution(s1.id);
    e2 = createMockExecution(s1.id);
    r1 = createMockRendering(e1.id);
    r2 = createMockRendering(e1.id);
    r3 = createMockRendering(e2.id);
    r4 = createMockRendering(e2.id);

    return mgr.addRendering(r1)
      .then(() => mgr.addRendering(r2))
      .then(() => mgr.addRendering(r3))
      .then(() => mgr.addRendering(r4))
      .then(() => mgr.addExecution(e1))
      .then(() => mgr.addExecution(e2))
      .then(() => mgr.addSimulation(s1));
  });

  test('add simulation', () => {
    const s = createMockSimulation(sourceId);
    return mgr.addSimulation(s)
      .then(sim => {
        expect(sim).toBeDefined();
        expect(sim.id).toEqual(s.id);
        expect(sim.sourceId).toEqual(sourceId);
      });
  });

  test('get simulation', () =>
    mgr.getSimulation(s1.id)
      .then(sim => {
        debug('simulation', sim);
        expect(sim).toBeDefined();
        expect(sim.id).toEqual(s1.id);
      }));

  test('get simulations', () =>
    mgr.getSimulations()
      .then(rows => {
        debug('simulations', rows);
        expect(rows).toHaveLength(1);
        expect(rows[0].id).toEqual(s1.id);
      }));

  test('get simulations for source', () =>
    mgr.getSimulationsForSource(sourceId)
      .then(rows => {
        debug('simulations', rows);
        expect(rows).toHaveLength(1);
        expect(rows[0].id).toEqual(s1.id);
      }));

  test('update simulation', () =>
    // force enough delay between create and update
    new Promise((resolve) => setTimeout(() => resolve(s1), 1))
      .then(sim => mgr.updateSimulation(sim.id, { name: 'modified' }))
      .then(sim => {
        debug('simulation', sim);
        expect(sim).toBeDefined();
        expect(sim.id).toEqual(s1.id);
        expect(sim.name).toEqual('modified');
        expect(sim.created).toEqual(s1.created);
        expect(sim.modified).not.toEqual(sim.created);
      }));

  test('add execution', () => {
    const e = createMockExecution(s1.id);
    debug('mock execution', e);
    return mgr.addExecution(e)
      .then(exe => {
        debug('execution', exe);
        expect(exe).toBeDefined();
        expect(exe.id).toEqual(e.id);
        expect(exe.simulationId).toEqual(s1.id);
      });
  });

  test('get execution', () =>
    mgr.getExecution(e1.id)
      .then(exe => {
        debug('execution', exe);
        expect(exe).toBeDefined();
        expect(exe.id).toEqual(e1.id);
        expect(exe.simulationId).toEqual(s1.id);
      }));

  test('get executions', () =>
    mgr.getExecutions(s1.id)
      .then(rows => {
        debug('executions', rows);
        expect(rows).toHaveLength(2);
        expect(rows[0].id).toEqual(e1.id);
        expect(rows[0].simulationId).toEqual(s1.id);
        expect(rows[0].renderings[0].executionId).toEqual(e1.id);
        expect(rows[0].renderings[0].id).toEqual(r1.id);
        expect(rows[0].renderings[1].executionId).toEqual(e1.id);
        expect(rows[0].renderings[1].id).toEqual(r2.id);
        expect(rows[1].id).toEqual(e2.id);
        expect(rows[1].simulationId).toEqual(s1.id);
        expect(rows[1].renderings[0].executionId).toEqual(e2.id);
        expect(rows[1].renderings[0].id).toEqual(r3.id);
        expect(rows[1].renderings[1].executionId).toEqual(e2.id);
        expect(rows[1].renderings[1].id).toEqual(r4.id);
      }));

  test('update execution', () =>
    // force enough delay between create and update
    new Promise((resolve) => setTimeout(() => resolve(e1), 1))
      .then(exe => mgr.updateExecution(exe.id, { name: 'modified' }))
      .then(exe => {
        debug('execution', exe);
        expect(exe).toBeDefined();
        expect(exe.id).toEqual(e1.id);
        expect(exe.simulationId).toEqual(s1.id);
        expect(exe.name).toEqual('modified');
        expect(exe.created).toEqual(e1.created);
        expect(exe.modified).not.toEqual(exe.created);
      }));

  test('add rendering', () => {
    const r = createMockRendering(e1.id);
    debug('mock rendering', r);
    return mgr.addRendering(r)
      .then(ren => {
        debug('rendering', ren);
        expect(ren).toBeDefined();
        expect(ren.id).toEqual(r.id);
        expect(ren.executionId).toEqual(e1.id);
      });
  });

  test('get rendering', () =>
    mgr.getRendering(r1.id)
      .then(ren => {
        debug('rendering', ren);
        expect(ren).toBeDefined();
        expect(ren.id).toEqual(r1.id);
        expect(ren.executionId).toEqual(e1.id);
      }));

  test('get renderings', () =>
    mgr.getRenderings(e1.id)
      .then(rows => {
        debug('renderings', rows);
        expect(rows).toHaveLength(2);
        expect(rows[0].id).toEqual(r1.id);
        expect(rows[0].executionId).toEqual(e1.id);
        expect(rows[1].id).toEqual(r2.id);
        expect(rows[1].executionId).toEqual(e1.id);
      }));

  test('update rendering', () =>
    // force enough delay between create and update
    new Promise((resolve) => setTimeout(() => resolve(r1), 1))
      .then(ren => mgr.updateRendering(ren.id, { name: 'modified' }))
      .then(ren => {
        debug('rendering', ren);
        expect(ren).toBeDefined();
        expect(ren.id).toEqual(r1.id);
        expect(ren.executionId).toEqual(e1.id);
        expect(ren.name).toEqual('modified');
        expect(ren.created).toEqual(r1.created);
        expect(ren.modified).not.toEqual(ren.created);
      }));

  test('delete rendering', () =>
    mgr.deleteRendering(r1.id)
      .then(() => mgr.getRendering(r1.id))
      .then(ren => expect(ren).toBeUndefined())
      .then(() => mgr.getRenderingIndex(e1.id, r1.id))
      .then(idx => expect(idx).toBeUndefined()));

  test('delete execution', () =>
    mgr.deleteExecution(e1.id)
      .then(() => mgr.getRendering(r1.id))
      .then(ren => expect(ren).toBeUndefined())
      .then(() => mgr.getExecution(e1.id))
      .then(exe => expect(exe).toBeUndefined())
      .then(() => mgr.getRenderingIndex(e1.id, r1.id))
      .then(idx => expect(idx).toBeUndefined())
      .then(() => mgr.getExecutionIndex(s1.id, e1.id))
      .then(idx => expect(idx).toBeUndefined()));

  test('delete simulation', () =>
    mgr.deleteSimulation(s1.id)
      .then(() => mgr.getRendering(r1.id))
      .then(ren => expect(ren).toBeUndefined())
      .then(() => mgr.getRendering(r4.id))
      .then(ren => expect(ren).toBeUndefined())
      .then(() => mgr.getExecution(e1.id))
      .then(exe => expect(exe).toBeUndefined())
      .then(() => mgr.getExecution(e2.id))
      .then(exe => expect(exe).toBeUndefined())
      .then(() => mgr.getSimulation(s1.id))
      .then(sim => expect(sim).toBeUndefined())
      .then(() => mgr.getRenderingIndex(e1.id, r1.id))
      .then(idx => expect(idx).toBeUndefined())
      .then(() => mgr.getExecutionIndex(s1.id, e1.id))
      .then(idx => expect(idx).toBeUndefined())
      .then(() => mgr.getSimulationIndex(s1.sourceId, s1.id))
      .then(idx => expect(idx).toBeUndefined()));
});
