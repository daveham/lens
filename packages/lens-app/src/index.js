import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
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
      <ThemeProvider theme={theme}>
        <App/>
      </ThemeProvider>
    </Provider>
  </Router>,
  target,
);

registerServiceWorker();
