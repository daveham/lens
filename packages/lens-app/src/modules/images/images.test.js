import images from './index';
import { requestImageAction } from './index';

describe('images reducers', () => {
  test('should return default state with empty keys', () => {
    const state = images();
    expect(state).toHaveProperty('keys', {});
    expect(state).toHaveProperty('byKeys', {});
  });

  test('should record image as requested', () => {
    const initialState = { keys: {}, byKeys: {} };
    const listKey = 'list';
    const imageDescriptor = { input: { id: 'image1' } };
    const state = images(initialState, requestImageAction({ listKey, imageDescriptor }));
    expect(state).toHaveProperty('keys.list', [ 'image1' ]);
    expect(state).toHaveProperty('byKeys.list.image1.loading', true);
  });
});
