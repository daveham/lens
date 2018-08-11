import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:rendering:gqlWrapper');

const GET_RENDERINGS = gql`
  query getRenderings($executionId: Int!) {
    getRenderings(executionId: $executionId) {
      items {
        id
        created
        modified
        name
      }
      simulationName
      executionName
    }
  }
`;

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
