import React from 'react';
import renderer from 'react-test-renderer';
import { HomeView } from 'views/HomeView';

test('HomeView', () => {
  const component = renderer.create(
    <HomeView>test</HomeView>
  );
  let tree = component.toJSON();

  it('Should render as a <div>.', function () {
    expect(_component.type).to.equal('div');
  });

});
