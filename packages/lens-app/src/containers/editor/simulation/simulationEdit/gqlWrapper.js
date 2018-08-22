import React from 'react';
import { Query } from 'react-apollo';
import { GET_SIMULATION } from 'editor/queries';

// import _debug from 'debug';
// const debug = _debug('lens:simulationEdit:gqlWrapper');

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
