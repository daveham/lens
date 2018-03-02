export { IStatsDescriptor, IImageDescriptor } from '../../../../interfaces';

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
