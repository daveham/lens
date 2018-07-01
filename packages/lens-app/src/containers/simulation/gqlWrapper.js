import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:gqlWrapper');

const GET_SIMULATIONS = gql`
{
  simulations {
    id,
    name
  }
}
`;

export default View => props => (
  <Query query={GET_SIMULATIONS}>
    {({ data, error, loading }) => (
      <View
        data={data}
        error={error}
        loading={loading}
        { ...props }
      />)}
  </Query>
);
