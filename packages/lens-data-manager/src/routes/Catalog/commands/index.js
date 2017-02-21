import { injectCommandHandler } from 'commands';
import imageCommandHandler from './image';
import statsCommandHandler from './stats';

export default () => {
  injectCommandHandler('image', imageCommandHandler);
  injectCommandHandler('stats', statsCommandHandler);
};
