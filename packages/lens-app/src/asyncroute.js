import React, { Component } from 'react';
import { ReactReduxContext } from 'react-redux';
import { injectReducers, injectSagas, injectCommands } from './store/registry/actions';

// import _debug from 'debug';
// const debug = _debug('lens:asyncRoute');

const moduleDefaultExport = module => module.default || module;

const esModule = (module, forceArray) => {
  if (Array.isArray(module)) {
    return module.map(moduleDefaultExport);
  }

  const defaulted = moduleDefaultExport(module);
  return forceArray ? [defaulted] : defaulted;
};

export default function asyncRoute({ getComponent, getReducers, getSagas, getCommands }) {
  class AsyncRoute extends Component {
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
            this.props.store.dispatch(injectReducers(reducers));
            AsyncRoute.ReducersLoaded = true;
          })
        );
      }

      if (getSagas && !SagasLoaded) {
        loaderPromises.push(
          getSagas()
          .then(module => {
            const sagas = esModule(module);
            this.props.store.dispatch(injectSagas(sagas));
            AsyncRoute.SagasLoaded = true;
          })
        );
      }

      if (getCommands && !CommandsLoaded) {
        loaderPromises.push(
          getCommands()
          .then(module => {
            const commands = esModule(module);
            this.props.store.dispatch(injectCommands(commands));
            AsyncRoute.CommandsLoaded = true;
          })
        );
      }

      Promise.all(loaderPromises)
      .then((results) => {
        const [Component] = results;
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
  }

  function RouteStoreShim(props) {
    return (
      <ReactReduxContext.Consumer>
        {({ store }) => <AsyncRoute {...props} store={store} />}
      </ReactReduxContext.Consumer>
    );
  }

  return RouteStoreShim;
}
