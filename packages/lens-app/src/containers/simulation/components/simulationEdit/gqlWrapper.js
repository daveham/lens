import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import _debug from 'debug';
// const debug = _debug('lens:simulationEdit:gqlWrapper');

const GET_SIMULATION = gql`
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

export default View => props => {
  const renderProp =
    ({ data: { getSimulation: simulation }, error, loading }) =>
      <View
        key={simulation ? simulation.id : 0}
        simulation={simulation}
        error={error}
        loading={loading}
        {...props}
      />;

  return (
    <Query
      displayName='SimulationQuery'
      query={GET_SIMULATION}
      variables={{ id: props.simulationId }}
    >
      {renderProp}
    </Query>
  );
};
