import React from 'react';
import { Query } from 'react-apollo';
import { GET_EXECUTION } from 'editor/queries';
import { backupUrl } from 'src/helpers';

// import _debug from 'debug';
// const debug = _debug('lens:executionEdit:gqlWrapper');

export default View => props => {
  const {
    history,
    match: { url, params: { sourceId, simulationId, executionId } },
  } = props;

  const returnToList = () => {
    history.replace(backupUrl(url, 2));
  };

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
        onClose={returnToList}
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
