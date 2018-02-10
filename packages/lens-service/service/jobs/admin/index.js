import ping from './ping';
import deleteStats from './deleteStats';

export default (jobs) => {
  ping(jobs);
  deleteStats(jobs);
};
