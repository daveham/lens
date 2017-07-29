import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import App from './containers/app';
import styles from './styles.scss';

import registerServiceWorker from './registerServiceWorker';

const target = document.getElementById('root');

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div className={styles.container}>
        <App/>
      </div>
    </ConnectedRouter>
  </Provider>,
  target
);

registerServiceWorker();
