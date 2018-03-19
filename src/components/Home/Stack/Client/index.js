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
            <a href='https://reactjs.org/'>React</a> for UI components
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='https://redux.js.org/'>Redux</a> for state management
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='https://reacttraining.com/react-router/'>React Router</a> and <a
              href='https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux'>React Router Redux</a>
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='https://redux-saga.js.org/'>Redux Sagas</a> for async / side effects
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
            <a href='https://babeljs.io/'>Babel</a> for next-gen JavaScript
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='http://www.typescriptlang.org/'>Typescript</a> for type safety
          </span>
        </li>
        <li>
          <span className={styles.tech}>
            <a href='https://eslint.org/'>ESLint</a> and <a
            href='https://palantir.github.io/tslint/'>TSLint</a> for code quality and consistency
          </span>
        </li>
      </ul>
      <p>
        CSS complexity is tamed with styles scoped to modules.
      </p>
      <ul className={styles.techList}>
        <li>
          <span className={styles.tech}>
            <a href='https://github.com/css-modules'>CSS Modules</a>
          </span>
        </li>
      </ul>
    </div>
  );
};
