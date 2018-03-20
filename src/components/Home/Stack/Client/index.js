import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Pin from '../../../Pin';
import styles from '../styles.scss';

export default () => {
  return (
    <div>
      <Pin>
        <FontAwesomeIcon className={styles.icon} icon='tablet-alt' size='4x'/>
      </Pin>
      <p>
        The <a className={styles.external} href='https://github.com/daveham/lens/tree/master/packages/lens-app'>client</a> is
        a single page application built with React and
        related libraries. It was initiated with the <a className={styles.external}
        href='https://github.com/facebook/create-react-app'>create-react-app</a> package
        and then ejected for customization.
      </p>
      <ul className={styles.techList}>
        <li>
          <span className={styles.tech}>
            <a href='https://reactjs.org/'>React</a> &mdash; UI components
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='https://redux.js.org/'>Redux</a> &mdash; state management
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='https://reacttraining.com/react-router/'>React Router</a> and <a
              href='https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux'>React Router Redux</a> &mdash;
              in-client routing
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='https://redux-saga.js.org/'>Redux Sagas</a> &mdash; async / side effects
          </span>
        </li>
      </ul>
      <p>
        The code is written in a combination of JavaScript and Typescript. The latest
        javascript syntax is enabled by using the babel transpiler.
      </p>
      <ul className={styles.techList}>
        <li>
          <span className={styles.tech}>
            <a href='https://babeljs.io/'>Babel</a> &mdash; next-gen JavaScript
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='http://www.typescriptlang.org/'>Typescript</a> &mdash; type safety
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='https://eslint.org/'>ESLint</a> and <a
            href='https://palantir.github.io/tslint/'>TSLint</a> &mdash; code quality and consistency
          </span>
        </li>
      </ul>
      <p>
        CSS complexity is tamed with styles scoped to modules.
      </p>
      <ul className={styles.techList}>
        <li>
          <span className={styles.tech}>
            <a href='https://github.com/css-modules'>CSS Modules</a> &mdash; scoped CSS (transpiled SCSS)
          </span>
        </li>
      </ul>
    </div>
  );
};
