import React from 'react';
import { ISimulation } from 'editor/interfaces';
import { Mutation } from 'react-apollo';
import {
  UPDATE_SIMULATION,
  getSimulationsRefetchQueries
} from 'editor/queries';

import Form from './form';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationEdit:view');

interface IProps {
  sourceId: string;
  simulationId: number;
  simulation: ISimulation;
  loading: boolean;
  onClose: () => void;
}

interface IState {
  name: string;
}

const initialState: IState = {
  name: ''
};

class View extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  public componentDidMount(): void {
    if (!this.props.loading) {
      this.initializeEditFields();
    }
  }

  public componentDidUpdate(prevProps: IProps): void {
    if (prevProps.loading && !this.props.loading) {
      this.initializeEditFields();
    }
  }

  public render(): any {
    if (this.props.loading) {
      return null;
    }

    const {
      onClose,
      sourceId,
      simulationId,
      simulation: {
        created,
        modified
      }
    } = this.props;

    return (
      <Mutation mutation={UPDATE_SIMULATION} key={simulationId}>
        {(updateSimulation) => (
          <Form
            name={this.state.name}
            created={created}
            modified={modified}
            tag={`${sourceId}:${simulationId}`}
            onNameChange={this.handleChange('name')}
            onSave={this.handleSaveClick(updateSimulation)}
            onCancel={onClose}
          />
        )}
      </Mutation>
    );
  }

  private initializeEditFields() {
    this.setState({ name: this.props.simulation.name });
  }

  private handleSaveClick = (mutateFunc) => () => {
    const { simulationId, sourceId, onClose } = this.props;
    mutateFunc({
      variables: {
        id: simulationId,
        name: this.state.name
      },
      refetchQueries: getSimulationsRefetchQueries(sourceId)
    });
    onClose();
  };

  private handleChange = (key: string) => (event) =>
    // @ts-ignore
    this.setState({ [key]: event.target.value });
}

export default View;
