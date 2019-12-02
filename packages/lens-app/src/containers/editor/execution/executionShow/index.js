import React from 'react';
import View from './view';

export default (props) => {
  const {
    match: {
      params: {
        sourceId,
        simulationId,
        executionId,
      },
    }
  } = props;

  return <View
    editMode={false}
    sourceId={sourceId}
    simulationId={simulationId}
    executionId={executionId}
  />;
};
