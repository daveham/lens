import React from 'react';
import { Mutation } from 'react-apollo';
import { backupUrl } from 'src/helpers';
import {
  CREATE_RENDERING,
  getAddRenderingRefetchQueries,
} from 'editor/queries';

import Form from '../common/form';

// import _debug from 'debug';
// const debug = _debug('lens:editor/rendering/renderingNew/view');

interface IProps {
  sourceId: string;
  executionId: number;
  simulationId: number;
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
      executionId,
      onClose
    } = this.props;

    return (
      <Mutation mutation={CREATE_RENDERING} key={executionId}>
        {(addRendering) => (
          <Form
            isNew
            name={this.state.name}
            onNameChange={this.handleChange('name')}
            onSave={this.handleSaveClick(addRendering)}
            onCancel={onClose}
          />
        )}
      </Mutation>
    );
  }

  private initializeEditFields() {
    this.setState({ name: initialState.name });
  }

  private handleSaveClick = (mutateFunc) => () => {
    const { sourceId, simulationId, executionId, onClose } = this.props;
    const { name } = this.state;
    mutateFunc({
      variables: { executionId, simulationId, name },
      refetchQueries: getAddRenderingRefetchQueries(sourceId, simulationId, executionId)
    });
    onClose();
  };

  private handleChange = (key: string) => (event) =>
    // @ts-ignore
    this.setState({[key]: event.target.value});
}

export default View;
