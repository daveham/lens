import React from 'react';
import { Query } from 'react-apollo';
import { GET_SIMULATION } from 'editor/queries';
import { backupUrl } from 'src/helpers';

import _debug from 'debug';
const debug = _debug('lens:editor:simulation:simulationEdit:gqlWrapper');

export default View => props => {
  const { history, match: { url, params: { sourceId, simulationId } } } = props;

  const returnToList = () => {
    debug('returnToList', { url, backupUrl: backupUrl(url, 2) });
    history.replace(backupUrl(url, 2));
  };

  const renderProp =
    ({ data: { getSimulation: simulation }, error, loading }) =>
      <View
        key={simulationId}
        simulation={simulation}
        error={error}
        loading={loading}
        sourceId={sourceId}
        simulationId={simulationId}
        onClose={returnToList}
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
