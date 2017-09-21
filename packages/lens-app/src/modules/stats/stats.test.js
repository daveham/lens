import stats from './index';
import {
  statsLoading,
  statsNotLoading,
  statsLoaded
} from './index';

describe('stats reducers', () => {
  test('should return default state with empty keys', () => {
    const state = stats();
    expect(state).toHaveProperty('keys', {});
    expect(state).toHaveProperty('byKeys', {});
  });

  const initialState = { keys: {}, byKeys: {} };
  const listKey = 'list';
  const id = 'stats1';
  const analysis = 'i';
  const imageDescriptor = { input: { id } };
  const statsDescriptor = { analysis, imageDescriptor };
  const url = 'image1.jpg';

  const expectedKey = `${analysis}_${id}`;
  const expectedListKeyProperty = `keys.${listKey}`;
  const expectedLoadingProperty = `byKeys.${listKey}.${expectedKey}.loading`;
  const expectedUrlProperty = `byKeys.${listKey}.${expectedKey}.url`;

  describe('in a new list with a new image stat', () => {
    const inputState = { keys: { ...initialState.keys }, byKeys: { ...initialState.byKeys } };

    test('should record loading', () => {
      const state = stats(inputState, statsLoading({ listKey, statsDescriptor }));
      expect(state).toHaveProperty(expectedListKeyProperty, [ expectedKey ]);
      expect(state).toHaveProperty(expectedLoadingProperty, true);
    });

    test('should record not loading', () => {
      const state = stats(inputState, statsNotLoading({ listKey, statsDescriptor }));
      expect(state).toHaveProperty(expectedListKeyProperty, [ expectedKey ]);
      expect(state).toHaveProperty(expectedLoadingProperty, false);
    });

    test('should record url', () => {
      const state = stats(inputState, statsLoaded({ listKey, statsDescriptor, url }));
      expect(state).toHaveProperty(expectedListKeyProperty, [ expectedKey ]);
      expect(state).toHaveProperty(expectedLoadingProperty, false);
      expect(state).toHaveProperty(expectedUrlProperty, url);
    });
  });

  describe('in an existing list with a new image stat', () => {
    const existingKey = `${analysis}_stats0`;
    const inputState = { keys: { ...initialState.keys }, byKeys: { ...initialState.byKeys } };
    inputState.keys[listKey] = [ existingKey ];
    inputState.byKeys[listKey] = { [ existingKey ]: { loading: false } };

    const expectedKeys = [ existingKey, expectedKey ];

    test('should record loading', () => {
      const state = stats(inputState, statsLoading({ listKey, statsDescriptor }));
      expect(state).toHaveProperty(expectedListKeyProperty, expectedKeys);
      expect(state).toHaveProperty(expectedLoadingProperty, true);
    });

    test('should record not loading', () => {
      const state = stats(inputState, statsNotLoading({ listKey, statsDescriptor }));
      expect(state).toHaveProperty(expectedListKeyProperty, expectedKeys);
      expect(state).toHaveProperty(expectedLoadingProperty, false);
    });

    test('should record url', () => {
      const state = stats(inputState, statsLoaded({ listKey, statsDescriptor, url }));
      expect(state).toHaveProperty(expectedListKeyProperty, expectedKeys);
      expect(state).toHaveProperty(expectedLoadingProperty, false);
      expect(state).toHaveProperty(expectedUrlProperty, url);
    });
  });

  describe('in an existing list with an existing image stat', () => {
    const inputState = { keys: { ...initialState.keys }, byKeys: { ...initialState.byKeys } };
    inputState.keys[listKey] = [ expectedKey ];
    inputState.byKeys[listKey] = { [ expectedKey ]: { loading: false } };

    test('should record loading', () => {
      const state = stats(inputState, statsLoading({ listKey, statsDescriptor }));
      expect(state).toHaveProperty(expectedListKeyProperty, [ expectedKey ]);
      expect(state).toHaveProperty(expectedLoadingProperty, true);
    });

    test('should record not loading', () => {
      const state = stats(inputState, statsNotLoading({ listKey, statsDescriptor }));
      expect(state).toHaveProperty(expectedListKeyProperty, [ expectedKey ]);
      expect(state).toHaveProperty(expectedLoadingProperty, false);
    });

    test('should record url', () => {
      const state = stats(inputState, statsLoaded({ listKey, statsDescriptor, url }));
      expect(state).toHaveProperty(expectedListKeyProperty, [ expectedKey ]);
      expect(state).toHaveProperty(expectedLoadingProperty, false);
      expect(state).toHaveProperty(expectedUrlProperty, url);
    });
  });
});
