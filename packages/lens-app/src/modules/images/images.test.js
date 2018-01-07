import { makeTileImageDescriptor, makeImageKey } from '@lens/image-descriptors';
import { tilesListKey } from './selectors';
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
  const initialState = { keys: {}, byKeys: {} };
  const id = '1001';
  const group = 32;
  const listKey = tilesListKey(id, group);

  test('should return default state with empty keys', () => {
    const state = reducer();
    expect(state).toHaveProperty('keys', {});
    expect(state).toHaveProperty('byKeys', {});
  });

  describe('for single image', () => {
    const imageDescriptor = makeTileImageDescriptor(id, group, 0, 0, 32, 32);
    const url = 'image1.jpg';
    const data = { url };

    const expectedKey = makeImageKey(imageDescriptor);
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
      const existingKey = 'existing';
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
    const imageDescriptors = [
      makeTileImageDescriptor(id, group, 10, 20, 32, 32),
      makeTileImageDescriptor(id, group, 11, 21, 32, 32)
    ];
    const data = [{ url: 'image1.jpg' }, { url: 'image2.jpg' }];

    const expectedKeys = imageDescriptors.map(makeImageKey);
    const expectedListKeyProperty = `keys.${listKey}`;
    const expectedLoadingProperties = expectedKeys.map((key) => `byKeys.${listKey}.${key}.loading`);
    const expectedUrlProperties = expectedKeys.map((key) => `byKeys.${listKey}.${key}.url`);

    describe('in a new list with a new list of images', () => {
      const inputState = () => ({ keys: { ...initialState.keys }, byKeys: { ...initialState.byKeys } });
      const loadingState = () => {
        const expectedImages = {};
        expectedKeys.forEach((key, index) => {
          const { x, y } = imageDescriptors[index].input.location;
          expectedImages[key] = { x, y, loading: true };
        });
        const state = inputState();
        state.keys[listKey] = expectedKeys;
        state.byKeys[listKey] = expectedImages;
        return state;
      };

      function assertState(state, loading = true, withData = false) {
        expect(state).toHaveProperty(expectedListKeyProperty, expectedKeys);

        imageDescriptors.forEach((descriptor, index) => {
          expect(state).toHaveProperty(expectedLoadingProperties[index], loading);
          expect(state).toHaveProperty(`byKeys.${listKey}.${expectedKeys[index]}.x`, imageDescriptors[index].input.location.x);
          expect(state).toHaveProperty(`byKeys.${listKey}.${expectedKeys[index]}.y`, imageDescriptors[index].input.location.y);
          if (withData) {
            expect(state).toHaveProperty(expectedUrlProperties[index], data[index].url);
          }
        });
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
        const action = imagesLoaded({ listKey, imageDescriptors, data });
        assertState(reducer(loadingState(), action), false, true);
      });

    });
  });
});
