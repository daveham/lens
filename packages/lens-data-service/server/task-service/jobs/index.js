import addPing from './ping';
import addThumbnail from './thumbnail';

const jobs = {};
addPing(jobs);
addThumbnail(jobs);

export default jobs;
