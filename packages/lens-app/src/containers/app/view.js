import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Link, Switch } from 'react-router-dom';
import asyncRoute from './asyncroute';
import Home from '../home';
import logo from '../../logo.svg';
import styles from './styles.scss';

const featureARoute = asyncRoute(() => import('../featureA'), () => import('../featureA/reducer'));
const featureBRoute = asyncRoute(() => import('../featureB'), () => import('../featureB/reducer'));

class View extends Component {
  static propTypes = {
    one: PropTypes.string,
    two: PropTypes.string,
    fetchTestOne: PropTypes.func.isRequired,
    fetchTestTwo: PropTypes.func.isRequired
  };

  componentDidMount() {
    setTimeout(() => {
      this.props.fetchTestOne();
    }, 2000);

    setTimeout(() => {
      this.props.fetchTestTwo();
    }, 3000);
  }

  renderTestOne() {
    return (
      this.props.one &&
        <span>One: [{this.props.one}] </span>
    );
  }

  renderTestTwo() {
    return (
      this.props.two &&
        <span>Two: [{this.props.two}] </span>
    );
  }

  render() {
    return (
      <div className={styles.appContainer}>
        <div className={styles.appHeader}>
          <img src={logo} className={styles.appLogo} alt='logo'/>
          <h2>Welcome to React</h2>
          <header className={styles.menu}>
            <Link to='/'>Home</Link>
            <Link to='/FeatureA'>Feature A</Link>
            <Link to='/FeatureB'>Feature B</Link>
          </header>
          <div className={styles.details}>
            {this.renderTestOne()}
            {this.renderTestTwo()}
          </div>
        </div>
        <main>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/FeatureA' component={featureARoute}/>
            <Route exact path='/FeatureB' component={featureBRoute}/>
          </Switch>
        </main>
      </div>
    );
  }
}

export default View;
