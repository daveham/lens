import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectReducers } from '../../store/registry/actions';

const moduleDefaultExport = module => module.default || module;

const esModule = (module, forceArray) => {
  if (Array.isArray(module)) {
    return module.map(moduleDefaultExport);
  }

  const defaulted = moduleDefaultExport(module);
  return forceArray ? [defaulted] : defaulted;
};

export default function asyncRoute(getComponent, getReducers) {
  return class AsyncRoute extends Component {
    static contextTypes = {
      store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired
      })
    };

    static Component = null;
    static ReducersLoaded = false;

    constructor() {
      super();
      this.state = { Component: AsyncRoute.Component, ReducersLoaded: AsyncRoute.ReducersLoaded };

      const { Component, ReducersLoaded } = this.state;
      const shouldLoadReducers = !ReducersLoaded && getReducers;

      if (!Component || shouldLoadReducers) {

        const getComponentPromise = !Component ?
          getComponent().then(module => {
            const component = esModule(module);
            AsyncRoute.Component = component;
            return component;
          }) :
          Component;

        const getReducersPromise = !ReducersLoaded &&
          getReducers().then(module => {
            const reducers = esModule(module, true);
            this.context.store.dispatch(injectReducers(reducers));
            AsyncRoute.ReducersLoaded = true;
          });

        Promise.all([getComponentPromise, getReducersPromise])
        .then(([Component]) => {
          if (this._mounted) {
            this.setState({ Component });
          } else {
            this.state = { Component };
          }
        });
      }
    }

    componentDidMount() {
      this._mounted = true;
    }

    render() {
      const { Component } = this.state;
      return Component ? <Component {...this.props} /> : null;
    }
  };
}
