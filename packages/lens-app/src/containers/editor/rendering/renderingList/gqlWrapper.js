import React from 'react';
import { Query } from 'react-apollo';
import { GET_RENDERINGS } from 'editor/queries';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:rendering:gqlWrapper');

export default View => props => {
  const renderProp = ({
    data: { getRenderings: { items: renderings, simulationName, executionName } = {} },
    error,
    loading
  }) =>
    <View
      {...props}
      loading={loading}
      error={error}
      renderings={renderings}
      simulationName={simulationName}
      executionName={executionName}
    />;

  return (
    <Query
      displayName='RenderingsQuery'
      query={GET_RENDERINGS}
      variables={{ executionId: props.executionId }}
    >
      {renderProp}
    </Query>
  );
};
