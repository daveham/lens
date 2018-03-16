import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import fontawesome from '@fortawesome/fontawesome';
import { faGithub } from '@fortawesome/fontawesome-free-brands';
import Home from '../Home';
import PageNotFound from '../PageNotFound';
import styles from './styles.scss';

fontawesome.library.add(faGithub);

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
