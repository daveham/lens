import React from 'react';
import View from '../simulationShow/view';

export default (props) => {
  const {
    match: {
      params: {
        sourceId,
      },
    }
  } = props;

  return <View
    newMode={true}
    sourceId={sourceId}
  />;
};
