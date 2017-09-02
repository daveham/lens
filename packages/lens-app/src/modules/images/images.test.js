import images from './index';
import {
  requestImageAction,
  clearRequestImageAction,
  receiveImageAction
} from './index';

describe('images reducers', () => {
  test('should return default state with empty keys', () => {
    const state = images();
    expect(state).toHaveProperty('keys', {});
    expect(state).toHaveProperty('byKeys', {});
  });

  describe('in a new list with a new image', () => {
    const initialState = { keys: {}, byKeys: {} };
    const listKey = 'list';
    const imageDescriptor = { input: { id: 'image1' } };
    const url = 'image1.jpg';

    test('should record loading', () => {
      const state = images(initialState, requestImageAction({ listKey, imageDescriptor }));
      expect(state).toHaveProperty('keys.list', [ 'image1' ]);
      expect(state).toHaveProperty('byKeys.list.image1.loading', true);
    });

    test('should record not loading', () => {
      const state = images(initialState, clearRequestImageAction({ listKey, imageDescriptor }));
      expect(state).toHaveProperty('keys.list', [ 'image1' ]);
      expect(state).toHaveProperty('byKeys.list.image1.loading', false);
    });

    test('should record url', () => {
      const state = images(initialState, receiveImageAction({ listKey, imageDescriptor, url }));
      expect(state).toHaveProperty('keys.list', [ 'image1' ]);
      expect(state).toHaveProperty('byKeys.list.image1.loading', false);
      expect(state).toHaveProperty('byKeys.list.image1.url', url);
    });
  });

  describe('in an existing list with a new image', () => {
    const initialState = {
      keys: { list: ['image1' ]},
      byKeys: { list: { image1: { loading: false } } }
    };
    const listKey = 'list';
    const imageDescriptor = { input: { id: 'image2' } };
    const url = 'image1.jpg';

    test('should record loading', () => {
      const state = images(initialState, requestImageAction({ listKey, imageDescriptor }));
      expect(state).toHaveProperty('keys.list', [ 'image1', 'image2' ]);
      expect(state).toHaveProperty('byKeys.list.image2.loading', true);
    });

    test('should record not loading', () => {
      const state = images(initialState, clearRequestImageAction({ listKey, imageDescriptor }));
      expect(state).toHaveProperty('keys.list', [ 'image1', 'image2' ]);
      expect(state).toHaveProperty('byKeys.list.image2.loading', false);
    });

    test('should record url', () => {
      const state = images(initialState, receiveImageAction({ listKey, imageDescriptor, url }));
      expect(state).toHaveProperty('keys.list', [ 'image1', 'image2' ]);
      expect(state).toHaveProperty('byKeys.list.image2.loading', false);
      expect(state).toHaveProperty('byKeys.list.image2.url', url);
    });
  });

  describe('in an existing list with an existing image', () => {
    const initialState = {
      keys: { list: ['image1' ]},
      byKeys: { list: { image1: { loading: false } } }
    };
    const listKey = 'list';
    const imageDescriptor = { input: { id: 'image1' } };
    const url = 'image1.jpg';

    test('should record loading', () => {
      const state = images(initialState, requestImageAction({ listKey, imageDescriptor }));
      expect(state).toHaveProperty('keys.list', [ 'image1' ]);
      expect(state).toHaveProperty('byKeys.list.image1.loading', true);
    });

    test('should record not loading', () => {
      const state = images(initialState, clearRequestImageAction({ listKey, imageDescriptor }));
      expect(state).toHaveProperty('keys.list', [ 'image1' ]);
      expect(state).toHaveProperty('byKeys.list.image1.loading', false);
    });

    test('should record url', () => {
      const state = images(initialState, receiveImageAction({ listKey, imageDescriptor, url }));
      expect(state).toHaveProperty('keys.list', [ 'image1' ]);
      expect(state).toHaveProperty('byKeys.list.image1.loading', false);
      expect(state).toHaveProperty('byKeys.list.image1.url', url);
    });
  });

});
