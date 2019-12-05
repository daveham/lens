import React from 'react';
import View from '../renderingShow/view';

export default (props) => {
  const {
    match: {
      params: {
        sourceId,
        simulationId,
        executionId,
        renderingId,
      },
    }
  } = props;

  return <View
    editMode={true}
    sourceId={sourceId}
    simulationId={simulationId}
    executionId={executionId}
    renderingId={renderingId}
  />;
};
