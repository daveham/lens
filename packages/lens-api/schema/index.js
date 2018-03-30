import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = `
  input RenderingInput {
    executionId: Int!
    simulationId: Int!
    name: String!
  }
  
  type Rendering {
    id: Int!
    executionId: Int!
    simulationId: Int!
    name: String!
  }
  
  input ExecutionInput {
    simulationId: Int!
    name: String!
  }
  
  type Execution {
    id: Int!
    simulationId: Int!
    name: String!
    renderings: [Rendering!]!
  }
  
  input SimulationInput {
    name: String!
  }
  
  type Simulation {
    id: Int!
    name: String!
    executions: [Execution!]!
  }
  
  type Query {
    simulations: [Simulation]
    simulation(id: Int!): Simulation
    executions: [Execution]
    execution(id: Int!): Execution
    renderings: [Rendering]
    rendering(id: Int!): Rendering
  }

  type Mutation {
    createSimulation(input: SimulationInput!): Simulation
    createExecution(input: ExecutionInput!): Execution
    createRendering(input: RenderingInput!): Rendering
  }
`;
// updateSimulation(id: id!, input: SimulationInput!): Simulation
// updateExecution(id: id!, input: ExecutionInput!): Execution
// updateRendering(id: id!, input: RenderingInput!): Rendering

const renderings = [
  { id: 1, simulationId: 1, executionId: 1, name: 'sim1-ex1-ren1' },
  { id: 2, simulationId: 1, executionId: 1, name: 'sim1-ex1-ren2' },
  { id: 3, simulationId: 1, executionId: 2, name: 'sim1-ex2-ren1' },
  { id: 4, simulationId: 1, executionId: 2, name: 'sim1-ex2-ren2' },
  { id: 5, simulationId: 1, executionId: 2, name: 'sim1-ex2-ren3' },
  { id: 6, simulationId: 1, executionId: 3, name: 'sim1-ex3-ren1' },
  { id: 7, simulationId: 2, executionId: 4, name: 'sim2-ex1-ren1' },
  { id: 8, simulationId: 2, executionId: 4, name: 'sim2-ex1-ren2' },
  { id: 9, simulationId: 2, executionId: 4, name: 'sim2-ex1-ren3' },
  { id: 10, simulationId: 2, executionId: 5, name: 'sim2-ex2-ren1' },
  { id: 11, simulationId: 3, executionId: 6, name: 'sim3-ex1-ren1' },
  { id: 12, simulationId: 3, executionId: 6, name: 'sim3-ex1-ren2' },
  { id: 13, simulationId: 4, executionId: 7, name: 'sim4-ex1-ren1' },
  { id: 14, simulationId: 4, executionId: 7, name: 'sim4-ex1-ren2' },
  { id: 15, simulationId: 4, executionId: 8, name: 'sim4-ex2-ren1' },
  { id: 16, simulationId: 4, executionId: 9, name: 'sim4-ex3-ren1' },
  { id: 17, simulationId: 4, executionId: 9, name: 'sim4-ex3-ren2' },
  { id: 18, simulationId: 4, executionId: 9, name: 'sim4-ex3-ren3' }
];
let nextRenderingId = 18;

const executions = [
  { id: 1, simulationId: 1, name: 'sim1-ex1', renderings: renderings.filter(r => r.executionId === 1) },
  { id: 2, simulationId: 1, name: 'sim1-ex2', renderings: renderings.filter(r => r.executionId === 2) },
  { id: 3, simulationId: 1, name: 'sim1-ex3', renderings: renderings.filter(r => r.executionId === 3) },
  { id: 4, simulationId: 2, name: 'sim2-ex1', renderings: renderings.filter(r => r.executionId === 4) },
  { id: 5, simulationId: 2, name: 'sim2-ex2', renderings: renderings.filter(r => r.executionId === 5) },
  { id: 6, simulationId: 3, name: 'sim3-ex1', renderings: renderings.filter(r => r.executionId === 6) },
  { id: 7, simulationId: 4, name: 'sim4-ex1', renderings: renderings.filter(r => r.executionId === 7) },
  { id: 8, simulationId: 4, name: 'sim4-ex2', renderings: renderings.filter(r => r.executionId === 8) },
  { id: 9, simulationId: 4, name: 'sim4-ex3', renderings: renderings.filter(r => r.executionId === 9) }
];
let nextExecutionId = 10;

const simulations = [
  { id: 1, name: 'sim1', executions: executions.filter(e => e.simulationId === 1) },
  { id: 2, name: 'sim2', executions: executions.filter(e => e.simulationId === 2)  },
  { id: 3, name: 'sim3', executions: executions.filter(e => e.simulationId === 3)  },
  { id: 4, name: 'sim4', executions: executions.filter(e => e.simulationId === 4)  }
];
let nextSimulationId = 5;

const resolvers = {
  Query: {
    simulations: () => simulations,
    simulation: (_, { id }) => simulations.find(s => s.id === id),
    executions: () => executions,
    execution: (_, { id }) => executions.find(e => e.id === id),
    renderings: () => renderings,
    rendering: (_, { id }) => renderings.find(e => e.id === id)
  },
  Mutation: {
    createSimulation: (_, { input }) => {
      const simulation = { ...input, executions: [], id: nextSimulationId++ };
      simulations.push(simulation);
      return simulation;
    },
    // updateSimulation: (_, { id, input }) => { return { ...input, id }; },
    createExecution: (_, { input }) => {
      const execution = { ...input, renderings: [], id: nextExecutionId++ };
      executions.push(execution);
      const simulation = simulations.find((item) => item.id === input.simulationId);
      simulation.executions.push(simulation);
      return execution;
    },
    // updateExecution: (_, { id, input }) => { return { ...input, id }; },
    createRendering: (_, { input }) => {
      const rendering = { ...input, id: nextRenderingId++ };
      renderings.push(rendering);
      // TODO: find execution to add to
      const execution = executions.find((item) => item.id === input.executionId &&
        item.simulationId === input.simulationId);
      execution.renderings.push(execution);
      return rendering;
    } //,
    // updateRendering: (_, { id, input }) => { return { ...input, id }; }
  }
};

export default (log) => makeExecutableSchema({
  log,
  typeDefs,
  resolvers
});
