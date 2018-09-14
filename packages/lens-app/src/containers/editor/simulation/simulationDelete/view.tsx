import React from 'react';
import { ISimulation } from 'editor/interfaces';
import { Mutation } from 'react-apollo';
import {
  DELETE_SIMULATION,
  getSimulationsRefetchQueries
} from 'editor/queries';

import Form from '../common/form';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationDelete:view');

interface IProps {
  sourceId: string;
  simulationId: number;
  simulation: ISimulation;
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
      simulation: {
        name,
        created,
        modified
      }
    } = this.props;

    return (
      <Mutation mutation={DELETE_SIMULATION} key={simulationId}>
        {(deleteSimulation) => (
          <Form
            isDelete
            name={name}
            created={created}
            modified={modified}
            tag={`${sourceId}:${simulationId}`}
            onConfirm={this.handleConfirmClick(deleteSimulation)}
            onCancel={onClose}
          />
        )}
      </Mutation>
    );
  }

  private handleConfirmClick = (mutateFunc) => () => {
    const { sourceId, simulationId, onClose } = this.props;
    mutateFunc({
      variables: { id: simulationId },
      refetchQueries: getSimulationsRefetchQueries(sourceId)
    });
    onClose();
  };
}

export default View;
