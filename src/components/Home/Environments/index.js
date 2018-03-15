import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pin from '../../Pin';
import Tabs from '../../Tabs';
import Placeholder from '../placeholder';

const tabs = [
  'dev',
  'prod'
];
const paths = tabs.map((tab) => `/info/environments/${tab}`);

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
      <p>
        {'Content for \'environments\' section.'}
      </p>
      <Switch>
        <Route path={paths[1]} component={Placeholder}/>
        <Redirect exact from='/info/environments' to={paths[0]}/>
        <Route component={Placeholder}/>
      </Switch>
    </div>
  );
};