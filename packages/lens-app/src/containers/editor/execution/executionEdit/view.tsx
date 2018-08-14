import React from 'react';
import { IExecution } from '@editor/interfaces';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { backupUrl } from '@src/helpers';

import Form from './form';

// import _debug from 'debug';
// const debug = _debug('lens:editor:execution:executionEdit:view');

const UPDATE_EXECUTION = gql`
  mutation UpdateExecution($id: ID!, $name: String!) {
    updateExecution(input: { id: $id, name: $name }) {
      id
      name
      modified
    }
  }
`;

interface IProps {
  match: any;
  history: any;
  sourceId: string;
  execution: IExecution;
  loading: boolean;
}

interface IState {
  name: string;
}

const initialState: IState = {
  name: ''
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
      sourceId,
      execution: {
        id,
        simulationId,
        created,
        modified
      }
    } = this.props;

    return (
      <Mutation mutation={UPDATE_EXECUTION} key={id}>
        {(updateExecution) => (
          <Form
            name={this.state.name}
            created={created}
            modified={modified}
            tag={`${sourceId}:${simulationId}:${id}`}
            onNameChange={this.handleChange('name')}
            onSave={this.handleSaveClick(updateExecution)}
            onCancel={this.returnToList}
          />
        )}
      </Mutation>
    );
  }

  private initializeEditFields() {
    this.setState({ name: this.props.execution.name });
  }

  private returnToList = () => {
    const { match: { url }, history } = this.props;
    history.replace(backupUrl(url));
  };

  private handleSaveClick = (mutateFunc) => () => {
    mutateFunc({
      variables: {
        id: this.props.execution.id,
        name: this.state.name
      }
    });
    this.returnToList();
  };

  private handleChange = (key: string) => (event) =>
    // @ts-ignore
    this.setState({ [key]: event.target.value });
}

export default View;
