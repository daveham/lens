import React, { Component, PropTypes } from 'react';
import SplitButton from 'react-bootstrap/lib/SplitButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import debugLib from 'debug';
const debug = debugLib('app:Socket');

import styles from './Socket.scss';

export class Socket extends Component {
  static propTypes = {
    connecting: PropTypes.bool,
    socket: PropTypes.object,
    serviceError: PropTypes.string,
    lastSent: PropTypes.string,
    lastReceived: PropTypes.string,
    connect: PropTypes.func.isRequired,
    ping: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.connect();
  }

  handleOnClickPing(key) {
    debug('handleOnClickPing', key);
    this.props.ping(key);
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
    const { socket, lastSent, lastReceived } = this.props;
    const textStyle = 'text-success';

    return (
      <div className={styles.container}>
        <div>
          <SplitButton title='ping' id='ping-dropdown' dropup bsSize='xs'>
            <MenuItem onSelect={this.handleOnClickPing.bind(this)} eventKey='socket'>socket</MenuItem>
            <MenuItem onSelect={this.handleOnClickPing.bind(this)} eventKey='task'>task</MenuItem>
          </SplitButton>
        </div>
        <div className={styles.growMoreCentered}>
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
        <div className={styles.socketId}>
          <span className='text-muted'>id: </span>
          {
            socket &&
              <span className={textStyle}>{socket.id}</span>
          }
        </div>
      </div>
    );
  }
}

export default Socket;
