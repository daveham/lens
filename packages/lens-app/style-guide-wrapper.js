import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';

import theme from './src/theme';
import store from './src/store';

const StyleGuideWrapper = ({ children }) => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  </Provider>
);

StyleGuideWrapper.propTypes = { children: PropTypes.node };
StyleGuideWrapper.defaultProps = { children: null };
export default StyleGuideWrapper;
