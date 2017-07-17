import {
  makeImageKey,
  PURPOSE,
  makeSourceImageDescriptor,
  makeThumbnailImageDescriptor,
  makeTileImageDescriptor
} from './index';

describe('makeImageKey', () => {
  test('from input with id', () => {
    const keyData = {
      input: {
        id: 'inputId'
      }
    };
    const imageKey = makeImageKey(keyData);

    expect(imageKey).toBe('inputId');
  });

  test('from output with id', () => {
    const keyData = {
      input: {
        id: 'inputId'
      },
      output: {
        id: 'outputId'
      }
    };
    const imageKey = makeImageKey(keyData);

    expect(imageKey).toBe('outputId');
  });

  test('from input with purpose', () => {
    const keyData = {
      input: {
        id: 'inputId',
        purpose: 'inputPurpose'
      }
    };
    const imageKey = makeImageKey(keyData);

    expect(imageKey).toBe('inputId_inputPurpose');
  });

  test('from output with purpose', () => {
    const keyData = {
      input: {
        id: 'inputId',
        purpose: 'inputPurpose'
      },
      output: {
        id: 'outputId',
        purpose: 'outputPurpose'
      }
    };
    const imageKey = makeImageKey(keyData);

    expect(imageKey).toBe('outputId_outputPurpose');
  });

  test('for tile', () => {
    const keyData = {
      input: {
        id: 'inputId',
        purpose: PURPOSE.TILE,
        group: 'group',
        location: { x: 1, y: 2 }
      }
    };
    const imageKey = makeImageKey(keyData);

    expect(imageKey).toBe(`inputId_${PURPOSE.TILE}_group_2_1`);
  });
});

describe('makeImageDescriptors', () => {
  test('for source', () => {
    const imgd = makeSourceImageDescriptor(1001);

    expect(imgd.input).toBeTruthy();
    expect(imgd.input.id).toEqual(1001);
  });

  test('for thumbnail', () => {
    const imgd = makeThumbnailImageDescriptor(1001);

    expect(imgd.input).toBeTruthy();
    expect(imgd.input.id).toEqual(1001);
    expect(imgd.output).toBeTruthy();
    expect(imgd.output.purpose).toEqual(PURPOSE.THUMBNAIL);
  });

  test('for tile', () => {
    const imgd = makeTileImageDescriptor(1001, 100, 1, 2, 10, 20);

    expect(imgd.input).toBeTruthy();
    expect(imgd.input.id).toEqual(1001);
    expect(imgd.input.group).toEqual(100);
    expect(imgd.input.location).toBeTruthy();
    expect(imgd.input.location.x).toEqual(1);
    expect(imgd.input.location.y).toEqual(2);
    expect(imgd.input.size).toBeTruthy();
    expect(imgd.input.size.width).toEqual(10);
    expect(imgd.input.size.height).toEqual(20);
    expect(imgd.output).toBeTruthy();
    expect(imgd.output.purpose).toEqual(PURPOSE.TILE);
  });
});
