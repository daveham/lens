import { makeStatsId } from '@lens/image-descriptors';
import { ACTIONS } from './constants';

import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

import debugLib from 'debug';
const debug = debugLib('app:module:stats-acitons');

// action creators
const requestStatsAction = createAction(ACTIONS.REQUEST_STATS);
export const clearRequestStatsAction = createAction(ACTIONS.CLEAR_REQUEST_STATS);
export const receiveStatsAction = createAction(ACTIONS.RECEIVE_STATS);

// actions
export const ensureStats = (statsDescriptor, force) => {
  return (dispatch, getstate) => {
    const id = makeStatsId(statsDescriptor);
    const stats = getstate().stats[id];
    const notNeeded = stats && (stats.loading || (stats.data && !force));
    debug('ensureStats', { statsDescriptor, id, force, notNeeded });
    if (notNeeded) return;

    const body = JSON.stringify(statsDescriptor);
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    // mark image request in progress
    dispatch(requestStatsAction(statsDescriptor));

    // invoke api to generate the stats
    debug('ensureStats: Invoking fetch', { body, headers });
    return fetch('/api/stats/', { method: 'POST', body, headers })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('ensureStats: Bad response from server');
        }
        return response.json();
      }).then(({ jobId, error }) => {
        if (jobId) {
          // task has been enqueued to generate the stats
          debug('ensureStats - job enqueued', { jobId });
        } else if (error) {
          // server encountered an error
          debug('ensureStats - server error', { error });
          throw new Error(error); // TODO: what value here?
        } else {
          throw new Error('ensureStats: Unexpected response from server');
        }
      })
      .catch(reason => {
        // request failed, clear the 'in progress' state for image
        debug('ensureStats: Error', reason);
        dispatch(clearRequestStatsAction(statsDescriptor));
      });
  };
};

export const actions = {
  ensureStats,
  receiveStats: receiveStatsAction
};
