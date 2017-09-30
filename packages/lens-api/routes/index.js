import catalog from './catalog';
import hello from './hello';
import ping from './ping';
import image from './image';

const routes = (server) => {
  server.post('/ping', ping.post);
  server.post('/image', image.post);
  server.get('/catalog', catalog.get);
  server.get('/hello/:name', hello.get);
};

export default routes;
