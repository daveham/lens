import React from 'react';
import { Query } from 'react-apollo';
import { GET_EXECUTIONS } from 'editor/queries';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:executionList:gqlWrapper');

export default View => props => {
  const { match: { url, params: { simulationId } } } = props;

  const renderProp = ({
    data: { getExecutions: { items: executions } = {} },
    error,
    loading
  }) =>
    <View
      url={url}
      loading={loading}
      error={error}
      executions={executions}
    />;

  return (
    <Query
      displayName='ExecutionsQuery'
      query={GET_EXECUTIONS}
      variables={{ simulationId }}
    >
      {renderProp}
    </Query>
  );
};
