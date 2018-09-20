import React from 'react';
import { ISimulation } from 'editor/interfaces';

import Form from '../common/form';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationShow:view');

interface IProps {
  sourceId: string;
  simulationId: number;
  simulation: ISimulation;
  loading: boolean;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    if (this.props.loading) {
      return null;
    }

    const {
      sourceId,
      simulationId,
      simulation: {
        created,
        modified,
        name
      }
    } = this.props;

    return (
      <Form
        name={name}
        created={created}
        modified={modified}
        tag={`${sourceId}:${simulationId}`}
      />
    );
  }
}

export default View;
