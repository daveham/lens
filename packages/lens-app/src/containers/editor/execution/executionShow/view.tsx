import React from 'react';
import { IExecution } from 'editor/interfaces';

import Form from '../common/form';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationShow:view');

interface IProps {
  sourceId: string;
  simulationId: number;
  executionId: number;
  execution: IExecution;
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
      executionId,
      execution: {
        created,
        modified,
        name
      },
    } = this.props;

    return (
      <Form
        name={name}
        created={created}
        modified={modified}
        tag={`${sourceId}:${simulationId}:${executionId}`}
      />
    );
  }
}

export default View;
