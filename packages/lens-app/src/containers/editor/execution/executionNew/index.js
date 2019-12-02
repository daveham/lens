import React from 'react';
import View from '../executionShow/view';

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
    newMode={true}
    sourceId={sourceId}
    simulationId={simulationId}
  />;
};
