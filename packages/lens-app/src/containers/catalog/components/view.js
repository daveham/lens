import React, { Component } from 'react';
import PropTypes from 'prop-types';

class View extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    name: PropTypes.string,
    sources: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        file: PropTypes.string.isRequired
      })
    ),
    requestCatalog: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { loading, loaded } = this.props;
    if (!(loaded || loading)) {
      setTimeout(() => {
        this.props.requestCatalog();
      }, 500);
    }
  }

  renderLoading() {
    const { loading } = this.props;
    return (
      loading &&
        <div>loading...</div>
    );
  }

  renderCatalog() {
    const { loaded, name, sources } = this.props;
    return (
      loaded &&
        <div>
          <div>{name}</div>
          <div>{sources.map(source => {
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
        <div>This is the data catalog.</div>
        {this.renderLoading()}
        {this.renderCatalog()}
      </div>
    );
  }
}

export default View;
