import React from 'react';
import View from './view';

export default (props) => {
  const {
    match: {
      params: {
        sourceId,
        simulationId,
      },
    }
  } = props;

  return <View
    editMode={false}
    sourceId={sourceId}
    simulationId={simulationId}
  />;
};
