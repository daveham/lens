import React from 'react';
import { Query } from 'react-apollo';
import { GET_RENDERING } from 'editor/queries';

// import _debug from 'debug';
// const debug = _debug('lens:editor:rendering:renderingShow:gqlWrapper');

export default View => props => {
  const {
    match: { params: { sourceId, simulationId, executionId, renderingId } }
  } = props;

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
