export interface IStatsSpec {
  res: number;
  height: number;
  width: number;
  tilesWide: number;
  tilesHigh: number;
  lastWidth: number;
  lastHeight: number;
}

export function createSourceSpec(width: number, height: number, res: number): IStatsSpec {
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
