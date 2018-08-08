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
  
  type RenderingsWithNames {
    items: [Rendering!]!
    simulationName: String!
    executionName: String!
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
  
  type ExecutionsWithNames {
    items: [Execution!]!
    simulationName: String!
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
    getSimulations: [Simulation]
    getSimulationsForSource(sourceId: String!): [Simulation]
    getSimulation(id: Int!): Simulation
    getExecutions(simulationId: Int!): ExecutionsWithNames
    getExecution(id: Int!): Execution
    getRenderings(executionId: Int!): RenderingsWithNames
    getRendering(id: Int!): Rendering
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

const getSimulationData = simulation => simulation ? ({
  ...simulation,
  executionCount: simulation.executions.length
}) : null;
const getExecutionData = execution => execution ? ({
  ...execution,
  renderingCount: execution.renderings.length
}) : null;
const getRenderingData = rendering => rendering ? ({
  ...rendering
}) : null;

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
    getSimulations: () => allSimulations.map(getSimulationData),
    getSimulationsForSource: (_, { sourceId })=> allSimulations
      .filter(s => s.sourceId === sourceId)
      .map(getSimulationData),
    getSimulation: (_, { id }) => getSimulationData(allSimulations.find(s => s.id === id)),
    getExecutions: (_, { simulationId }) => ({
      items: allExecutions.filter(e => e.simulationId === simulationId)
        .map(getExecutionData),
      simulationName: (allSimulations.find(s => s.id === simulationId)).name
    }),
    getExecution: (_, { id }) => getExecutionData(allExecutions.find(e => e.id === id)),
    getRenderings: (_, { executionId }) => {
      const execution = allExecutions.find(e => e.id === executionId);
      return {
        items: allRenderings.filter(r => r.executionId === executionId)
          .map(getRenderingData),
        simulationName: allSimulations.find(s => s.id === execution.simulationId).name,
        executionName: allExecutions.find(e => e.id === executionId).name,
      };
    },
    getRendering: (_, { id }) => getRenderingData(allRenderings.find(e => e.id === id))
  },
  Mutation: {
    createSimulation: (_, { input }) => {
      const simulation = { ...input, executions: [], id: ++simulationIdIndex };
      allSimulations.push(simulation);
      return simulation;
    },
    updateSimulation: (_, { input }) => {
      console.log('updateSimulation', input);
      const id = parseInt(input.id, 10);
      const simulation = allSimulations.find((item) => item.id === id);
      console.log('found', { simulation });
      simulation.name = input.name;
      simulation.modified = new Date();
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
      execution.modified = new Date();
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
      rendering.modified = new Date();
      return rendering;
    }
  }
};

export default (log) => makeExecutableSchema({
  log,
  typeDefs,
  resolvers
});
