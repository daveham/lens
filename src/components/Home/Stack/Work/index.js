import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Pin from '../../../Pin';
import styles from '../styles.scss';

export default () => {
  return (
    <div>
      <Pin>
        <FontAwesomeIcon className={styles.icon} icon='cogs' size='4x'/>
      </Pin>
      <p>
        All three phases of Lens &mdash; analysis, simulation and rendering &mdash; involve heavy computation. The work is
        performed by a <a className={styles.external} href='https://github.com/daveham/lens/tree/master/packages/lens-service'> dedicated
        background service</a> wherein work is submitted through queued jobs. Clients are notified of job completion over an
        asynchronous socket connection.
      </p>
      <ul className={styles.techList}>
        <li>
          <span className={styles.tech}>
            <a href='https://github.com/taskrabbit/node-resque'>node-resque</a> and <a
            href='http://restify.com/'>ioredis</a> &mdash; background job framework based on redis queues
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='https://socket.io/'>socket.io</a> and <a
            href='http://restify.com/'>restify</a> &mdash; asynchronous notifications hosted over an HTTP server
          </span>
        </li>
      </ul>
      <p>
        Image manipulation primitives are performed through GraphicsMagick. Additional helper libraries
        are used for some statistics and color model manipulations.
      </p>
      <ul className={styles.techList}>
        <li>
          <span className={styles.tech}>
            <a href='http://www.graphicsmagick.org/'>GraphicsMagick</a> and <a
            href='http://aheckmann.github.io/gm/'>gm</a> &mdash; a swiss army knife of graphics manipulation and a node wrapper
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='http://gka.github.io/chroma.js/'>chroma.js</a> &mdash; a library for dealing with colors
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='http://jstat.github.io/'>jStat</a> &mdash; a JavaScript statistical library
          </span>
        </li>
      </ul>
    </div>
  );
};
