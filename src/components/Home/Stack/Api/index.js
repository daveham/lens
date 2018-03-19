import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Pin from '../../../Pin';
import styles from '../styles.scss';

export default () => {
  return (
    <div>
      <Pin>
        <FontAwesomeIcon className={styles.icon} icon='server' size='4x'/>
      </Pin>
      <p>
        The <a className={styles.external} href='https://github.com/daveham/lens/tree/master/packages/lens-api'>API</a> server
        is a Node server responsible for turning client requests into queued jobs for background processing. It also
        returns static assets and cached results from previously completed jobs.
      </p>
      <ul className={styles.techList}>
        <li>
          <span className={styles.tech}>
            <a href='http://restify.com/'>Restify</a> handles client request over HTTP
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='http://restify.com/'>ioredis</a> a client for accessing cached results stored in Redis
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='https://github.com/taskrabbit/node-resque'>node-resque</a> a
            client for submitting jobs for background processing
          </span>
        </li>
      </ul>
      <p>
        The API server is written with the latest syntax of JavaScript via the babel transpiler.
      </p>
      <ul className={styles.techList}>
        <li>
          <span className={styles.tech}>
            <a href='https://babeljs.io/docs/usage/babel-register/'>babel-register</a> a mechanism to engage babel through
            Node module resolution
          </span>
        </li>
      </ul>
    </div>
  );
};
