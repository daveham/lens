import React, { Component } from 'react';
import PropTypes from 'prop-types';

class View extends Component {
  static propTypes = {
    catalog: PropTypes.shape({
      loading: PropTypes.bool,
      name: PropTypes.string,
      sources: PropTypes.shape({
        ids: PropTypes.arrayOf(PropTypes.string),
        byIds: PropTypes.object
      })
    }),
    requestCatalog: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { catalog } = this.props;
    const alreadyFetched = catalog && !catalog.loading && catalog.name;
    if (!alreadyFetched) {
      setTimeout(() => {
        this.props.requestCatalog();
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
        <div>
          <div>{catalog.name}</div>
          <div>{catalog.sources.ids.map(id => {
            const source = catalog.sources.byIds[id];
            return (
              <div key={source.id}>{source.id} - {source.name} ({source.file})</div>
            );
          })}</div>
        </div>
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
