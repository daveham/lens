import React from 'react';
import { Query } from 'react-apollo';
import { GET_EXECUTIONS } from '@editor/queries';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:execution:gqlWrapper');

export default View => props => {
  const renderProp = ({
    data: { getExecutions: { items: executions, simulationName } = {} },
    error,
    loading
  }) =>
    <View
      {...props}
      loading={loading}
      error={error}
      executions={executions}
      simulationName={simulationName}
    />;

  return (
    <Query
      displayName='ExecutionsQuery'
      query={GET_EXECUTIONS}
      variables={{ simulationId: props.simulationId }}
    >
      {renderProp}
    </Query>
  );
};
