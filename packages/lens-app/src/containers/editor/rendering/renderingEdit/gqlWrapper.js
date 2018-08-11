import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import _debug from 'debug';
const debug = _debug('lens:renderingEdit:gqlWrapper');

const GET_RENDERING = gql`
  query getRendering($id: Int!) {
    getRendering(id: $id) {
      id
      created
      modified
      executionId
      simulationId
      name
    }
  }
`;

export default View => props => {
  debug('renderProp', { props });
  return (
    <Query query={GET_RENDERING} variables={{ id: props.renderingId }}>
      {({ data: { getRendering: rendering }, error, loading }) => {
        return (
          <View
            rendering={rendering}
            error={error}
            loading={loading}
            {...props}
          />
        );
      }}
    </Query>
  );
};
