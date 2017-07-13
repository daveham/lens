import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SplitButton from 'react-bootstrap/lib/SplitButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import debugLib from 'debug';
const debug = debugLib('app:Socket');

import styles from './Socket.scss';

export class Socket extends Component {
  static propTypes = {
    connecting: PropTypes.bool,
    serviceError: PropTypes.string,
    lastSent: PropTypes.string,
    lastReceived: PropTypes.string,
    connect: PropTypes.func.isRequired,
    ping: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.connect();
  }

  handleOnClickPing(channel) {
    debug('handleOnClickPing', { channel });
    this.props.ping(channel);
  }

  renderMessage() {
    const { serviceError, connecting } = this.props;
    const msg = serviceError || (connecting ? 'connecting' : 'connected');
    let msgStyle;
    if (serviceError) {
      msgStyle = 'text-danger';
    } else {
      msgStyle = connecting ? 'text-primary' : 'text-success';
    }
    return <span className={msgStyle}>{msg}</span>;
  }

  render () {
    const { lastSent, lastReceived } = this.props;
    const textStyle = 'text-success';

    return (
      <div className={styles.container}>
        <div>
          <SplitButton title='ping' id='ping-dropdown' dropup bsSize='xs'>
            <MenuItem onSelect={this.handleOnClickPing.bind(this)} eventKey='flash'>flash</MenuItem>
            <MenuItem onSelect={this.handleOnClickPing.bind(this)} eventKey='job'>job</MenuItem>
          </SplitButton>
        </div>
        <div className={styles.message}>
          {this.renderMessage()}
        </div>
        <div className={styles.growMore}>
          <span className='text-muted'>sent: </span>
          {
            lastSent &&
              <span className={textStyle}>{lastSent}</span>
          }
        </div>
        <div className={styles.growMore}>
          <span className='text-muted'>received: </span>
          {
            lastReceived &&
              <span className={textStyle}>{lastReceived}</span>
          }
        </div>
      </div>
    );
  }
}

export default Socket;
