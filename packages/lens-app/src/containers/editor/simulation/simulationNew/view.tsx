import React from 'react';
import { Mutation } from 'react-apollo';
import { backupUrl } from '@src/helpers';
import { CREATE_SIMULATION } from '@editor/queries';

import Form from './form';

import _debug from 'debug';
const debug = _debug('lens:editor/simulation/simulationNew/view');

interface IProps {
  match: any;
  history: any;
  sourceId: string;
  loading: boolean;
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
    } = this.props;

    return (
      <Mutation mutation={CREATE_SIMULATION} key={sourceId}>
        {(addSimulation) => (
          <Form
            name={this.state.name}
            onNameChange={this.handleChange('name')}
            onSave={this.handleSaveClick(addSimulation)}
            onCancel={this.returnToList}
          />
        )}
      </Mutation>
    );
  }

  private initializeEditFields() {
    this.setState({ name: initialState.name });
  }

  private returnToList = () => {
    const { match: { url }, history } = this.props;
    history.replace(backupUrl(url));
  };

  private handleSaveClick = (mutateFunc) => () => {
    debug('handleSaveClick', { sourceId: this.props.sourceId, name: this.state.name });
    mutateFunc({
      variables: {
        sourceId: this.props.sourceId,
        name: this.state.name
      },
      refetchQueries: ['getSimulationsForSource']
    });
    this.returnToList();
  };

  private handleChange = (key: string) => (event) =>
    // @ts-ignore
    this.setState({[key]: event.target.value});
}

export default View;
