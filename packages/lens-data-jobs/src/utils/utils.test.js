import { createJob } from './index';

describe('createJob', () => {
  test('provides default', () => {
    var job1 = createJob('one');

    expect(job1.command).toBe('one');
    expect(job1.jobId).toBeDefined();
    expect(job1.timestamp).toBeDefined();
  });

  test('creates sequential jobIds', () => {
    var job1 = createJob('one');
    var job2 = createJob('two');
    expect(job2.jobId).toBe(job1.jobId + 1);
  });

  test('uses provided payload', () => {
    var job1 = createJob('one', { one: 1 });
    expect(job1.one).toBe(1);
  });
});

