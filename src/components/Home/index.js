import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Tabs from '../Tabs';
import Intro from './Intro';
import Stack from './Stack';
import Services from './Services';
import Environments from './Environments';
import Code from './Code';

import styles from './styles.scss';

const root = '/info';
const tabs = [
  'intro',
  'services',
  'stack',
  'environments',
  'code'
];
const paths = tabs.map((tab) => `${root}/${tab}`);

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
        <Route path={paths[1]} component={Services}/>
        <Route path={paths[2]} component={Stack}/>
        <Route path={paths[3]} component={Environments}/>
        <Route path={paths[4]} component={Code}/>
        <Redirect exact from={root} to={paths[0]}/>
        <Route component={Intro}/>
      </Switch>
    </div>
  );
}
