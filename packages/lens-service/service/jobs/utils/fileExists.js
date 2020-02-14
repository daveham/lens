import fs from 'fs';

export default file => {
  return new Promise(function(resolve, reject) {
    fs.stat(file, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return resolve(false);
        }
        return reject(err);
      }
      resolve(stats.isFile());
    });
  });
};
