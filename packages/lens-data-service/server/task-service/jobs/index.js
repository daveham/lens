import addPing from './ping';
import addImage from './image';
import addStats from './stats';

const jobs = {};
addPing(jobs);
addImage(jobs);
addStats(jobs);

export default jobs;
