import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pin from '../../Pin';
import Tabs from '../../Tabs';
import Client from './Client';
import Placeholder from '../placeholder';

const root = '/info/stack';
const tabs = [
  'client',
  'api',
  'work',
  'ops'
];
const paths = tabs.map((tab) => `${root}/${tab}`);

export default () => {
  return (
    <div>
      <Pin>
        <Tabs
          titles={tabs}
          paths={paths}
          horizontal={false}
        />
      </Pin>
      <div>
        <Switch>
          <Route path={paths[1]} component={Placeholder}/>
          <Route path={paths[2]} component={Placeholder}/>
          <Route path={paths[3]} component={Placeholder}/>
          <Redirect exact from={root} to={paths[0]}/>
          <Route component={Client}/>
        </Switch>
      </div>
    </div>
  );
};
