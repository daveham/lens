import defineAdminJobs from './admin';
import defineImageJobs from './image';

const jobs = {};
defineAdminJobs(jobs);
defineImageJobs(jobs);

export default jobs;
