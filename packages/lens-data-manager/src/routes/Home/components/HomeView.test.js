import React from 'react';
import renderer from 'react-test-renderer';
import HomeView from './HomeView';

test('HomeView', () => {
  const component = renderer.create(
    <HomeView>test</HomeView>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
