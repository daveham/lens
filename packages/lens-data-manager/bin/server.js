import config from '../config';
import app from 'server/app';

import _debug from 'debug';
const debug = _debug('lens:bin-server');

const { server_host, server_port } = config;

app.listen(server_port, server_host, () => {
  debug(`Server is now running at ${server_host}:${server_port}.`);
});
