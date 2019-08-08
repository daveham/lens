import gql from 'graphql-tag';

import _debug from 'debug';
const debug = _debug('lens:editor:queries');

export const GET_BREADCRUMB_NAMES = gql`
  query getBreadcrumbNames($simulationId: Int, $executionId: Int, $renderingId: Int) {
    getBreadcrumbNames(input: { simulationId: $simulationId,
      executionId: $executionId, renderingId: $renderingId })
  }
`;

export const GET_SIMULATION = gql`
  query getSimulation($id: Int!) {
    getSimulation(id: $id) {
      id
      created
      modified
      sourceId
      name
      executionsCount
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
      executions {
        id
        name
        renderings {
          id
          name
        }
      }
      executionsCount
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

export const DELETE_SIMULATION = gql`
  mutation DeleteSimulation($id: ID!) {
    deleteSimulation(input: { id: $id }) {
      id
      modified
    }
  }
`;

export function getSimulationsRefetchQueries(sourceId) {
  return [{
    query: GET_SIMULATIONS,
    variables: { sourceId }
  }];
}

export const GET_EXECUTION = gql`
  query getExecution($id: Int!) {
    getExecution(id: $id) {
      id
      created
      modified
      simulationId
      name
      renderingsCount
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
        renderingsCount
      }
      simulationName
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

export const UPDATE_EXECUTION = gql`
  mutation UpdateExecution($id: ID!, $name: String!) {
    updateExecution(input: { id: $id, name: $name }) {
      id
      name
      modified
    }
  }
`;

export const DELETE_EXECUTION = gql`
  mutation DeleteExecution($id: ID!) {
    deleteExecution(input: { id: $id }) {
      id
      modified
    }
  }
`;

export function getExecutionsRefetchQueries(sourceId, simulationId) {
  debug('getExecutionsRefetchQueries', { sourceId, simulationId });
  return [{
    query: GET_SIMULATIONS,
    variables: { sourceId }
  }, {
    query: GET_EXECUTIONS,
    variables: { simulationId }
  }];
}

export function getAddExecutionRefetchQueries(sourceId, simulationId) {
  debug('getAddExecutionRefetchQueries', { sourceId, simulationId });
  return [{
    query: GET_SIMULATIONS,
    variables: { sourceId }
  }, {
    query: GET_EXECUTIONS,
    variables: { simulationId }
  }];
}

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

export const UPDATE_RENDERING = gql`
  mutation UpdateRendering($id: ID!, $name: String!) {
    updateRendering(input: { id: $id, name: $name }) {
      id
      name
      modified
    }
  }
`;

export const DELETE_RENDERING = gql`
  mutation DeleteRendering($id: ID!) {
    deleteRendering(input: { id: $id }) {
      id
      modified
    }
  }
`;

export function getRenderingsRefetchQueries(executionId) {
  return [{
    query: GET_RENDERINGS,
    variables: { executionId }
  }];
}

export function getAddRenderingRefetchQueries(sourceId, simulationId, executionId) {
  debug('getAddRenderingRefetchQueries', { sourceId, simulationId, executionId });
  return [{
    query: GET_SIMULATIONS,
    variables: { sourceId }
  }, {
    query: GET_EXECUTIONS,
    variables: { simulationId }
  }, {
    query: GET_RENDERINGS,
    variables: { executionId }
  }];
}
