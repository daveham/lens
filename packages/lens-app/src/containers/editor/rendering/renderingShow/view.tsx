import React from 'react';
import { IRendering } from 'editor/interfaces';

import Form from '../common/form';

// import _debug from 'debug';
// const debug = _debug('lens:editor:rendering:renderingShow:view');

interface IProps {
  sourceId: string;
  simulationId: number;
  executionId: number;
  renderingId: number;
  rendering: IRendering;
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
      renderingId,
      rendering: {
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
        tag={`${sourceId}:${simulationId}:${executionId}:${renderingId}`}
      />
    );
  }
}

export default View;
