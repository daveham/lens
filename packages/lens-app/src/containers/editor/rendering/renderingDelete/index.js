import React from 'react';
import View from './view';

export default props => {
  const {
    match: {
      params: { simulationId, executionId, renderingId },
    },
  } = props;

  return <View simulationId={simulationId} executionId={executionId} renderingId={renderingId} />;
};
