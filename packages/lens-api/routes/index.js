import catalog from './catalog';
import hello from './hello';

const routes = (server) => {
  server.get('/catalog', catalog.get);
  server.get('/hello/:name', hello.get);
};

export default routes;
