import React from 'react';
import { Query } from 'react-apollo';
import { GET_SIMULATIONS } from 'editor/queries';
import ListView from 'editor/common/listView';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationList:gqlWrapper');

export default Table => props => {
  const { match: { url, params: { sourceId } } } = props;
  const renderProp = ({
    data: { getSimulationsForSource: simulations },
    error,
    loading
  }) =>
    <ListView
      loading={loading}
      error={error}
    >
      {simulations && (
        <Table
          simulationRows={simulations}
          url={url}
        />
      )}
    </ListView>;

  return (
    <Query
      displayName='SimulationsQuery'
      query={GET_SIMULATIONS}
      variables={{ sourceId }}
    >
      {renderProp}
    </Query>
  );
};
