import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const typeDefs = `
  scalar Date
  
  input RenderingInput {
    executionId: Int!
    simulationId: Int!
    name: String!
  }
  
  input RenderingUpdateInput {
    id: ID!
    name: String!
  }

  type Rendering {
    id: ID!
    created: Date!
    modified: Date!
    executionId: Int!
    simulationId: Int!
    name: String!
  }
  
  input ExecutionInput {
    simulationId: Int!
    name: String!
  }
  
  input ExecutionUpdateInput {
    id: ID!
    name: String!
  }

  type Execution {
    id: ID!
    created: Date!
    modified: Date!
    simulationId: Int!
    name: String!
    renderings: [Rendering!]!
    renderingCount: Int!
  }
  
  input SimulationInput {
    sourceId: String!
    name: String!
  }
  
  input SimulationUpdateInput {
    id: ID!
    name: String!
  }
  
  type Simulation {
    id: ID!
    created: Date!
    modified: Date!
    sourceId: String!
    name: String!
    executions: [Execution!]!
    executionCount: Int!
  }
  
  type Query {
    simulations: [Simulation]
    simulationsForSource(sourceId: String!): [Simulation]
    simulation(id: Int!): Simulation
    executions(simulationId: Int!): [Execution]
    execution(id: Int!): Execution
    renderings(executionId: Int!): [Rendering]
    rendering(id: Int!): Rendering
  }

  type Mutation {
    createSimulation(input: SimulationInput!): Simulation
    updateSimulation(input: SimulationUpdateInput!): Simulation
    createExecution(input: ExecutionInput!): Execution
    updateExecution(input: ExecutionUpdateInput!): Execution
    createRendering(input: RenderingInput!): Rendering
    updateRendering(input: RenderingUpdateInput!): Rendering
  }
`;

const allRenderings = [];
const allExecutions = [];
const allSimulations = [];

let renderingIdIndex = 0;
let executionIdIndex = 0;
let simulationIdIndex = 0;

function generateMockRendering(simulationId, executionId) {
  const created = new Date();
  const rendering = {
    id: ++renderingIdIndex,
    created,
    modified: created,
    simulationId,
    executionId,
    name: `sim${simulationId}-ex${executionId}-ren${renderingIdIndex}`
  };
  allRenderings.push(rendering);
  return rendering;
}

function generateMockExecution(simulationId, renderingCount) {
  const created = new Date();
  const execution = {
    id: ++executionIdIndex,
    created,
    modified: created,
    simulationId,
    renderings: [],
    name: `sim${simulationId}-ex${executionIdIndex}`
  };

  for (let i = 0; i < renderingCount; i++) {
    execution.renderings.push(generateMockRendering(simulationId, executionIdIndex));
  }
  allExecutions.push(execution);
  return execution;
}

function generateMockSimulation(sourceId, renderingCounts) {
  const created = new Date();
  const simulation = {
    id: ++simulationIdIndex,
    created,
    modified: created,
    sourceId,
    executions: renderingCounts.map(n => generateMockExecution(simulationIdIndex, n)),
    name: `This is the name of sim${simulationIdIndex}`
  };
  allSimulations.push(simulation);
  return simulation;
}

generateMockSimulation('1001', [2, 3, 1]);
generateMockSimulation('1001', [3, 1]);
generateMockSimulation('1002', [2]);
generateMockSimulation('1003', [2, 1, 3]);

const getSimulationData = simulation => ({
  ...simulation,
  executionCount: simulation.executions.length
});
const getExecutionData = execution => ({
  ...execution,
  renderingCount: execution.renderings.length
});
const getRenderingData = rendering => ({
  ...rendering
});

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value from the server
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  }),
  Query: {
    simulations: () => allSimulations.map(getSimulationData),
    simulationsForSource: (_, { sourceId })=> allSimulations
      .filter(s => s.sourceId === sourceId)
      .map(getSimulationData),
    simulation: (_, { id }) => allSimulations.find(s => s.id === id),
    executions: (_, { simulationId }) => allExecutions
      .filter(e => e.simulationId === simulationId)
      .map(getExecutionData),
    execution: (_, { id }) => allExecutions.find(e => e.id === id),
    renderings: (_, { executionId }) => allRenderings
      .filter(r => r.executionId === executionId)
      .map(getRenderingData),
    rendering: (_, { id }) => allRenderings.find(e => e.id === id)
  },
  Mutation: {
    createSimulation: (_, { input }) => {
      const simulation = { ...input, executions: [], id: ++simulationIdIndex };
      allSimulations.push(simulation);
      return simulation;
    },
    updateSimulation: (_, { input }) => {
      const simulation = allSimulations.find((item) => item.id === input.id);
      simulation.name = input.name;
      return simulation;
    },
    createExecution: (_, { input }) => {
      const execution = { ...input, renderings: [], id: ++executionIdIndex };
      allExecutions.push(execution);
      const simulation = allSimulations.find((item) => item.id === input.simulationId);
      simulation.executions.push(simulation);
      return execution;
    },
    updateExecution: (_, { input }) => {
      const execution = allExecutions.find((item) => item.id === input.id);
      execution.name = input.name;
      return execution;
      },
    createRendering: (_, { input }) => {
      const rendering = { ...input, id: ++renderingIdIndex };
      allRenderings.push(rendering);
      const execution = allExecutions.find((item) => item.id === input.executionId &&
        item.simulationId === input.simulationId);
      execution.renderings.push(execution);
      return rendering;
    },
    updateRendering: (_, { input }) => {
      const rendering = allRenderings.find((item) => item.id === input.id);
      rendering.name = input.name;
      return rendering;
    }
  }
};

export default (log) => makeExecutableSchema({
  log,
  typeDefs,
  resolvers
});
