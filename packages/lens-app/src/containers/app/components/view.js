import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Menu from './menu';
import Header from './header';
import Footer from './footer/index';
import Home from '../../home';
import { catalogRoute, featureARoute, featureBRoute } from '../../../routes';
import styles from './styles.scss';

class View extends Component {
  static propTypes = {
    connected: PropTypes.bool,
    connecting: PropTypes.bool,
    socketId: PropTypes.string,
    command: PropTypes.object,
    one: PropTypes.string,
    two: PropTypes.string,
    connectSocket: PropTypes.func.isRequired,
    fetchTestOne: PropTypes.func.isRequired,
    fetchTestTwo: PropTypes.func.isRequired,
    sendSocketCommand: PropTypes.func.isRequired,
    sendPing: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (!(this.props.connected || this.props.connecting)) {
      setTimeout(() => {
        this.props.connectSocket();
      }, 0);
    }

    setTimeout(() => {
      this.props.fetchTestOne();
    }, 2000); // demo

    setTimeout(() => {
      this.props.fetchTestTwo();
    }, 3000); // demo
  }

  componentDidUpdate(prevProps /*, prevState */) {
    const nowConnected = this.props.connected && prevProps.connecting && !this.props.connecting;
    const socketIdChanged = prevProps.socketId && this.props.socketId && prevProps.socketId !== this.props.socketId;
    if (nowConnected || socketIdChanged) {
      this.props.sendSocketCommand({ command: 'register' });
    }
  }

  sendFlashPing = () => {
    this.props.sendSocketCommand({ command: 'ping' });
  };

  sendCommandPing = () => {
    this.props.sendPing();
  };

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
        <Footer
          connected={this.props.connected}
          pingFlash={this.sendFlashPing}
          pingJob={this.sendCommandPing}
          command={this.props.command}
        />
      </div>
    );
  }
}

export default View;
