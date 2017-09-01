import { routerReducer } from 'react-router-redux';
import common from './common';
import images from './images';
import stats from './stats';

export default {
  router: routerReducer,
  // other top-level reducers go here
  common,
  images,
  stats
};
