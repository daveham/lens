import asyncRoute from './asyncroute';

// these routes drive code splitting of both react components and redux reducers
export const featureARoute = asyncRoute(() => import('./containers/featureA'), () => import('./containers/featureA/reducer'));
export const featureBRoute = asyncRoute(() => import('./containers/featureB'), () => import('./containers/featureB/reducer'));
