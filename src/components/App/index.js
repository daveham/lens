import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import fontawesome from '@fortawesome/fontawesome';
import { faGithub } from '@fortawesome/fontawesome-free-brands';
import { faAngleRight } from '@fortawesome/fontawesome-free-solid';
import Home from '../Home';
import PageNotFound from '../PageNotFound';
import styles from './styles.scss';

fontawesome.library.add(faGithub, faAngleRight);

export default () => {
  return (
    <div className={styles.container}>
      <Switch>
        <Redirect exact from='/' to='/info'/>
        <Route path='/info' component={Home}/>
        <Route component={PageNotFound}/>
      </Switch>
    </div>
  );
};
