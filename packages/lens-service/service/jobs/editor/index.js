import co from 'co';

import {
  startExecution as startExecutionJob,
  runExecutionPass as runExecutionPassJob,
  finishExecution as finishExecutionJob,
} from '@lens/data-jobs';

import paths from '../../../config/paths';
import { respond, respondWithError } from '../../../server/context';

// import fileStat from '../utils/fileStat';
import identify from '../utils/gmIdentify';
import loadCatalog from '../utils/loadCatalog';
import enqueueJob from '../utils/enqueueJob';

import simulationBuilder from '../../../core/simulationBuilder';

import _debug from 'debug';
const debug = _debug('lens:editor');

const delayJobStep = delay => {
  return new Promise(resolve => setTimeout(() => resolve(), delay));
};

function* initializeExecution(job) {
  respond(job, { message: 'execution initialization started' });
  const { payload, ...parameters } = job;
  debug('perform runExecution', { payload, parameters });
  const {
    simulation: { sourceId },
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

  yield enqueueJob(startExecutionJob(job.clientId, { simulation })).catch(error => {
    respondWithError(job, error);
  });
}

function* startExecution(job) {
  yield delayJobStep(500);
  respond(job, { message: 'execution started' });
  yield enqueueJob(runExecutionPassJob(job.clientId, {})).catch(error => {
    respondWithError(job, error);
  });
}

function* runExecutionPass(job) {
  yield delayJobStep(500);
  respond(job, { message: 'pass complete' });
  yield enqueueJob(finishExecutionJob(job.clientId, {})).catch(error => {
    respondWithError(job, error);
  });
}

function* finishExecution(job) {
  yield delayJobStep(500);
  respond(job, { message: 'execution finished' });
}

const editor = jobs => {
  jobs.runExecution = {
    perform: async job => {
      return co(initializeExecution(job)).catch(error => {
        respondWithError(job, error);
      });
    },
  };

  jobs.startExecution = {
    perform: async job => {
      return co(startExecution(job)).catch(error => {
        respondWithError(job, error);
      });
    },
  };

  jobs.runExecutionPass = {
    perform: async job => {
      return co(runExecutionPass(job)).catch(error => {
        respondWithError(job, error);
      });
    },
  };

  jobs.finishExecution = {
    perform: async job => {
      return co(finishExecution(job)).catch(error => {
        respondWithError(job, error);
      });
    },
  };
};

export default jobs => {
  editor(jobs);
};
