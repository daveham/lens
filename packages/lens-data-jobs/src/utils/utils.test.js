import { createJob } from './index';

describe('createJob', () => {
  test('provides default', () => {
    const job1 = createJob('one');

    expect(job1.command).toBe('one');
    expect(job1.jobId).toBeDefined();
    expect(job1.created).toBeDefined();
  });

  test('creates sequential jobIds', () => {
    const job1 = createJob('one');
    const job2 = createJob('two');
    expect(job2.jobId).toBe(job1.jobId + 1);
  });

  test('uses provided payload', () => {
    const job1 = createJob('one', { one: 1 });
    expect(job1.one).toBe(1);
  });
});

