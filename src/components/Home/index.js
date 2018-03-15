import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Tabs from '../Tabs';
import Intro from './Intro';
import Stack from './Stack';
import Services from './Services';
import Environments from './Environments';

import styles from './styles.scss';

const tabs = [
  'intro',
  'services',
  'stack',
  'environments'
];
const paths = tabs.map((tab) => `/info/${tab}`);

export default function Home() {
  return (
    <div>
      <div className={styles.menuContainer}>
        <div className={styles.title}>
          Lens
        </div>
        <div className={styles.menu}>
          <Tabs
            titles={tabs}
            paths={paths}
          />
        </div>
      </div>
      <Switch>
        <Route path='/info/stack' component={Stack}/>
        <Route path='/info/services' component={Services}/>
        <Route path='/info/environments' component={Environments}/>
        <Redirect exact from='/info' to='/info/intro'/>
        <Route component={Intro}/>
      </Switch>
    </div>
  );
}
