import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import store from './store';
import App from './containers/app';
import { default as getConfig } from './config';
import 'isomorphic-fetch';
import 'normalize.css';
import styles from './styles.scss';

import registerServiceWorker from './registerServiceWorker';

// import _debug from 'debug';
// const debug = _debug('lens:index');

const dataHost = getConfig().dataHost;
const client = new ApolloClient({ uri: `${dataHost}/graphql` });
const target = document.getElementById('root');

render(
  <Router>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <div className={styles.container}>
          <App/>
        </div>
      </ApolloProvider>
    </Provider>
  </Router>,
  target
);

registerServiceWorker();
