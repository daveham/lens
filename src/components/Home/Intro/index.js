import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pin from '../../Pin';
import Tabs from '../../Tabs';
import Overview from './Overview';
import Placeholder from '../placeholder';

const tabs = [
  'overview',
  'analysis',
  'simulation',
  'rendering'
];
const paths = tabs.map((tab) => `/info/intro/${tab}`);

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
        Lens is a tool for creating images by applying generative algorithms to photos.
      </p>
      <Switch>
        <Route path={paths[1]} component={Placeholder}/>
        <Route path={paths[2]} component={Placeholder}/>
        <Route path={paths[3]} component={Placeholder}/>
        <Redirect exact from='/info/intro' to={paths[0]}/>
        <Route component={Overview}/>
      </Switch>
    </div>
  );
};
