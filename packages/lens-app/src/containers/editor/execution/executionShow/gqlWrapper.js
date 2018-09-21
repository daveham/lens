import React from 'react';
import { Query } from 'react-apollo';
import { GET_EXECUTION } from 'editor/queries';

// import _debug from 'debug';
// const debug = _debug('lens:editor:execution:executionShow:gqlWrapper');

export default View => props => {
  const {
    match: { params: { sourceId, simulationId, executionId } }
  } = props;

  const renderProp =
    ({ data: { getExecution: execution }, error, loading }) =>
      <View
        key={executionId}
        execution={execution}
        error={error}
        loading={loading}
        sourceId={sourceId}
        simulationId={simulationId}
        executionId={executionId}
      />;

  return (
    <Query
      displayName='ExecutionQuery'
      query={GET_EXECUTION}
      variables={{ id: executionId }}
    >
      {renderProp}
    </Query>
  );
};
