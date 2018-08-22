import React from 'react';
import { Query } from 'react-apollo';
import { GET_EXECUTION } from 'editor/queries';

// import _debug from 'debug';
// const debug = _debug('lens:executionEdit:gqlWrapper');

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
