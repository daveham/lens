import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pin from '../../Pin';
import Tabs from '../../Tabs';
import Placeholder from '../placeholder';

const root = '/info/environments';
const tabs = [
  'dev',
  'prod'
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
      <p>
        {'Content for \'environments\' section.'}
      </p>
      <Switch>
        <Route path={paths[1]} component={Placeholder}/>
        <Redirect exact from={root} to={paths[0]}/>
        <Route component={Placeholder}/>
      </Switch>
    </div>
  );
};
