import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import asyncRoute from './asyncroute';
import Home from '../home';
//import FeatureA from '../featureA';
//import FeatureB from '../featureB';
import logo from '../../logo.svg';
import '../../App.css';

//const homeRoute = asyncRoute(() => import('../home'));
const featureARoute = asyncRoute(() => import('../featureA'), () => import('../featureA/reducer'));
const featureBRoute = asyncRoute(() => import('../featureB'), () => import('../featureB/reducer'));

export default () => {
  return (
    <div className='App'>
      <div className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <h2>Welcome to React</h2>
        <header>
          <Link to='/'>Home</Link>
          <Link to='/FeatureA'>Feature A</Link>
          <Link to='/FeatureB'>Feature B</Link>
        </header>
      </div>
      <main>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/FeatureA' component={featureARoute} />
          <Route exact path='/FeatureB' component={featureBRoute} />
        </Switch>
      </main>
    </div>
  );
};
