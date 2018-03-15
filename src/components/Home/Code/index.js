import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pin from '../../Pin';
import Tabs from '../../Tabs';
import Placeholder from '../placeholder';
import History from './History';

const root = '/info/code';
const tabs = [
  'status',
  'history'
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
      <Switch>
        <Route path={paths[1]} component={History}/>
        <Redirect exact from={root} to={paths[0]}/>
        <Route component={Placeholder}/>
      </Switch>
    </div>
  );
};
