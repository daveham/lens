import Controller from './controller';
import { parse, build, restore, suspend } from './simulationBuilder';

import getDebugLog from './debugLog';
const debug = getDebugLog('jobs');

// temp
const enqueueJob = async job => {
  const { command } = job;
  debug(`enqueueJob '${command}'`, job);
  // const queue = await getQueue();
  // await queue.enqueue(config.queueName, command, [job]);
  return job;
};

function getSimulationYaml(simulationId) {
  debug('getSimulationYaml', { simulationId });
  // TODO
  return Promise.resolve('YAML');
}

function getExecution(executionId) {
  debug('getExecution', { executionId });
  // TODO
  return Promise.resolve({
    simulationId: 'xyzzy',
    model: {},
    plan: {},
    options: {},
  });
}

function getNewSimulation(executionId) {
  return getExecution(executionId).then(({ simulationId, model, plan }) =>
    getSimulationYaml(simulationId)
      .then(document => parse(document))
      .then(definition =>
        build(executionId, simulationId, definition, {
          model,
          plan,
        }),
      ),
  );
}

function restoreSimulation(executionId, state) {
  return getExecution(executionId).then(({ simulationId, model, plan }) =>
    getSimulationYaml(simulationId)
      .then(document => parse(document))
      .then(definition =>
        restore(
          executionId,
          simulationId,
          definition,
          {
            model,
            plan,
          },
          state,
        ),
      ),
  );
}

export function* runSimulation(job) {
  const {
    payload: { executionId, state },
  } = job;
  const simulation = state
    ? yield getNewSimulation(executionId)
    : yield restoreSimulation(executionId, state);
  debug('runSimulation', { simulation, state });

  const controller = new Controller();
  let blocked = false;
  while (!blocked) {
    const dataParams = controller.collect(simulation);
    // if dataParams is not null, the simulation is blocked waiting for data
    if (dataParams) {
      debug('runSimulation, suspend', { dataParams });
      blocked = true;
      // enqueue a job to gather the data; that job will resume the simulation with the data
      yield enqueueJob({
        command: 'getSimulationData',
        payload: {
          executionId,
          state: suspend(simulation),
          dataParams,
        },
      });
    } else {
      // the simulation doesn't need more data, run the current step
      controller.run(simulation);
      // the simulation will be "blocked" if it is not ready for next step
      blocked = !controller.isReady(simulation);
    }
  }
  if (controller.isActive(simulation)) {
    // the simulation is not finished, but it needs further work (TBD)
    // suspend state and enqueue for further work (TBD); next job will resume the simulation
    yield enqueueJob({
      command: 'unblockSimulation',
      payload: {
        executionId,
        state: suspend(simulation),
      },
    });
  } else {
    // the simulation is finished, wrap it up
    controller.finish(simulation);
  }
}

export function* getSimulationData(job) {
  const {
    payload: { executionId, state, dataParams },
  } = job;
  debug('getSimulationData', { executionId, state, dataParams });

  // TODO: turn dataParams to data
  yield enqueueJob({
    command: 'resumeSimulation',
    payload: { executionId, state, data: dataParams },
  });
}

export function* resumeSimulation(job) {
  const {
    payload: { executionId, state, data },
  } = job;
  const simulation = yield restoreSimulation(executionId, state);
  debug('resumeSimulation', { simulation, state, data });

  const controller = new Controller();
  controller.run(simulation, data);

  if (controller.isReady(simulation)) {
    yield enqueueJob({
      command: 'runSimulation',
      payload: {
        executionId,
        state: suspend(simulation),
      },
    });
  } else {
    if (controller.isActive(simulation)) {
      // the simulation is not finished, but it needs further work (TBD)
      // suspend state and enqueue for further work (TBD); next job will resume the simulation
      yield enqueueJob({
        command: 'unblockSimulation',
        payload: {
          executionId,
          state: suspend(simulation),
        },
      });
    } else {
      // the simulation is finished, wrap it up
      controller.finish(simulation);
    }
  }
}
