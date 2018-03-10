import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';

let basename;
if (process.env.NODE_ENV === 'production') {
  basename = '/lens';
}
const properties = {
  basename
};

ReactDOM.render(
  <BrowserRouter {...properties}>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
