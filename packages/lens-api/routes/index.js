import catalog from './catalog';
import hello from './hello';
import ping from './ping';

const routes = (server) => {
  server.post('/ping', ping.post);
  server.get('/catalog', catalog.get);
  server.get('/hello/:name', hello.get);
};

export default routes;
