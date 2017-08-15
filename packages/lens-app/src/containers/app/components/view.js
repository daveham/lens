import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Menu from './menu';
import Header from './header';
import Footer from './footer';
import Home from '../../home';
import { catalogRoute, featureARoute, featureBRoute } from '../../../routes';
import styles from './styles.scss';

import _debug from 'debug';
const debug = _debug('lens:view');

class View extends Component {
  static propTypes = {
    one: PropTypes.string,
    two: PropTypes.string,
    connectSocket: PropTypes.func.isRequired,
    fetchTestOne: PropTypes.func.isRequired,
    fetchTestTwo: PropTypes.func.isRequired,
    sendSocketCommand: PropTypes.func.isRequired
  };

  componentDidMount() {
    setTimeout(() => {
      this.props.connectSocket();
    }, 1000);

    setTimeout(() => {
      this.props.fetchTestOne();
    }, 2000);

    setTimeout(() => {
      this.props.fetchTestTwo();
    }, 3000);
  }

  sendPing() {
    debug('sendPing');
    const command = 'ping';
    const flashId = 0;
    const body = {};
    const payload = { flashId, command, timestamp: Date.now(), body };
    this.props.sendSocketCommand(payload);
  }

  render() {
    return (
      <div className={styles.appContainer}>
        <Menu />
        <Header one={this.props.one} two={this.props.two} />
        <main className={styles.featureContainer}>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/Catalog' component={catalogRoute}/>
            <Route exact path='/FeatureA' component={featureARoute}/>
            <Route exact path='/FeatureB' component={featureBRoute}/>
          </Switch>
        </main>
        <Footer ping={this.sendPing.bind(this)}/>
      </div>
    );
  }
}

export default View;
