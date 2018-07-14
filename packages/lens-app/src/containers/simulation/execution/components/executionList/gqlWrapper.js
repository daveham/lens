import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:execution:gqlWrapper');

const GET_EXECUTIONS = gql`
  query getExecutions($simulationId: Int!) {
    executions(simulationId: $simulationId) {
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

export default View => props => (
  <Query query={GET_EXECUTIONS} variables={{ simulationId: props.simulationId }}>
    {({ data, error, loading }) => {
      let executions;
      let simulationName;
      if (data.executions) {
        executions = data.executions.items;
        simulationName = data.executions.simulationName;
      }
      return (
        <View
          executions={executions}
          simulationName={simulationName}
          error={error}
          loading={loading}
          {...props}
        />
      );
    }}
  </Query>
);
