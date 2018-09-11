import React from 'react';
import { IExecution } from 'editor/interfaces';
import { Mutation } from 'react-apollo';
import {
  UPDATE_EXECUTION,
  getExecutionsRefetchQueries,
} from 'editor/queries';

import Form from './form';

interface IProps {
  sourceId: string;
  simulationId: number;
  executionId: number;
  execution: IExecution;
  loading: boolean;
  onClose: () => void;
}

interface IState {
  name: string;
}

const initialState: IState = {
  name: '',
};

class View extends React.Component<IProps, any> {
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
      executionId,
      execution: {
        created,
        modified,
      },
    } = this.props;

    return (
      <Mutation mutation={UPDATE_EXECUTION} key={executionId}>
        {(updateExecution) => (
          <Form
            name={this.state.name}
            created={created}
            modified={modified}
            tag={`${sourceId}:${simulationId}:${executionId}`}
            onNameChange={this.handleChange('name')}
            onSave={this.handleSaveClick(updateExecution)}
            onCancel={onClose}
          />
        )}
      </Mutation>
    );
  }

  private initializeEditFields() {
    this.setState({ name: this.props.execution.name });
  }

  private handleSaveClick = (mutateFunc) => () => {
    const { executionId, sourceId, simulationId, onClose } = this.props;
    const { name } = this.state;
    mutateFunc({
      variables: { id: executionId, name },
      refetchQueries: getExecutionsRefetchQueries(sourceId, simulationId)
    });
    onClose();
  };

  private handleChange = (key: string) => (event) =>
    // @ts-ignore
    this.setState({ [key]: event.target.value });
}

export default View;
