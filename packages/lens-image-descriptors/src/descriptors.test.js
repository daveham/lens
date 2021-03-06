import {
  makeImageKey,
  PURPOSE,
  makeSourceImageDescriptor,
  makeThumbnailImageDescriptor,
  makeTileImageDescriptor,
  pathFromImageDescriptor,
  urlFromImageDescriptor,
  ANALYSIS,
  makeSourceStatsDescriptor,
  makeStatsKey,
} from './index';

describe('makeImageKey', () => {
  test('from input with id', () => {
    const keyData = {
      input: {
        id: 'inputId',
      },
    };
    const imageKey = makeImageKey(keyData);

    expect(imageKey).toBe('inputId');
  });

  test('from output with id', () => {
    const keyData = {
      input: {
        id: 'inputId',
      },
      output: {
        id: 'outputId',
      },
    };
    const imageKey = makeImageKey(keyData);

    expect(imageKey).toBe('outputId');
  });

  test('from input with purpose', () => {
    const keyData = {
      input: {
        id: 'inputId',
        purpose: 'inputPurpose',
      },
    };
    const imageKey = makeImageKey(keyData);

    expect(imageKey).toBe('inputId_inputPurpose');
  });

  test('from output with purpose', () => {
    const keyData = {
      input: {
        id: 'inputId',
        purpose: 'inputPurpose',
      },
      output: {
        id: 'outputId',
        purpose: 'outputPurpose',
      },
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
        location: { x: 1, y: 2 },
      },
    };
    const imageKey = makeImageKey(keyData);

    expect(imageKey).toBe(`inputId_${PURPOSE.TILE}_group_2_1`);
  });
});

describe('makeImageDescriptors', () => {
  test('for source', () => {
    const imgd = makeSourceImageDescriptor('test-image');

    expect(imgd.input).toBeTruthy();
    expect(imgd.input.id).toEqual('test-image');
  });

  test('for thumbnail', () => {
    const imgd = makeThumbnailImageDescriptor('test-image');

    expect(imgd.input).toBeTruthy();
    expect(imgd.input.id).toEqual('test-image');
    expect(imgd.output).toBeTruthy();
    expect(imgd.output.purpose).toEqual(PURPOSE.THUMBNAIL);
  });

  test('for tile', () => {
    const imgd = makeTileImageDescriptor('test-image', 100, 1, 2, 10, 20);

    expect(imgd.input).toBeTruthy();
    expect(imgd.input.id).toEqual('test-image');
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

describe('pathFromImageDescriptor', () => {
  test('for source', () => {
    const imgd = makeSourceImageDescriptor('test-image');
    const sourcePath = pathFromImageDescriptor(imgd);
    // path from source image descriptor not currently supported
    expect(sourcePath).toBeFalsy();
  });

  test('for thumbnail', () => {
    const imgd = makeThumbnailImageDescriptor('test-image');
    const thumbnailPath = pathFromImageDescriptor(imgd);
    expect(thumbnailPath).toEqual('/data/thumbs/test-image_thumb.jpg');
  });

  test('for tile', () => {
    const imgd = makeTileImageDescriptor('test-image', 'abc', 1, 2, 10, 20);
    const tilePath = pathFromImageDescriptor(imgd);
    expect(tilePath).toEqual('/data/tiles/test-image/abc/2/abc_2_1.png');
  });
});

describe('urlFromImageDescriptor', () => {
  test('for source', () => {
    const imgd = makeSourceImageDescriptor('test-image');
    const sourceUrl = urlFromImageDescriptor(imgd);
    // url from source image descriptor not currently supported
    expect(sourceUrl).toBeFalsy();
  });

  test('for thumbnail', () => {
    const imgd = makeThumbnailImageDescriptor('test-image');
    const thumbnailUrl = urlFromImageDescriptor(imgd);
    expect(thumbnailUrl).toEqual('/thumbs/test-image_thumb.jpg');
  });

  test('for tile', () => {
    const imgd = makeTileImageDescriptor('test-image', 'abc', 1, 2, 10, 20);
    const tileUrl = urlFromImageDescriptor(imgd);
    expect(tileUrl).toEqual('/tiles/test-image/abc/2/abc_2_1.png');
  });
});

describe('makeStatsKey', () => {
  test('from imageDescriptor', () => {
    const imgd = makeSourceImageDescriptor('test-image');
    const imgKey = makeImageKey(imgd);
    const statsKey = makeStatsKey({ imageDescriptor: imgd });

    expect(statsKey).toEqual(imgKey);
  });

  test('from imageDescriptor with analysis tag', () => {
    const imgd = makeSourceImageDescriptor('test-image');
    const imgKey = makeImageKey(imgd);
    const statsKey = makeStatsKey({ analysis: 'analysis-tag', imageDescriptor: imgd });

    expect(statsKey).toEqual(`analysis-tag_${imgKey}`);
  });
});

describe('makeSourceStatsDescriptor', () => {
  test('from source imageDescriptor', () => {
    const imgd = makeSourceImageDescriptor('test-image');
    const statsd = makeSourceStatsDescriptor(imgd);

    expect(statsd.analysis).toEqual(ANALYSIS.IDENTIFY);
    expect(statsd.imageDescriptor).toMatchObject(imgd);
  });
});
