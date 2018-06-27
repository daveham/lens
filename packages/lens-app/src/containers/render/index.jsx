import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import View from './components/view';

const GET_RENDERINGS = gql`
{
  renderings {
    id,
    name
  }
}
`;

export default  () => (
  <Query query={GET_RENDERINGS}>
    {View}
  </Query>
);
