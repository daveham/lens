import co from 'co';
import paths from '../../../config/paths';
import { respond, respondWithError } from '../../../server/context';

import _debug from 'debug';
// import fileStat from '../utils/fileStat';
import identify from '../utils/gmIdentify';
import loadCatalog from '../utils/loadCatalog';
const debug = _debug('lens:editor');

const delayJobStep = delay => {
  return new Promise(resolve => setTimeout(() => resolve(), delay));
};

function* getExecutionContext(sourceId) {
  const catalog = yield loadCatalog();
  const { file } = catalog[sourceId];
  const sourceFile = paths.resolveSourcePath(file);
  // const fileStats = yield fileStat(sourceFile);
  const identifyResults = yield identify(sourceFile);
  const { width, height } = identifyResults;
  return {
    sourceId,
    sourceFile,
    height,
    width,
  };
}

function* runExecutionGenerator(job) {
  respond(job, { message: 'execution started' });
  const { payload, ...parameters } = job;
  debug('perform runExecution', { payload, parameters });
  const {
    simulation: { sourceId },
  } = payload;

  const executionContext = yield* getExecutionContext(sourceId);
  debug('runExecution', { executionContext });

  respond(job, { message: 'hike initialized' });

  yield delayJobStep(200);
  respond(job, { message: 'trail initialized' });

  yield delayJobStep(200);
  respond(job, { message: 'hiker initialized' });

  yield delayJobStep(1000);
  respond(job, { message: 'quota 25%' });

  yield delayJobStep(1000);
  respond(job, { message: 'quota 50%' });

  yield delayJobStep(1000);
  respond(job, { message: 'quota 75%' });

  yield delayJobStep(1000);
  respond(job, { message: 'quota 100%' });

  yield delayJobStep(500);
  respond(job, { message: 'execution finished' });

  // yield Promise.resolve(true);
}

const editor = jobs => {
  jobs.runExecution = {
    perform: async job => {
      return co(runExecutionGenerator(job)).catch(error => {
        respondWithError(job, error);
      });
    },
  };
};

export default jobs => {
  editor(jobs);
};
