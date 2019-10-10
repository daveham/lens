import uuid from 'uuid/v1';

export interface IRendering {
  id: string;
  created: number;
  modified: number;
  executionId: number;
  simulationId: number;
  name: string;
}

export interface IRenderingErrors {
  nameError?: string;
}

export interface IExecution {
  id: string;
  created: number;
  modified: number;
  simulationId: number;
  name: string;
  renderingsCount: number;
  renderings?: ReadonlyArray<IRendering>;
}

export interface IExecutionErrors {
  nameError?: string;
}

export interface ISimulation {
  id: string;
  sourceId: string;
  created: number;
  modified: number;
  name: string;
  executionsCount: number;
  executions?: ReadonlyArray<IExecution>;
}

export interface ISimulationErrors {
  nameError?: string;
}

export interface IHiker {
  id: string;
  order?: number;
  name?: string;
  type?: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

export function defaultNewHiker(props): IHiker {
  return {
    id: uuid(),
    name: 'New Hiker',
    type: 'simple',
    ...props,
  };
}

export interface IHikerErrors {
  nameError?: string;
}

export interface ITrailModel {
  id: string;
  order?: number;
  name?: string;
  type?: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

export function defaultNewTrail(props): ITrailModel {
  return {
    id: uuid(),
    name: 'New Trail',
    type: 'simple',
    ...props,
  };
}

export interface ITrailErrors {
  nameError?: string;
}

export interface ITrail extends ITrailModel {
  hikers: ReadonlyArray<IHiker>;
}

export interface IHikeModel {
  id: string;
  order?: number;
  name?: string;
  type?: string;
  size?: string;
  logger?: string;
  trackWriter?: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

export function defaultNewHike(props): IHikeModel {
  return {
    id: uuid(),
    name: 'New Hike',
    type: 'simple',
    size: 'full',
    logger: 'none',
    trackWriter: 'none',
    ...props,
  };
}

export interface IHikeErrors {
  nameError?: string;
}

export interface IHike extends IHikeModel {
  trails: ReadonlyArray<ITrail>;
}
