import gql from 'graphql-tag';

export const GET_SIMULATION = gql`
  query getSimulation($id: Int!) {
    getSimulation(id: $id) {
      id
      created
      modified
      sourceId
      name
      executionCount
    }
  }
`;

export const GET_SIMULATIONS = gql`
  query getSimulationsForSource($sourceId: String!) {
    getSimulationsForSource(sourceId: $sourceId) {
      id
      created
      modified
      sourceId
      name
      executionCount
    }
  }
`;

export const CREATE_SIMULATION = gql`
  mutation CreateSimulation($sourceId: String!, $name: String!) {
    createSimulation(input: { sourceId: $sourceId, name: $name }) {
      id
      sourceId
      name
    }
  }
`;

export const UPDATE_SIMULATION = gql`
  mutation UpdateSimulation($id: ID!, $name: String!) {
    updateSimulation(input: { id: $id, name: $name }) {
      id
      name
      modified
    }
  }
`;

export const GET_EXECUTION = gql`
  query getExecution($id: Int!) {
    getExecution(id: $id) {
      id
      created
      modified
      simulationId
      name
      renderingCount
    }
  }
`;

export const GET_EXECUTIONS = gql`
  query getExecutions($simulationId: Int!) {
    getExecutions(simulationId: $simulationId) {
      items {
        id
        created
        modified
        name
        renderingCount
      }
      simulationName
    }
  }
`;

export const UPDATE_EXECUTION = gql`
  mutation UpdateExecution($id: ID!, $name: String!) {
    updateExecution(input: { id: $id, name: $name }) {
      id
      name
      modified
    }
  }
`;

export const CREATE_EXECUTION = gql`
  mutation CreateExecution($simulationId: Int!, $name: String!) {
    createExecution(input: { simulationId: $simulationId, name: $name }) {
      id
      simulationId
      name
    }
  }
`;

export const GET_RENDERING = gql`
  query getRendering($id: Int!) {
    getRendering(id: $id) {
      id
      created
      modified
      executionId
      simulationId
      name
    }
  }
`;

export const GET_RENDERINGS = gql`
  query getRenderings($executionId: Int!) {
    getRenderings(executionId: $executionId) {
      items {
        id
        created
        modified
        name
      }
      simulationName
      executionName
    }
  }
`;

export const UPDATE_RENDERING = gql`
  mutation UpdateRendering($id: ID!, $name: String!) {
    updateRendering(input: { id: $id, name: $name }) {
      id
      name
      modified
    }
  }
`;

export const CREATE_RENDERING = gql`
  mutation CreateRendering($executionId: Int!, $simulationId: Int!, $name: String!) {
    createRendering(input: { executionId: $executionId, simulationId: $simulationId, name: $name }) {
      id
      executionId
      simulationId
      name
    }
  }
`;
