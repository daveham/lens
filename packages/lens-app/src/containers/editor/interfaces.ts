import uuid from 'uuid/v1';

export interface IRenderingModel {
  id: string;
  created: number;
  modified: number;
  executionId: number;
  simulationId: number;
  name: string;
}

export function defaultNewRendering(simulationId, executionId, props) {
  return {
    id: uuid(),
    simulationId,
    executionId,
    name: 'New Rendering',
    ...props,
  };
}

export interface IRendering extends IRenderingModel {}

export interface IRenderingErrors {
  nameError?: string;
}

export interface IExecutionModel {
  id: string;
  created: number;
  modified: number;
  simulationId: number;
  name: string;
  renderingsCount: number;
}

export function defaultNewExecution(simulationId, props): IExecutionModel {
  return {
    id: uuid(),
    simulationId,
    name: 'New Execution',
    renderingsCount: 0,
    ...props,
  };
}

export interface IExecution extends IExecutionModel {
  renderings?: ReadonlyArray<IRendering>;
}

export interface IExecutionErrors {
  nameError?: string;
}

export interface ISimulationModel {
  id: string;
  sourceId: string;
  created: number;
  modified: number;
  name: string;
  executionsCount: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

export function defaultNewSimulation(sourceId, props = {}): ISimulationModel {
  const created = Date.now();
  return {
    id: uuid(),
    created,
    modified: created,
    sourceId,
    name: 'New Simulation',
    executionsCount: 0,
    ...props,
  };
}

export interface ISimulation extends ISimulationModel {
  executions: ReadonlyArray<IExecution>;
}

export interface ISimulationErrors {
  nameError?: string;
}

export interface IHikerModel {
  id: string;
  order?: number;
  name?: string;
  type?: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

export function defaultNewHiker(props): IHikerModel {
  return {
    id: uuid(),
    name: 'New Hiker',
    type: 'simple',
    ...props,
  };
}

export interface IHiker extends IHikerModel {}

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
