import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:execution:gqlWrapper');

const GET_EXECUTIONS = gql`
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

export default View => props => {
  const renderProp = ({
    data: { getExecutions: { items: executions, simulationName } = {} },
    error,
    loading
  }) =>
    <View
      {...props}
      loading={loading}
      error={error}
      executions={executions}
      simulationName={simulationName}
    />;

  return (
    <Query
      displayName='ExecutionsQuery'
      query={GET_EXECUTIONS}
      variables={{ simulationId: props.simulationId }}
    >
      {renderProp}
    </Query>
  );
};
