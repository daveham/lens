import React from 'react';
import { Query } from 'react-apollo';
import { GET_SIMULATIONS } from '@editor/queries';

// import _debug from 'debug';
// const debug = _debug('lens:simulationList:gqlWrapper');

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
