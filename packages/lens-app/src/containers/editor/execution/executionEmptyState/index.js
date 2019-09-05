import React from 'react';
import View from './view';

const renderProp = (props) => {
  const {
    history,
    match: { params: { sourceId } }
  } = props;

  return <View
    history={history}
    sourceId={sourceId}
  />;
};

export default renderProp;
