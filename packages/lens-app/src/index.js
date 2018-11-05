import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import store from './store';
import App from './containers/app';
import { default as getConfig } from './config';
import 'isomorphic-fetch';
import registerServiceWorker from './registerServiceWorker';
import theme from './theme';

// import _debug from 'debug';
// const debug = _debug('lens:index');

const dataHost = getConfig().dataHost;
const client = new ApolloClient({ uri: `${dataHost}/graphql` });
const target = document.getElementById('root');

render(
  <Router>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <MuiThemeProvider theme={theme}>
          <App/>
        </MuiThemeProvider>
      </ApolloProvider>
    </Provider>
  </Router>,
  target
);

registerServiceWorker();
