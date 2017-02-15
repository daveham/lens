import { injectCommandHandler } from 'commands';
import imageCommandHandler from './image';

export default () => {
  injectCommandHandler('image', imageCommandHandler);
};
