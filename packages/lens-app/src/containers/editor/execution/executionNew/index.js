import React from 'react';
import { backupUrl } from 'src/helpers';
import View from './view';

const renderProp = (props) => {
  const {
    history,
    match: {
      url,
      params: { sourceId, simulationId }
    }
  } = props;

  const returnToList = () => {
    history.replace(backupUrl(url));
  };
  return <View
    onClose={returnToList}
    sourceId={sourceId}
    simulationId={simulationId}
  />;
};

export default renderProp;
