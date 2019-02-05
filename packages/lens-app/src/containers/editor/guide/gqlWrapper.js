import React from 'react';
import { Query } from 'react-apollo';
import { GET_SIMULATIONS } from 'editor/queries';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationList:gqlWrapper');

export default View => props => {
  const {
    match: {
      url,
      params: { sourceId },
    },
  } = props;
  const renderProp = ({ data: { getSimulationsForSource: simulations }, error, loading }) => (
    <View {...props} loading={loading} error={error} simulations={simulations} url={url} />
  );

  return (
    <Query displayName='SimulationsQuery' query={GET_SIMULATIONS} variables={{ sourceId }}>
      {renderProp}
    </Query>
  );
};
