import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import View from './components/view';

const GET_SIMULATIONS = gql`
{
  simulations {
    id,
    name
  }
}
`;

export default  () => (
  <Query query={GET_SIMULATIONS}>
    {View}
  </Query>
);
