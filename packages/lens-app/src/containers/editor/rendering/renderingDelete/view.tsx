import React from 'react';
import { IRendering } from 'editor/interfaces';
import { Mutation } from 'react-apollo';
import {
  DELETE_RENDERING,
  getRenderingsRefetchQueries
} from 'editor/queries';

import Form from './form';

// import _debug from 'debug';
// const debug = _debug('lens:editor:rendering:renderingDelete:view');

interface IProps {
  sourceId: string;
  simulationId: number;
  executionId: number;
  renderingId: number;
  rendering: IRendering;
  loading: boolean;
  onClose: () => void;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    if (this.props.loading) {
      return null;
    }

    const {
      onClose,
      sourceId,
      simulationId,
      executionId,
      renderingId,
      rendering: {
        name,
        created,
        modified
      }
    } = this.props;

    return (
      <Mutation mutation={DELETE_RENDERING} key={renderingId}>
        {(deleteRendering) => (
          <Form
            name={name}
            created={created}
            modified={modified}
            tag={`${sourceId}:${simulationId}:${executionId}:${renderingId}`}
            onConfirm={this.handleConfirmClick(deleteRendering)}
            onCancel={onClose}
          />
        )}
      </Mutation>
    );
  }

  private handleConfirmClick = (mutateFunc) => () => {
    const { executionId, renderingId, onClose } = this.props;
    mutateFunc({
      variables: { id: renderingId },
      refetchQueries: getRenderingsRefetchQueries(executionId)
    });
    onClose();
  };
}

export default View;
