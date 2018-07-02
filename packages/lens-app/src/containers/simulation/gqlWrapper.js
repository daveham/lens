import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:gqlWrapper');

const GET_SIMULATIONS = gql`
  query getSimulations($sourceId: String!) {
    simulationsForSource(sourceId: $sourceId) {
      id
      sourceId
      name
    }
  }
`;

export default View => props => (
  <Query query={GET_SIMULATIONS} variables={{ sourceId: props.sourceId }}>
    {({ data, error, loading }) => (
      <View
        simulations={data.simulationsForSource}
        error={error}
        loading={loading}
        {...props}
      />
    )}
  </Query>
);
