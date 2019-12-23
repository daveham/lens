import { database } from 'config/paths';
import {
  createManager,
  defineDatabase,
} from './db/utils';

import _debug from 'debug';
const debug = _debug('lens:api:schema');

const debugOptions = {
  db: true,
  read: true,
  write: true,
  delete: true,
  batch: true,
};

export function createDataManager() {
  return defineDatabase(database, debugOptions)
    .then((db) => createManager(db))
    .catch(err => debug('caught error', { err }));
}
