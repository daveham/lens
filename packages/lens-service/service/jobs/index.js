import defineAdminJobs from './admin';
import defineImageJobs from './image';
import defineStatsJobs from './stats';
import defineEditorJobs from './editor';

const jobs = {};
defineAdminJobs(jobs);
defineImageJobs(jobs);
defineStatsJobs(jobs);
defineEditorJobs(jobs);

export default jobs;
