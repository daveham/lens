import React from 'react';
import { Query } from 'react-apollo';
import { GET_RENDERING } from 'editor/queries';
import { backupUrl } from 'src/helpers';

// import _debug from 'debug';
// const debug = _debug('lens:renderingEdit:gqlWrapper');

export default View => props => {
  const {
    history,
    match: { url, params: { sourceId, simulationId, executionId, renderingId } },
  } = props;

  const returnToList = () => {
    history.replace(backupUrl(url, 2));
  };

  const renderProp =
    ({ data: { getRendering: rendering }, error, loading }) =>
      <View
        key={renderingId}
        rendering={rendering}
        error={error}
        loading={loading}
        sourceId={sourceId}
        simulationId={simulationId}
        executionId={executionId}
        renderingId={renderingId}
        onClose={returnToList}
      />;

  return (
    <Query
      displayName='RenderingQuery'
      query={GET_RENDERING}
      variables={{ id: renderingId }}
    >
      {renderProp}
    </Query>
  );
};
