import React from 'react';
import View from './view';

export default (props) => {
  const {
    history,
    match: { params: { sourceId } }
  } = props;

  return <View
    history={history}
    sourceId={sourceId}
  />;
};
