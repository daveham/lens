import config from '../config';
import app from 'app';
import _debug from 'debug';
const debug = _debug('app:bin:server');

const host = config.server_host;
const port = config.server_port;

app.listen(port, host, () => {
  debug(`Server is now running at ${host}:${port}.`);
});
