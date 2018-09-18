import React from 'react';
import { IExecution } from 'editor/interfaces';
import { Mutation } from 'react-apollo';
import {
  DELETE_EXECUTION,
  getExecutionsRefetchQueries
} from 'editor/queries';

import Form from '../common/form';

// import _debug from 'debug';
// const debug = _debug('lens:editor:execution:executionDelete:view');

interface IProps {
  sourceId: string;
  simulationId: number;
  executionId: number;
  execution: IExecution;
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
      execution: {
        name,
        created,
        modified
      }
    } = this.props;

    return (
      <Mutation mutation={DELETE_EXECUTION} key={executionId}>
        {(deleteExecution) => (
          <Form
            isDelete
            name={name}
            created={created}
            modified={modified}
            tag={`${sourceId}:${simulationId}:${executionId}`}
            onConfirm={this.handleConfirmClick(deleteExecution)}
            onCancel={onClose}
          />
        )}
      </Mutation>
    );
  }

  private handleConfirmClick = (mutateFunc) => () => {
    const { sourceId, simulationId, executionId, onClose } = this.props;
    mutateFunc({
      variables: { id: executionId },
      refetchQueries: getExecutionsRefetchQueries(sourceId, simulationId)
    });
    onClose();
  };
}

export default View;
