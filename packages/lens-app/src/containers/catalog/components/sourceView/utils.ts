import { ITileSize, ITileSpec, IViewport } from './interfaces';

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

export function sizeFromViewport(viewport: IViewport): any {
  const { left, top, right, bottom } = viewport;
  return {
    width: right - left,
    height: bottom - top
  };
}

export function calculateTileDimensions({ res, tilesWide, tilesHigh, lastHeight, lastWidth }: ITileSpec,
                                        x: number, y: number): any {
  const col = Math.floor(x / res);
  const row = Math.floor(y / res);

  return {
    left: x,
    top: y,
    width: col === tilesWide - 1 ? lastWidth : res,
    height: row === tilesHigh - 1 ? lastHeight : res
  };
}
