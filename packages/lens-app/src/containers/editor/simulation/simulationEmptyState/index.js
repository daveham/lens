import React from 'react';
import View from './view';

const renderProp = (props) => {
  const {
    match: { params: { sourceId } }
  } = props;

  return <View
    sourceId={sourceId}
  />;
};

export default renderProp;
