import React from 'react';
import ReactDOM from 'react-dom';
import MemoryRouter from 'react-router/MemoryRouter';
import View from './view';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <View
        fetchHello={() => {}}
      />
    </MemoryRouter>,
    div
  );
});
