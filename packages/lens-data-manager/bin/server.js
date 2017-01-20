import _debug from 'debug';
const debug = _debug('bin:server');
debug('I am here');

import config from '../config';
import app from 'app';

const host = config.server_host;
const port = config.server_port;

app.listen(port, host, () => {
  debug(`Server is now running at ${host}:${port}.`);
});
