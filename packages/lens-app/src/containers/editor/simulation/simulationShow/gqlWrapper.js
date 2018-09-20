import React from 'react';
import { Query } from 'react-apollo';
import { GET_SIMULATION } from 'editor/queries';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationShow:gqlWrapper');

export default View => props => {
  const {
    match: { params: { sourceId, simulationId } }
  } = props;

  const renderProp =
    ({ data: { getSimulation: simulation }, error, loading }) =>
      <View
        key={simulationId}
        simulation={simulation}
        error={error}
        loading={loading}
        sourceId={sourceId}
        simulationId={simulationId}
      />;

  return (
    <Query
      displayName='SimulationQuery'
      query={GET_SIMULATION}
      variables={{ id: simulationId }}
    >
      {renderProp}
    </Query>
  );
};
