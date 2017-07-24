import React from 'react';
import { Route, Link } from 'react-router-dom';
import Home from '../home';
import FeatureA from '../featureA';
import FeatureB from '../featureB';
import logo from '../../logo.svg';
import '../../App.css';

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
        <Route exact path='/' component={Home} />
        <Route exact path='/FeatureA' component={FeatureA} />
        <Route exact path='/FeatureB' component={FeatureB} />
      </main>
    </div>
  );
};
