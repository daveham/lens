import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from '../Home';
import PageNotFound from '../PageNotFound';
import styles from './styles.scss';

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
