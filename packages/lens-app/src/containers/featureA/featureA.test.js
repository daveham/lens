import React from 'react';
import ReactDOM from 'react-dom';
import FeatureA from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FeatureA />, div);
});
