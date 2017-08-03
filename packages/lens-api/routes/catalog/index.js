import path from 'path';
import fs from 'fs';
import paths from '../../config/paths';
import _debug from 'debug';

const debug = _debug('lens:api');

export const loadCatalog = (cb) => {
  const catalogDataFile = path.join(paths.data, 'data.json');

  debug('reading catalog file from', catalogDataFile);
  fs.readFile(catalogDataFile, 'utf8', (err, data) => {
    if (err) {
      debug('loadCatalog error', err);
      return cb(err);
    }

    // TODO: catch exception in JSON parsing
    cb(null, JSON.parse(data));
  });
};

export default {
  get: (req, res, next) => {
    loadCatalog((err, catalog) => {
      if (err) {
        res.send(err);
      } else {
        res.send(catalog);
        next();
      }
    });
  }
};
