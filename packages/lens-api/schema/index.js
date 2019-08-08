import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import { data } from 'config/paths';
import {
  createManager,
  defineDatabase,
} from './db/utils';

import _debug from 'debug';
const debug = _debug('lens:api:schema');

const debugOptions = {
  db: true,
  read: true,
  write: true,
  delete: true,
  batch: true,
};

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

  input RenderingDeleteInput {
    id: ID!
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

  input ExecutionDeleteInput {
    id: ID!
  }

  type Execution {
    id: ID!
    created: Date!
    modified: Date!
    simulationId: Int!
    name: String!
    renderings: [Rendering!]!
    renderingsCount: Int!
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
  
  input SimulationDeleteInput {
    id: ID!
  }

  type Simulation {
    id: ID!
    created: Date!
    modified: Date!
    sourceId: String!
    name: String!
    executions: [Execution!]!
    executionsCount: Int!
  }
  
  input BreadcrumbQueryInput {
    simulationId: Int
    executionId: Int
    renderingId: Int
  }
  
  type Query {
    getSimulations: [Simulation]
    getSimulationsForSource(sourceId: String!): [Simulation]
    getSimulation(id: Int!): Simulation
    getExecutions(simulationId: Int!): ExecutionsWithNames
    getExecution(id: Int!): Execution
    getRenderings(executionId: Int!): RenderingsWithNames
    getRendering(id: Int!): Rendering
    getBreadcrumbNames(input: BreadcrumbQueryInput!): [String!]
  }

  type Mutation {
    createSimulation(input: SimulationInput!): Simulation
    updateSimulation(input: SimulationUpdateInput!): Simulation
    deleteSimulation(input: SimulationDeleteInput!): Simulation
    createExecution(input: ExecutionInput!): Execution
    updateExecution(input: ExecutionUpdateInput!): Execution
    deleteExecution(input: ExecutionDeleteInput!): Execution
    createRendering(input: RenderingInput!): Rendering
    updateRendering(input: RenderingUpdateInput!): Rendering
    deleteRendering(input: RenderingDeleteInput!): Rendering
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

function generateMockExecution(simulationId, renderingsCount) {
  const created = new Date();
  const execution = {
    id: ++executionIdIndex,
    created,
    modified: created,
    simulationId,
    renderings: [],
    name: `sim${simulationId}-ex${executionIdIndex}`
  };

  for (let i = 0; i < renderingsCount; i++) {
    execution.renderings.push(generateMockRendering(simulationId, executionIdIndex));
  }
  allExecutions.push(execution);
  return execution;
}

function generateMockSimulation(sourceId, renderingsCount) {
  const created = new Date();
  const simulation = {
    id: ++simulationIdIndex,
    created,
    modified: created,
    sourceId,
    executions: renderingsCount.map(n => generateMockExecution(simulationIdIndex, n)),
    name: `This is the name of sim${simulationIdIndex}`
  };
  allSimulations.push(simulation);
  return simulation;
}

generateMockSimulation('1001', [4, 3, 7]);
generateMockSimulation('1001', [3, 2, 9, 6, 4]);
generateMockSimulation('1001', [8, 2, 1, 2]);
generateMockSimulation('1001', [4, 5, 6, 1, 8]);
generateMockSimulation('1002', [2, 5, 3, 6, 4]);
generateMockSimulation('1003', [2, 1, 3, 6, 5]);
generateMockSimulation('1004', [4, 2, 5, 1]);
generateMockSimulation('1004', [7, 3, 4]);
generateMockSimulation('1004', [5, 6, 1, 8]);
generateMockSimulation('1004', [2, 7, 5, 3]);

const getSimulationData = simulation => simulation ? ({
  ...simulation,
  executionsCount: simulation.executions.length
}) : null;
const getExecutionData = execution => execution ? ({
  ...execution,
  renderingsCount: execution.renderings.length
}) : null;
const getRenderingData = rendering => rendering ? ({
  ...rendering
}) : null;
const deleteSimulation = id => {
  const index = allSimulations.findIndex((item) => item.id === id);
  if (index > -1) {
    return allSimulations.splice(index, 1)[0];
  }
  return null;
};
const deleteExecution = id => {
  const index = allExecutions.findIndex((item) => item.id === id);
  if (index > -1) {
    return allExecutions.splice(index, 1)[0];
  }
  return null;
};
const deleteRendering = id => {
  const index = allRenderings.findIndex((item) => item.id === id);
  if (index > -1) {
    return allRenderings.splice(index, 1)[0];
  }
  return null;
};


const makeResolvers = dataManager => {
  debug('makeResolvers', dataManager);

  return {
    Date: new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue(value) {
        return new Date(value); // value from the client
      },
      serialize(value) {
        debug('serialize', { value, type: typeof value });
        if (typeof value === 'number') {
          return value;
        }
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
      // getSimulations: () => allSimulations.map(getSimulationData),
      getSimulations: () => {
        debug('getSimulations');
        return dataManager.getSimulations();
      },
      getSimulationsForSource: (_, { sourceId }) => {
        debug('getSimulationsForSource', { sourceId });
        return dataManager.getSimulationsForSource(sourceId);
      },
      // getSimulationsForSource: (_, { sourceId }) => {
      //   const simulations = allSimulations
      //     .filter(s => s.sourceId === sourceId)
      //     .map(getSimulationData);
      //   console.log('getSimulationsForSource', sourceId, simulations);
      //   return simulations;
      // },
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
      getRendering: (_, { id }) => getRenderingData(allRenderings.find(r => r.id === id)),
      getBreadcrumbNames: (_, { input: { simulationId, executionId, renderingId } }) => {
        console.log('getBreadcrumbNames', { simulationId, executionId, renderingId });
        const names = [];
        if (simulationId) {
          names.push(allSimulations.find(s => s.id === simulationId).name);
        }
        if (executionId) {
          names.push(allExecutions.find(e => e.id === executionId).name);
        }
        if (renderingId) {
          names.push(allRenderings.find(r => r.id === renderingId).name);
        }
        return names;
      }
    },
    Mutation: {
      createSimulation: (_, { input }) => dataManager.addSimulation({ ...input }),
      // createSimulation: (_, { input }) => {
      //   const created = new Date();
      //   const simulation = { ...input, created, modified: created, executions: [], id: ++simulationIdIndex };
      //   allSimulations.push(simulation);
      //   console.log('createSimulation', simulation);
      //   return simulation;
      // },
      updateSimulation: (_, { input }) => {
        const id = parseInt(input.id, 10);
        const simulation = allSimulations.find((item) => item.id === id);
        simulation.name = input.name;
        simulation.modified = new Date();
        console.log('updateSimulation', simulation);
        return simulation;
      },
      deleteSimulation: (_, { input }) => {
        const id = parseInt(input.id, 10);
        const simulation = deleteSimulation(id);
        console.log('deleteSimulation', simulation);
        simulation.executions.forEach(execution => {
          console.log('deleteSimulation - delete owned execution', execution);
          deleteExecution(execution.id);
          execution.renderings.forEach(rendering => {
            console.log('deleteSimulation - delete owned rendering', rendering);
            deleteRendering(rendering.id);
          });
        });
        return simulation;
      },
      createExecution: (_, { input }) => {
        const created = new Date();
        const execution = { ...input, created, modified: created, renderings: [], id: ++executionIdIndex };
        allExecutions.push(execution);
        const simulation = allSimulations.find((item) => item.id === input.simulationId);
        simulation.executions.push(execution);
        console.log('createExecution', execution);
        return execution;
      },
      updateExecution: (_, { input }) => {
        const id = parseInt(input.id, 10);
        const execution = allExecutions.find((item) => item.id === id);
        execution.name = input.name;
        execution.modified = new Date();
        console.log('updateExecution', execution);
        return execution;
      },
      deleteExecution: (_, { input }) => {
        const id = parseInt(input.id, 10);
        const execution = deleteExecution(id);
        console.log('deleteExecution', execution);
        execution.renderings.forEach(rendering => {
          console.log('deleteExecution - delete owned rendering', rendering);
          deleteRendering(rendering.id);
        });
        const simulation = allSimulations.find((item) => item.id === execution.simulationId);
        const index = simulation.executions.findIndex((item) => item.id === id);
        simulation.executions.splice(index, 1);
        console.log('deleteExecution - removing execution from owner simulation', simulation);
        return execution;
      },
      createRendering: (_, { input }) => {
        const created = new Date();
        const rendering = { ...input, created, modified: created, id: ++renderingIdIndex };
        allRenderings.push(rendering);
        const execution = allExecutions.find((item) => item.id === input.executionId &&
          item.simulationId === input.simulationId);
        execution.renderings.push(rendering);
        console.log('createRendering', rendering);
        return rendering;
      },
      updateRendering: (_, { input }) => {
        const id = parseInt(input.id, 10);
        const rendering = allRenderings.find((item) => item.id === id);
        rendering.name = input.name;
        rendering.modified = new Date();
        console.log('updateRendering', rendering);
        return rendering;
      },
      deleteRendering: (_, { input }) => {
        const id = parseInt(input.id, 10);
        const rendering = deleteRendering(id);
        console.log('deleteRendering', rendering);
        const execution = allExecutions.find((item) => item.id === rendering.executionId);
        const index = execution.renderings.findIndex((item) => item.id === id);
        execution.renderings.splice(index, 1);
        console.log('deleteRendering - removing rendering from owner execution', execution);
        return rendering;
      },
    }
  };
};

export function createDataManager() {
  return defineDatabase(data, debugOptions)
    .then((db) => createManager(db))
    .catch(err => debug('caught error', { err }));
}

export function createSchema({ dataManager, logger }) {
  return makeExecutableSchema({
    logger,
    typeDefs,
    resolvers: makeResolvers(dataManager),
  });
}
