import React, { Component } from 'react';
import PropTypes from 'prop-types';

class View extends Component {
  static propTypes = {
    fetchCatalog: PropTypes.func.isRequired
  };

  componentDidMount() {
    setTimeout(() => {
      this.props.fetchCatalog();
    }, 2000);
  }

  render() {
    return (
      <div>
        <h1>Catalog</h1>
        <div>This is data catalog.</div>
      </div>
    );
  }
}

export default View;
