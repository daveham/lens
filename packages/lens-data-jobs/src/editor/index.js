import { createJob } from '../utils';

export const runExecution = (clientId, payload) => createJob('runExecution', { clientId, payload });

export const startExecution = (clientId, payload) =>
  createJob('startExecution', { clientId, payload });

export const runExecutionPass = (clientId, payload) =>
  createJob('runExecutionPass', { clientId, payload });

export const finishExecution = (clientId, payload) =>
  createJob('finishExecution', { clientId, payload });
