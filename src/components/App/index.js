import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import fontawesome from '@fortawesome/fontawesome';
import { faGithub } from '@fortawesome/fontawesome-free-brands';
import {
  faAngleRight,
  faServer,
  faCogs,
  faWrench,
  faTabletAlt
} from '@fortawesome/fontawesome-free-solid';
import Home from '../Home';
import PageNotFound from '../PageNotFound';
import styles from './styles.scss';

fontawesome.library.add(faGithub, faAngleRight);
fontawesome.library.add(faServer, faTabletAlt, faCogs, faWrench);

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
