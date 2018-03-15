import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pin from '../../Pin';
import Tabs from '../../Tabs';
import Placeholder from '../placeholder';

const tabs = [
  'client',
  'api',
  'work',
  'ops'
];
const paths = tabs.map((tab) => `/info/stack/${tab}`);

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
        <p>
          {'Content for \'stack\' section.'}
        </p>
        <Switch>
          <Route path={paths[1]} component={Placeholder}/>
          <Route path={paths[2]} component={Placeholder}/>
          <Route path={paths[3]} component={Placeholder}/>
          <Redirect exact from='/info/stack' to={paths[0]}/>
          <Route component={Placeholder}/>
        </Switch>
      </div>
    </div>
  );
};
