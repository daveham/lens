import React from 'react';
import { Query } from 'react-apollo';
import { GET_RENDERING } from 'editor/queries';

import _debug from 'debug';
const debug = _debug('lens:renderingEdit:gqlWrapper');


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
