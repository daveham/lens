import React from 'react';
import { ISimulation } from 'editor/interfaces';
import { Mutation } from 'react-apollo';
import { backupUrl } from 'src/helpers';
import {
  DELETE_SIMULATION,
  GET_SIMULATIONS
} from 'editor/queries';

import Form from './form';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationDelete:view');

interface IProps {
  match: any;
  history: any;
  sourceId: string;
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
      simulation: {
        id,
        name,
        created,
        modified
      }
    } = this.props;

    return (
      <Mutation mutation={DELETE_SIMULATION} key={id}>
        {(deleteSimulation) => (
          <Form
            name={name}
            created={created}
            modified={modified}
            tag={`${sourceId}:${id}`}
            onConfirm={this.handleConfirmClick(deleteSimulation)}
            onCancel={this.returnToList}
          />
        )}
      </Mutation>
    );
  }

  private returnToList = () => {
    const { match: { url }, history } = this.props;
    history.replace(backupUrl(url, 2));
  };

  private handleConfirmClick = (mutateFunc) => () => {
    mutateFunc({
      variables: {
        id: this.props.simulation.id
      },
      refetchQueries: [{
        query: GET_SIMULATIONS,
        variables: { sourceId: this.props.sourceId }
      }]
    });
    this.returnToList();
  };
}

export default View;
