import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:gqlWrapper');

const GET_SIMULATIONS = gql`
  query getSimulations($sourceId: String!) {
    simulationsForSource(sourceId: $sourceId) {
      id
      created
      modified
      sourceId
      name
      executionCount
    }
  }
`;

export default View => props => (
  <Query query={GET_SIMULATIONS} variables={{ sourceId: props.sourceId }}>
    {({ data: { simulationsForSource }, error, loading }) => (
      <View
        simulations={simulationsForSource}
        error={error}
        loading={loading}
        {...props}
      />
    )}
  </Query>
);
