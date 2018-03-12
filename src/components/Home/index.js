import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Tabs from '../Tabs';
import Intro from './Intro';
import Stack from './Stack';
import Services from './Services';
import Environments from './Environments';

import styles from './styles.scss';

const tabs = [
  'intro',
  'stack',
  'services',
  'environments'
];
const paths = tabs.map((tab) => `/info/${tab}`);

export default function Home() {
  return (
    <div>
      <p className={styles.normal}>
        Lens is a tool for creating images by applying generative algorithms to photos.
      </p>
      <Tabs
        titles={tabs}
        paths={paths}
      />
      <Switch>
        <Route path='/info/stack' component={Stack}/>
        <Route path='/info/services' component={Services}/>
        <Route path='/info/environments' component={Environments}/>
        <Route path='/info' component={Intro}/>
      </Switch>
    </div>
  );
}
