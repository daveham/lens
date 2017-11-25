import defineAdminJobs from './admin';
import defineImageJobs from './image';
import defineStatsJobs from './stats';

const jobs = {};
defineAdminJobs(jobs);
defineImageJobs(jobs);
defineStatsJobs(jobs);

export default jobs;
