import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import _debug from 'debug';
// const debug = _debug('lens:executionEdit:gqlWrapper');

const GET_EXECUTION = gql`
  query getExecution($id: Int!) {
    getExecution(id: $id) {
      id
      created
      modified
      simulationId
      name
      renderingCount
    }
  }
`;

export default View => props => (
  <Query query={GET_EXECUTION} variables={{ id: props.executionId }}>
    {
      ({ data: { getExecution: execution }, error, loading }) => (
        <View
          execution={execution}
          error={error}
          loading={loading}
          {...props}
        />
      )
    }
  </Query>
);
