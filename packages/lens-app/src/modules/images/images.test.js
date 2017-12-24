import reducer from './index';
import {
  imageLoading,
  imageNotLoading,
  imageLoaded,
  imagesLoading,
  imagesNotLoading,
  imagesLoaded
} from './actions';

describe('images reducers', () => {
  test('should return default state with empty keys', () => {
    const state = reducer();
    expect(state).toHaveProperty('keys', {});
    expect(state).toHaveProperty('byKeys', {});
  });

  describe('for single image', () => {
    const initialState = { keys: {}, byKeys: {} };
    const listKey = 'images';
    const id = 'image1';
    const imageDescriptor = { input: { id } };
    const url = 'image1.jpg';
    const data = { url };

    const expectedKey = `${id}`;
    const expectedListKeyProperty = `keys.${listKey}`;
    const expectedLoadingProperty = `byKeys.${listKey}.${expectedKey}.loading`;
    const expectedUrlProperty = `byKeys.${listKey}.${expectedKey}.url`;

    describe('in a new list with a new image', () => {
      const inputState = () => ({ keys: { ...initialState.keys }, byKeys: { ...initialState.byKeys } });

      function assertState(state, loading = true, withData = false) {
        expect(state).toHaveProperty(expectedListKeyProperty, [ expectedKey ]);
        expect(state).toHaveProperty(expectedLoadingProperty, loading);
        if (withData) {
          expect(state).toHaveProperty(expectedUrlProperty, url);
        }
      }

      test('should record loading', () => {
        const action = imageLoading({ listKey, imageDescriptor });
        assertState(reducer(inputState(), action), true);
      });

      test('should record not loading', () => {
        const action = imageNotLoading({ listKey, imageDescriptor });
        assertState(reducer(inputState(), action), false);
      });

      test('should record url', () => {
        const action = imageLoaded({ listKey, imageDescriptor, data });
        assertState(reducer(inputState(), action), false, true);
      });
    });

    describe('in an existing list with a new image', () => {
      const existingKey = 'image0';
      const expectedKeys = [ existingKey, expectedKey ];

      const inputState = () => {
        const state = { keys: { ...initialState.keys }, byKeys: { ...initialState.byKeys } };
        state.keys[listKey] = [ existingKey ];
        state.byKeys[listKey] = { [ existingKey ]: { loading: false } };
        return state;
      };

      function assertState(state, loading = true, withData = false) {
        expect(state).toHaveProperty(expectedListKeyProperty, expectedKeys);
        expect(state).toHaveProperty(expectedLoadingProperty, loading);
        if (withData) {
          expect(state).toHaveProperty(expectedUrlProperty, url);
        }
      }

      test('should record loading', () => {
        const action = imageLoading({ listKey, imageDescriptor });
        assertState(reducer(inputState(), action));
      });

      test('should record not loading', () => {
        const action = imageNotLoading({ listKey, imageDescriptor });
        assertState(reducer(inputState(), action), false);
      });

      test('should record url', () => {
        const action = imageLoaded({ listKey, imageDescriptor, data });
        assertState(reducer(inputState(), action), false, true);
      });
    });

    describe('in an existing list with an existing image', () => {
      const inputState = () => {
        const state = { keys: { ...initialState.keys }, byKeys: { ...initialState.byKeys } };
        state.keys[listKey] = [ expectedKey ];
        state.byKeys[listKey] = { [ expectedKey ]: { loading: false } };
        return state;
      };
      const expectedKeys = [ expectedKey ];

      function assertState(state, loading = true, withData = false) {
        expect(state).toHaveProperty(expectedListKeyProperty, expectedKeys);
        expect(state).toHaveProperty(expectedLoadingProperty, loading);
        if (withData) {
          expect(state).toHaveProperty(expectedUrlProperty, url);
        }
      }

      test('should record loading', () => {
        const action = imageLoading({ listKey, imageDescriptor });
        assertState(reducer(inputState(), action));
      });

      test('should record not loading', () => {
        const action = imageNotLoading({ listKey, imageDescriptor });
        assertState(reducer(inputState(), action), false);
      });

      test('should record url', () => {
        const action = imageLoaded({ listKey, imageDescriptor, data });
        assertState(reducer(inputState(), action), false, true);
      });
    });
  });

  describe('for a list of images', () => {
    const initialState = { keys: {}, byKeys: {} };
    const listKey = 'images';
    const imageDescriptors = [
      { input: { id: 'image1', location: { x: 10, y: 20 } } },
      { input: { id: 'image2', location: { x: 11, y: 21 } } },
    ];
    const data = [{ url: 'image1.jpg' }, { url: 'image2.jpg' }];

    describe('in a new list with a new list of images', () => {
      const inputState = () => ({ keys: { ...initialState.keys }, byKeys: { ...initialState.byKeys } });

      function assertState(state, loading = true, withData = false) {
        expect(state).toHaveProperty('keys.images', [ 'image1', 'image2' ]);

        expect(state).toHaveProperty('byKeys.images.image1.loading', loading);
        expect(state).toHaveProperty('byKeys.images.image1.x', 10);
        expect(state).toHaveProperty('byKeys.images.image1.y', 20);
        if (withData) {
          expect(state).toHaveProperty('byKeys.images.image1.url', 'image1.jpg');
        }

        expect(state).toHaveProperty('byKeys.images.image2.loading', loading);
        expect(state).toHaveProperty('byKeys.images.image2.x', 11);
        expect(state).toHaveProperty('byKeys.images.image2.y', 21);
        if (withData) {
          expect(state).toHaveProperty('byKeys.images.image2.url', 'image2.jpg');
        }
      }

      test('should record loading with empty data', () => {
        const action = imagesLoading({ listKey, imageDescriptors, data: [] });
        assertState(reducer(inputState(), action));
      });

      test('should record loading with data', () => {
        const action = imagesLoading({ listKey, imageDescriptors, data });
        assertState(reducer(inputState(), action), true, true);
      });

      test('should record not loading with empty data', () => {
        const action = imagesNotLoading({ listKey, imageDescriptors, data: [] });
        assertState(reducer(inputState(), action), false);
      });

      test('should record urls', () => {
        const loadingState = {
          keys: {
            images: [ 'image1', 'image2' ]
          },
          byKeys: {
            images: {
              image1: { loading: true, x: 10, y: 20 },
              image2: { loading: true, x: 11, y: 21 }
            }
          }
        };

        const action = imagesLoaded({ listKey, imageDescriptors, data });
        assertState(reducer(loadingState, action), false, true);
      });

    });
  });
});
