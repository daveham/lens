import { ITileSize, ITileSpec } from './interfaces';

export function createTileSpec(width: number, height: number, res: number): ITileSpec {
  let tilesWide = Math.floor(width / res);
  let tilesHigh = Math.floor(height / res);
  let lastWidth = width % res;
  let lastHeight = height % res;
  if (lastWidth > 0) {
    tilesWide += 1;
  } else {
    lastWidth = res;
  }
  if (lastHeight > 0) {
    tilesHigh += 1;
  } else {
    lastHeight = res;
  }

  return {
    res,
    height,
    width,
    tilesWide,
    tilesHigh,
    lastWidth,
    lastHeight
  };
}

export function tileSizeFromSourceSpec(spec: ITileSpec, top: number, left: number): ITileSize {
  const { res, tilesWide, tilesHigh, lastWidth, lastHeight } = spec;
  return {
    width: Math.floor(left / res) === tilesWide - 1 ? lastWidth : res,
    height: Math.floor(top / res) === tilesHigh - 1 ? lastHeight : res
  };
}
