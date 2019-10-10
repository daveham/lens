import React from 'react';
import View from '../simulationShow/view';

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
    editMode={true}
    sourceId={sourceId}
    simulationId={simulationId}
  />;
};
