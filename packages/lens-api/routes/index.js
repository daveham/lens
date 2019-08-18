import { addRoutes as addCatalogRoutes } from './catalog';
import { addRoutes as addEditorRoutes } from './editor';

import { addRoutes as addHelloRoutes } from './hello';
import { addRoutes as addPingRoutes } from './ping';
import { addRoutes as addImageRoutes } from './image';
import { addRoutes as addStatsRoutes } from './stats';
import { addRoutes as addDeleteStatsRoutes } from './admin/deleteStats';

const routes = (server, mgr) => {
  addCatalogRoutes(server);
  addEditorRoutes(server, mgr);
  addPingRoutes(server);
  addImageRoutes(server);
  addStatsRoutes(server);
  addDeleteStatsRoutes(server);
  addHelloRoutes(server);
};

export default routes;
