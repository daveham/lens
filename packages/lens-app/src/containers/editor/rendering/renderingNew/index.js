import React from 'react';
import View from '../renderingShow/view';

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
    newMode={true}
    sourceId={sourceId}
    simulationId={simulationId}
    executionId={executionId}
  />;
};
