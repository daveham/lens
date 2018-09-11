import React from 'react';
import { backupUrl } from 'src/helpers';
import View from './view';

const renderProp = (props) => {
  const {
    history,
    match: {
      url,
      params: { sourceId }
    }
  } = props;

  const returnToList = () => {
    history.replace(backupUrl(url));
  };
  return <View
    onClose={returnToList}
    sourceId={sourceId}
  />;
};

export default renderProp;
