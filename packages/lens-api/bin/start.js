import restify from 'restify';
import corsMiddleware from 'restify-cors-middleware';

import routes from '../routes';

const cors = corsMiddleware({
  origins: ['*']
});

const server = restify.createServer({ name: 'lens-rest-api' });

server.pre(cors.preflight);
server.use(cors.actual);

routes(server);

const port = process.env.REST_PORT || 3001;
const host = process.env.REST_SERVER ||
  process.env.USER === 'vagrant' ? '192.168.20.20' : '0.0.0.0';

server.listen(port, host, () => {
  console.log('%s listening at ', server.name, server.url);
});
