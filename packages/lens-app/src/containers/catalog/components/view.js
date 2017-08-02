import React, { Component } from 'react';
import PropTypes from 'prop-types';

class View extends Component {
  static propTypes = {
    catalog: PropTypes.shape({
      loading: PropTypes.bool,
      name: PropTypes.string
    }),
    fetchCatalog: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { catalog } = this.props;
    const alreadyFetched = catalog && !catalog.loading && catalog.name;
    if (!alreadyFetched) {
      setTimeout(() => {
        this.props.fetchCatalog();
      }, 500);
    }
  }

  renderLoading() {
    const { catalog } = this.props;
    return (
      catalog && catalog.loading &&
      <div>loading...</div>
    );
  }

  renderCatalog() {
    const { catalog } = this.props;
    return (
      catalog && catalog.name &&
      <div>{catalog.name}</div>
    );
  }

  render() {
    return (
      <div>
        <h1>Catalog</h1>
        <div>This is data catalog.</div>
        {this.renderLoading()}
        {this.renderCatalog()}
      </div>
    );
  }
}

export default View;
