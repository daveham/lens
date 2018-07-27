import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import _debug from 'debug';
// const debug = _debug('lens:simulationList:gqlWrapper');

const GET_SIMULATIONS = gql`
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

export default View => props => {
  const renderProp = ({
    data: { getSimulationsForSource: simulations },
    error,
    loading
  }) =>
    <View
      {...props}
      loading={loading}
      error={error}
      simulations={simulations}
    />;

  return (
    <Query
      displayName='SimulationsQuery'
      query={GET_SIMULATIONS}
      variables={{ sourceId: props.sourceId }}
    >
      {renderProp}
    </Query>
  );
};
