import React from 'react';
import { Mutation } from 'react-apollo';
import {
  CREATE_SIMULATION,
  getSimulationsRefetchQueries
} from 'editor/queries';

import Form from '../common/form';

// import _debug from 'debug';
// const debug = _debug('lens:editor/simulation/simulationNew/view');

interface IProps {
  sourceId: string;
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
      sourceId,
      onClose
    } = this.props;

    return (
      <Mutation mutation={CREATE_SIMULATION} key={sourceId}>
        {(addSimulation) => (
          <Form
            isNew
            name={this.state.name}
            onNameChange={this.handleChange('name')}
            onSave={this.handleSaveClick(addSimulation)}
            onCancel={onClose}
          />
        )}
      </Mutation>
    );
  }

  private initializeEditFields() {
    this.setState(initialState);
  }

  private handleSaveClick = (mutateFunc) => () => {
    const { sourceId, onClose } = this.props;
    const { name } = this.state;
    mutateFunc({
      variables: { sourceId, name },
      refetchQueries: getSimulationsRefetchQueries(sourceId)
    });
    onClose();
  };

  private handleChange = (key: string) => (event) =>
    // @ts-ignore
    this.setState({[key]: event.target.value});
}

export default View;
