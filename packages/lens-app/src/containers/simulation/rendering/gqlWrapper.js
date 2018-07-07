import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:rendering:gqlWrapper');

const GET_RENDERINGS = gql`
  query getRenderings($executionId: Int!) {
    renderings(executionId: $executionId) {
      id
      created
      modified
      name
    }
  }
`;

export default View => props => (
  <Query query={GET_RENDERINGS} variables={{ executionId: props.executionId }}>
    {({ data: { renderings }, error, loading }) => (
      <View
        renderings={renderings}
        error={error}
        loading={loading}
        {...props}
      />
    )}
  </Query>
);
