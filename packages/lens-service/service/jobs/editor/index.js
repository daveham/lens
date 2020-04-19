import co from 'co';

import {
  startExecution as startExecutionJob,
  runExecutionPass as runExecutionPassJob,
  finishExecution as finishExecutionJob,
} from '@lens/data-jobs';

import { simulationBuilder } from '@lens/simulation';

import paths from '../../../config/paths';
import { respond, respondWithError } from '../../../server/context';

// import fileStat from '../utils/fileStat';
import identify from '../utils/gmIdentify';
import loadCatalog from '../utils/loadCatalog';
import enqueueJob from '../utils/enqueueJob';

import _debug from 'debug';
const debug = _debug('lens:editor');

const delayJobStep = delay => {
  return new Promise(resolve => setTimeout(() => resolve(), delay));
};

function* initializeExecution(job) {
  const { payload, ...parameters } = job;
  debug('perform runExecution', { payload, parameters });
  const {
    simulation: { sourceId },
    execution: { id },
  } = payload;

  const catalog = yield loadCatalog();
  const { file } = catalog[sourceId];
  const sourceFile = paths.resolveSourcePath(file);
  // const fileStats = yield fileStat(sourceFile);
  const identifyResults = yield identify(sourceFile);
  const { width, height } = identifyResults;
  const simulation = simulationBuilder({
    sourceId,
    sourceFile,
    height,
    width,
  });

  const progress = {
    id,
    running: false,
    passCount: 0,
  };

  debug('initializeExecution', JSON.stringify(simulation));
  respond(job, { progress });

  yield enqueueJob(startExecutionJob(job.clientId, { simulation, progress })).catch(error => {
    respondWithError(job, error);
  });
}

function* startExecution(job) {
  debug('* startExecution', { job });
  yield delayJobStep(500);

  const {
    payload: { simulation, progress: priorProgress },
  } = job;

  const progress = {
    ...priorProgress,
    running: true,
  };

  debug('startExecution', JSON.stringify(simulation));
  respond(job, { progress });

  yield enqueueJob(runExecutionPassJob(job.clientId, { simulation, progress })).catch(error => {
    respondWithError(job, error);
  });
}

function* runExecutionPass(job) {
  debug('* runExecutionPass', { job });
  yield delayJobStep(500);

  const {
    payload: { simulation, progress: priorProgress },
  } = job;

  const limit = 25;
  const running = priorProgress.passCount < limit;
  const passCount = priorProgress.passCount + (running ? 1 : 0);

  const progress = {
    ...priorProgress,
    running,
    passCount,
  };

  debug('runExecutionPass', JSON.stringify(simulation));
  respond(job, { progress });

  const nextJob = running
    ? runExecutionPassJob(job.clientId, { simulation, progress })
    : finishExecutionJob(job.clientId, { simulation, progress });

  yield enqueueJob(nextJob).catch(error => {
    respondWithError(job, error);
  });
}

function* finishExecution(job) {
  yield delayJobStep(500);

  const {
    payload: { simulation, progress },
  } = job;

  debug('finishExecution', JSON.stringify(simulation));
  respond(job, { progress });
}

const editor = jobs => {
  jobs.runExecution = {
    perform: async job =>
      // after initialization, it will enqueue a startExecution job
      co(initializeExecution(job)).catch(error => {
        respondWithError(job, error);
      }),
  };

  jobs.startExecution = {
    perform: async job =>
      // after execution, it will enqueue a runExecutionPass job
      co(startExecution(job)).catch(error => {
        respondWithError(job, error);
      }),
  };

  jobs.runExecutionPass = {
    perform: async job =>
      // after each pass, if not done, it will enqueue another runExecutionPass job
      // if done, it will enqueue a finishExecution jbo
      co(runExecutionPass(job)).catch(error => {
        respondWithError(job, error);
      }),
  };

  jobs.finishExecution = {
    perform: async job =>
      // after finishing, no other job is enqueued
      co(finishExecution(job)).catch(error => {
        respondWithError(job, error);
      }),
  };
};

export default jobs => {
  editor(jobs);
};
