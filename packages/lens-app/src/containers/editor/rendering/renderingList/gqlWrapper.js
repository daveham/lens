import React from 'react';
import { Query } from 'react-apollo';
import { GET_RENDERINGS } from 'editor/queries';

// import _debug from 'debug';
// const debug = _debug('lens:editor:rendering:gqlWrapper');

export default View => props => {
  const { match: { url, params: { executionId } } } = props;

  const renderProp = ({
    data: { getRenderings: { items: renderings } = {} },
    error,
    loading
  }) =>
    <View
      url={url}
      loading={loading}
      error={error}
      renderings={renderings}
    />;

  return (
    <Query
      displayName='RenderingsQuery'
      query={GET_RENDERINGS}
      variables={{ executionId }}
    >
      {renderProp}
    </Query>
  );
};
