import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pin from '../../Pin';
import Tabs from '../../Tabs';
import Overview from './Overview';
import Analysis from './Analysis';
import Placeholder from '../placeholder';

const root = '/info/intro';
const tabs = [
  'overview',
  'analysis',
  'simulation',
  'rendering'
];
const paths = tabs.map((tab) => `${root}/${tab}`);

export default () => {
  return (
    <div>
      <Pin animate={true}>
        <Tabs
          titles={tabs}
          paths={paths}
          horizontal={false}
        />
      </Pin>
      <Switch>
        <Route path={paths[1]} component={Analysis}/>
        <Route path={paths[2]} component={Placeholder}/>
        <Route path={paths[3]} component={Placeholder}/>
        <Redirect exact from={root} to={paths[0]}/>
        <Route component={Overview}/>
      </Switch>
    </div>
  );
};
