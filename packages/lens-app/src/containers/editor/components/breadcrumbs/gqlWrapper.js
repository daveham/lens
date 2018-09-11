import React from 'react';
import { Query } from 'react-apollo';
import { GET_BREADCRUMB_NAMES } from 'editor/queries';

// import _debug from 'debug';
// const debug = _debug('lens:editor:components:breadcrumbs:gqlwrapper');

export default Bar => props => {
  const { simulationId, executionId, renderingId } = props;

  const renderProp = ({
    data: { getBreadcrumbNames :names },
    error,
    loading
  }) => {
    let simulationName;
    let executionName;
    let renderingName;

    if (!loading && !error && names) {
      let index = 0;
      if (simulationId) simulationName = names[index++];
      if (executionId) executionName = names[index++];
      if (renderingId) renderingName = names[index];
    }

    return (
      <Bar
        loading={loading}
        error={error}
        simulationName={simulationName}
        executionName={executionName}
        renderingName={renderingName}
      />
    );
  };

  return (
    <Query
      displayName='BreadcrumbNamesQuery'
      query={GET_BREADCRUMB_NAMES}
      variables={{ simulationId, executionId, renderingId }}
      >
      {renderProp}
    </Query>
  );
};
