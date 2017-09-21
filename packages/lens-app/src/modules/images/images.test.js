import images from './index';
import {
  imageLoading,
  imageNotLoading,
  imageLoaded
} from './index';

describe('images reducers', () => {
  test('should return default state with empty keys', () => {
    const state = images();
    expect(state).toHaveProperty('keys', {});
    expect(state).toHaveProperty('byKeys', {});
  });

  const initialState = { keys: {}, byKeys: {} };
  const listKey = 'images';
  const id = 'image1';
  const imageDescriptor = { input: { id } };
  const url = 'image1.jpg';

  const expectedKey = `${id}`;
  const expectedListKeyProperty = `keys.${listKey}`;
  const expectedLoadingProperty = `byKeys.${listKey}.${expectedKey}.loading`;
  const expectedUrlProperty = `byKeys.${listKey}.${expectedKey}.url`;

  describe('in a new list with a new image', () => {
    const inputState = { keys: { ...initialState.keys }, byKeys: { ...initialState.byKeys } };

    test('should record loading', () => {
      const state = images(inputState, imageLoading({ listKey, imageDescriptor }));
      expect(state).toHaveProperty(expectedListKeyProperty, [ id ]);
      expect(state).toHaveProperty(expectedLoadingProperty, true);
    });

    test('should record not loading', () => {
      const state = images(inputState, imageNotLoading({ listKey, imageDescriptor }));
      expect(state).toHaveProperty(expectedListKeyProperty, [ id ]);
      expect(state).toHaveProperty(expectedLoadingProperty, false);
    });

    test('should record url', () => {
      const state = images(inputState, imageLoaded({ listKey, imageDescriptor, url }));
      expect(state).toHaveProperty(expectedListKeyProperty, [ id ]);
      expect(state).toHaveProperty(expectedLoadingProperty, false);
      expect(state).toHaveProperty(expectedUrlProperty, url);
    });
  });

  describe('in an existing list with a new image', () => {
    const existingKey = 'image0';
    const inputState = { keys: { ...initialState.keys }, byKeys: { ...initialState.byKeys } };
    inputState.keys[listKey] = [ existingKey ];
    inputState.byKeys[listKey] = { [ existingKey ]: { loading: false } };

    const expectedKeys = [ existingKey, expectedKey ];

    test('should record loading', () => {
      const state = images(inputState, imageLoading({ listKey, imageDescriptor }));
      expect(state).toHaveProperty(expectedListKeyProperty, expectedKeys);
      expect(state).toHaveProperty(expectedLoadingProperty, true);
    });

    test('should record not loading', () => {
      const state = images(inputState, imageNotLoading({ listKey, imageDescriptor }));
      expect(state).toHaveProperty(expectedListKeyProperty, expectedKeys);
      expect(state).toHaveProperty(expectedLoadingProperty, false);
    });

    test('should record url', () => {
      const state = images(inputState, imageLoaded({ listKey, imageDescriptor, url }));
      expect(state).toHaveProperty(expectedListKeyProperty, expectedKeys);
      expect(state).toHaveProperty(expectedLoadingProperty, false);
      expect(state).toHaveProperty(expectedUrlProperty, url);
    });
  });

  describe('in an existing list with an existing image', () => {
    const inputState = { keys: { ...initialState.keys }, byKeys: { ...initialState.byKeys } };
    inputState.keys[listKey] = [ expectedKey ];
    inputState.byKeys[listKey] = { [ expectedKey ]: { loading: false } };

    test('should record loading', () => {
      const state = images(inputState, imageLoading({ listKey, imageDescriptor }));
      expect(state).toHaveProperty(expectedListKeyProperty, [ expectedKey ]);
      expect(state).toHaveProperty(expectedLoadingProperty, true);
    });

    test('should record not loading', () => {
      const state = images(inputState, imageNotLoading({ listKey, imageDescriptor }));
      expect(state).toHaveProperty(expectedListKeyProperty, [ expectedKey ]);
      expect(state).toHaveProperty(expectedLoadingProperty, false);
    });

    test('should record url', () => {
      const state = images(inputState, imageLoaded({ listKey, imageDescriptor, url }));
      expect(state).toHaveProperty(expectedListKeyProperty, [ expectedKey ]);
      expect(state).toHaveProperty(expectedLoadingProperty, false);
      expect(state).toHaveProperty(expectedUrlProperty, url);
    });
  });
});
