import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:execution:gqlWrapper');

const GET_EXECUTIONS = gql`
  query getExecutions($simulationId: Int!) {
    executions(simulationId: $simulationId) {
      id
      created
      modified
      name
      renderingCount
    }
  }
`;

export default View => props => (
  <Query query={GET_EXECUTIONS} variables={{ simulationId: props.simulationId }}>
    {({ data: { executions }, error, loading }) => (
      <View
        executions={executions}
        error={error}
        loading={loading}
        {...props}
      />
    )}
  </Query>
);
