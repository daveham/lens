export interface IRendering {
  id: string;
  created: number;
  modified: number;
  executionId: number;
  simulationId: number;
  name: string;
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

export interface ISimulation {
  id: string;
  sourceId: string;
  created: number;
  modified: number;
  name: string;
  executionsCount: number;
  executions?: ReadonlyArray<IExecution>;
}

export interface IHiker {
  id: number;
  name?: string;
  type?: string;
}

export interface ITrail {
  id: number;
  name?: string;
  type?: string;
  hikers: ReadonlyArray<IHiker>;
}

export interface IHike {
  id: number;
  name?: string;
  type?: string;
  size?: string;
  logger?: string;
  trackWriter?: string;
  trails: ReadonlyArray<ITrail>;
}
