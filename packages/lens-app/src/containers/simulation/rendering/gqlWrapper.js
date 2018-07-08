import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:rendering:gqlWrapper');

const GET_RENDERINGS = gql`
  query getRenderings($executionId: Int!) {
    renderings(executionId: $executionId) {
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

export default View => props => (
  <Query query={GET_RENDERINGS} variables={{ executionId: props.executionId }}>
    {({ data, error, loading }) => {
      let renderings;
      let simulationName;
      let executionName;
      if (data.renderings) {
        renderings = data.renderings.items;
        simulationName = data.renderings.simulationName;
        executionName = data.renderings.executionName;
      }
      return (
      <View
        renderings={renderings}
        simulationName={simulationName}
        executionName={executionName}
        error={error}
        loading={loading}
        {...props}
      />
    ); }}
  </Query>
);
