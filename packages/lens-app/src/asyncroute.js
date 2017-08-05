import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectReducers, injectSagas, injectCommands } from './store/registry/actions';

const moduleDefaultExport = module => module.default || module;

const esModule = (module, forceArray) => {
  if (Array.isArray(module)) {
    return module.map(moduleDefaultExport);
  }

  const defaulted = moduleDefaultExport(module);
  return forceArray ? [defaulted] : defaulted;
};

export default function asyncRoute({ getComponent, getReducers, getSagas, getCommands }) {
  return class AsyncRoute extends Component {
    static contextTypes = {
      store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired
      })
    };

    static Component = null;
    static ReducersLoaded = false;
    static SagasLoaded = false;
    static CommandsLoaded = false;

    constructor() {
      super();
      this.state = {
        Component: AsyncRoute.Component,
        ReducersLoaded: AsyncRoute.ReducersLoaded,
        SagasLoaded: AsyncRoute.SagasLoaded,
        CommandsLoaded: AsyncRoute.CommandsLoaded
      };

      const {
        Component,
        ReducersLoaded,
        SagasLoaded,
        CommandsLoaded
      } = this.state;

      const loaderPromises = [];
      loaderPromises.push(
        !Component ?
          getComponent()
          .then(module => {
            const component = esModule(module);
            AsyncRoute.Component = component;
            return component;
          }) :
          Component
      );

      if (getReducers && !ReducersLoaded) {
        loaderPromises.push(
          getReducers()
          .then(module => {
            const reducers = esModule(module, true);
            this.context.store.dispatch(injectReducers(reducers));
            AsyncRoute.ReducersLoaded = true;
          })
        );
      }

      if (getSagas && !SagasLoaded) {
        loaderPromises.push(
          getSagas()
          .then(module => {
            const sagas = esModule(module, true);
            this.context.store.dispatch(injectSagas(sagas));
            AsyncRoute.SagasLoaded = true;
          })
        );
      }

      if (getCommands && !CommandsLoaded) {
        loaderPromises.push(
          getCommands()
          .then(module => {
            const commands = esModule(module, true);
            this.context.store.dispatch(injectCommands(commands));
            AsyncRoute.CommandsLoaded = true;
          })
        );
      }

      Promise.all(loaderPromises)
      .then(([Component]) => {
        if (this._mounted) {
          this.setState({ Component });
        } else {
          this.state = { Component };
        }
      });
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
