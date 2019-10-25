import React from 'react';
import View from './view';

export default props => {
  const {
    match: {
      params: { simulationId },
    },
  } = props;

  return <View simulationId={simulationId} />;
};
