import React from 'react';
import View from '../executionShow/view';

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
    editMode={true}
    sourceId={sourceId}
    simulationId={simulationId}
    executionId={executionId}
  />;
};
