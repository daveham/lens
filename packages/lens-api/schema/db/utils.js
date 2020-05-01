import rimraf from 'rimraf';
import levelup from 'levelup';
import leveldown from 'leveldown';
import encode from 'encoding-down';
import charwise from 'charwise';
import uuid from 'uuid/v1';
// import sub from '../down';
import sub from 'subleveldown';

import Manager from './manager';

import getDebugLog from './debugLog';
const debug = getDebugLog('utils');

export const dataDbOptions = { valueEncoding: 'json' };
export const indexDbOptions = { keyEncoding: charwise, valueEncoding: 'json' };
const defaultDebugOptions = {
  // db: true,
  // read: true,
  // write: true,
  // delete: true,
  // batch: true,
};

const defaultInstrumentOptions = {
  // db: true,
  // read: true,
  // write: true,
  // delete: true,
  // batch: true,
};

export function extendDatabase(storage, debugOptions = {}) {
  const db = levelup(encode(storage));
  const loggingOptions = {
    ...defaultDebugOptions,
    ...debugOptions,
  };
  instrumentDatabase(db, 'db', loggingOptions);

  const dataDbs = ['simulations', 'executions', 'renderings'];
  const indexDbs = ['simulationsSourceIdx', 'executionsSimulationIdx', 'renderingsExecutionIdx'];

  dataDbs.forEach(name => {
    db[name] = sub(db, name, dataDbOptions);
    instrumentDatabase(db[name], name, loggingOptions);
  });

  indexDbs.forEach(name => {
    db[name] = sub(db, name, indexDbOptions);
    instrumentDatabase(db[name], name, loggingOptions);
  });

  return db;
}

export function createManager(db) {
  return new Manager(db, dataDbOptions, indexDbOptions);
}

export function defineDatabase(path, debugOptions = {}) {
  return Promise.resolve(extendDatabase(leveldown(path), debugOptions));
}

export function createMockSimulation(sourceId) {
  const created = Date.now();
  const id = uuid();
  return {
    id,
    created,
    modified: created,
    sourceId,
    name: `This is the name of sim.${id}`,
  };
}

export function createMockExecution(simulationId) {
  const created = Date.now();
  const id = uuid();
  return {
    id,
    created,
    modified: created,
    simulationId,
    name: `This is the name of exe.${id}`,
  };
}

export function createMockRendering(executionId) {
  const created = Date.now();
  const id = uuid();
  return {
    id,
    created,
    modified: created,
    executionId,
    name: `This is the name of ren.${id}`,
  };
}

export function generateMockRendering(simulationId, executionId) {
  const created = Date.now();
  const id = uuid();
  return {
    id,
    created,
    modified: created,
    simulationId,
    executionId,
    name: `sim${simulationId}-ex${executionId}-ren${id}`,
  };
}

export function generateMockExecution(simulationId, renderingsCount) {
  const created = Date.now();
  const id = uuid();
  const execution = {
    id,
    created,
    modified: created,
    simulationId,
    renderings: [],
    name: `sim${simulationId}-ex${id}`,
  };

  for (let i = 0; i < renderingsCount; i++) {
    execution.renderings.push(generateMockRendering(simulationId, id));
  }
  return execution;
}

export function generateMockSimulation(sourceId, renderingsCount) {
  const created = Date.now();
  const id = uuid();
  return {
    id,
    created,
    modified: created,
    sourceId,
    executions: renderingsCount.map(n => generateMockExecution(id, n)),
    name: `This is the name of sim${id}`,
  };
}

export function instrumentDatabase(db, label, debugOptions = {}) {
  const traceOptions = { ...defaultInstrumentOptions, ...debugOptions };

  if (
    traceOptions.db ||
    traceOptions.read ||
    traceOptions.write ||
    traceOptions.delete ||
    traceOptions.batch
  ) {
    debug('instrumentDatabase', label);
  }
  if (traceOptions.db) {
    db.on('open', () => debug(`[log.${label}] open`));
    db.on('closed', () => debug(`[log.${label}] closed`));
  }
  if (traceOptions.write) {
    db.on('put', (key, value) => debug(`[log.${label}] put`, { key, value }));
  }
  if (traceOptions.delete) {
    db.on('del', key => debug(`[log.${label}] del`, { key }));
  }
  if (traceOptions.batch) {
    db.on('batch', ops => debug(`[log.${label}] batch`, ops));
  }
}

export function cleanDatabase(path, debugOptions = {}, skip = false) {
  if (debugOptions.db) {
    debug('cleanDatabase', { path });
  }

  return new Promise((resolve, reject) => {
    if (!skip) {
      rimraf(path, err => {
        if (err) {
          debug('cleanDatabase', { err });
          reject(err);
        } else {
          resolve();
        }
      });
    } else resolve();
  });
}
