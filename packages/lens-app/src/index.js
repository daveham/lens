import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';
import App from './containers/app';
import registerServiceWorker from './registerServiceWorker';
import theme from './theme';

// import _debug from 'debug';
// const debug = _debug('lens:index');

const target = document.getElementById('root');

render(
  <Router>
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <App/>
      </MuiThemeProvider>
    </Provider>
  </Router>,
  target,
);

registerServiceWorker();
