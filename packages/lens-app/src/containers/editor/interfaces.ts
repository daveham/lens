export interface ISimulation {
  id: number;
  sourceId: string;
  created: number;
  modified: number;
  name: string;
  executionCount: number;
}

export interface IExecution {
  id: number;
  created: number;
  modified: number;
  simulationId: number;
  name: string;
  renderingCount: number;
}

export interface IRendering {
  id: number;
  created: number;
  modified: number;
  executionId: number;
  simulationId: number;
  name: string;
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
