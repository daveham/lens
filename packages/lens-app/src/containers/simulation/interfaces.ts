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
  name: string;
  renderingCount: number;
}

export interface IRendering {
  id: number;
  created: number;
  modified: number;
  name: string;
}
