import React from 'react';
import { Mutation } from 'react-apollo';
import { backupUrl } from 'src/helpers';
import { CREATE_RENDERING } from 'editor/queries';

import Form from './form';

import _debug from 'debug';
const debug = _debug('lens:editor/rendering/renderingNew/view');

interface IProps {
  match: any;
  history: any;
  executionId: number;
  simulationId: number;
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
      executionId,
    } = this.props;

    return (
      <Mutation mutation={CREATE_RENDERING} key={executionId}>
        {(addRendering) => (
          <Form
            name={this.state.name}
            onNameChange={this.handleChange('name')}
            onSave={this.handleSaveClick(addRendering)}
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
    debug('handleSaveClick', {
      executionId: this.props.executionId,
      simulationId: this.props.simulationId,
      name: this.state.name
    });
    mutateFunc({
      variables: {
        executionId: this.props.executionId,
        simulationId: this.props.simulationId,
        name: this.state.name
      },
      refetchQueries: ['getRenderings']
    });
    this.returnToList();
  };

  private handleChange = (key: string) => (event) =>
    // @ts-ignore
    this.setState({[key]: event.target.value});
}

export default View;
