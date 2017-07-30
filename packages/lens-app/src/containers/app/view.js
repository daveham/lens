import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import asyncRoute from './asyncroute';
import Menu from './menu';
import Header from './header';
import Home from '../home';
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

  render() {
    return (
      <div className={styles.appContainer}>
        <Menu />
        <Header one={this.props.one} two={this.props.two} />
        <main className={styles.featureContainer}>
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
