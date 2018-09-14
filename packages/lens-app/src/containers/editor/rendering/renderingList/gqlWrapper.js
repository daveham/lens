import React from 'react';
import { Query } from 'react-apollo';
import { GET_RENDERINGS } from 'editor/queries';
import ListView from 'editor/common/listView';

// import _debug from 'debug';
// const debug = _debug('lens:editor:rendering:gqlWrapper');

export default Table => props => {
  const { match: { url, params: { executionId } } } = props;
  const renderProp = ({
    data: { getRenderings: { items: renderings } = {} },
    error,
    loading
  }) =>
    <ListView
      loading={loading}
      error={error}
    >
      {renderings && (
        <Table
          renderingRows={renderings}
          url={url}
        />
      )}
    </ListView>;

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
