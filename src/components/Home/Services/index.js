import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pin from '../../Pin';
import Tabs from '../../Tabs';
import Placeholder from '../placeholder';

const root = '/info/services';
const tabs = [
  'api',
  'notification',
  'compute'
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
        {'Content for \'services\' section.'}
      </p>
      <Switch>
        <Route path={paths[1]} component={Placeholder}/>
        <Route path={paths[2]} component={Placeholder}/>
        <Redirect exact from={root} to={paths[0]}/>
        <Route component={Placeholder}/>
      </Switch>
    </div>
  );
};
