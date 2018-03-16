import React from 'react';
import styles from './styles.scss';

export default () => {
  return (
    <div>
      <p>
        The code for this project is in <a
        className={styles.external} href='https://github.com/daveham/lens'>
        a public repository on GitHub</a>.
      </p>
      <p>
        This is a side project. Although it is open source, it is here
        mostly for learning and demonstration. You are welcome to
        do anything you want with the code you find here. However, for the
        foreseeable future, there will be no
        support, no issue tracking, no roadmap, and no releases.
      </p>
      <p>
        I will provide a little information here on what parts of the
        project I'm currently working on:
      </p>
      <ul className={styles.statusList}>
        <li>documentation (this github-page application)</li>
        <li>analysis phase, including UI
          and generation of statistics</li>
      </ul>
      <p>
        This web site that you are reading is a GitHub project page implemented
        as a React application. This is not all that common nor is it a very
        straight-forward thing to do. You can see how I did this based on some
        guidance found elsewhere with my some of my own modifications and
        techniques. The code for this is found in <a
        className={styles.external} href='https://github.com/daveham/lens/tree/gh-pages'>
        the github-branch of the repo</a>.
      </p>
    </div>
  );
};
