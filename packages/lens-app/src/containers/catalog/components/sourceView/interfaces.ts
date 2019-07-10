// @ts-ignore
export { IStatsDescriptor, IImageDescriptor } from 'src/interfaces';

export interface ITileSpec {
  res: number;
  height: number;
  width: number;
  tilesWide: number;
  tilesHigh: number;
  lastWidth: number;
  lastHeight: number;
}

export interface ITileSize {
  width: number;
  height: number;
}

export interface IViewport {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ISelectedTile {
  x: number;
  y: number;
  imageKey: string;
}
