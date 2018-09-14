import React from 'react';
import { Query } from 'react-apollo';
import { GET_EXECUTIONS } from 'editor/queries';
import ListView from 'editor/common/listView';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:executionList:gqlWrapper');

export default Table => props => {
  const { match: { url, params: { simulationId } } } = props;
  const renderProp = ({
    data: { getExecutions: { items: executions } = {} },
    error,
    loading
  }) =>
    <ListView
      loading={loading}
      error={error}
    >
      {executions && (
        <Table
          executionRows={executions}
          url={url}
        />
      )}
    </ListView>;

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
