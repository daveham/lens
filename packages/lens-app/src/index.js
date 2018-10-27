import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import { BrowserRouter as Router } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import store from './store';
import App from './containers/app';
import { default as getConfig } from './config';
import 'isomorphic-fetch';
import registerServiceWorker from './registerServiceWorker';

// import _debug from 'debug';
// const debug = _debug('lens:index');

const dataHost = getConfig().dataHost;
const client = new ApolloClient({ uri: `${dataHost}/graphql` });
const target = document.getElementById('root');

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      light: '#a7c0cd',
      main: '#78909c',
      dark: '#4b636e',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffbb93',
      main: '#ff8a65',
      dark: '#c75b39',
      contrastText: '#000',
    },
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
    app: {
      background: '#f0f0f0',
    },
  },
});

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
