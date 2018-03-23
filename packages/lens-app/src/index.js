import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import store, { history } from './store';
import App from './containers/app';
import { default as getConfig } from './config';
import 'isomorphic-fetch';
import 'normalize.css';
import styles from './styles.scss';

import registerServiceWorker from './registerServiceWorker';

import _debug from 'debug';
const debug = _debug('lens:index');

const dataHost = getConfig().dataHost;
const client = new ApolloClient({ uri: `${dataHost}/graphql` });
client.query({
query: gql`
{
  simulations {
    id,
    name,
    executions {
      id,
      name,
      renderings {
        id,
        name
      }
    }
  }
}
`
}).then(({ data }) => debug({ data }));

const target = document.getElementById('root');

render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div className={styles.container}>
          <App/>
        </div>
      </ConnectedRouter>
    </Provider>
  </ApolloProvider>,
  target
);

registerServiceWorker();
