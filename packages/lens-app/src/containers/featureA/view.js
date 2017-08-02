import React, { Component } from 'react';
import PropTypes from 'prop-types';

class View extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    greeting: PropTypes.string,
    fetchHello: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (!(this.props.loading || this.props.greeting)) {
      setTimeout(() => {
        this.props.fetchHello();
      }, 500);
    }
  }

  renderLoading() {
    return (
      this.props.loading &&
        <div>loading...</div>
    );
  }

  renderGreeting() {
    return (
      this.props.greeting &&
        <div>{this.props.greeting}</div>
    );
  }

  render() {
    return (
      <div>
        <h1>Feature A</h1>
        <div>This is feature A.</div>
        {this.renderLoading()}
        {this.renderGreeting()}
      </div>
    );
  }
}

export default View;
