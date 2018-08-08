import React from 'react';
import { ISimulation } from '@simulation/interfaces';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Form from './form';

import _debug from 'debug';
const debug = _debug('lens:simulationEdit:view');

const UPDATE_SIMULATION = gql`
  mutation UpdateSimulation($id: ID!, $name: String!) {
    updateSimulation(input: { id: $id, name: $name }) {
      id
      name
      modified
    }
  }
`;

interface IProps {
  sourceId: string;
  simulation: ISimulation;
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
      simulation: {
        id,
        created,
        modified
      }
    } = this.props;

    return (
      <Mutation mutation={UPDATE_SIMULATION} key={id}>
        {(updateSimulation) => (
          <Form
            name={this.state.name}
            created={created}
            modified={modified}
            tag={`${sourceId}:${id}`}
            onNameChange={this.handleChange('name')}
            onSave={this.handleSaveClick(updateSimulation)}
            onCancel={this.handleCancelClick}
          />
        )}
      </Mutation>
    );
  }

  private initializeEditFields() {
    this.setState({ name: this.props.simulation.name });
  }

  private handleSaveClick = (mutateFunc) => () => {
    mutateFunc({
      variables: {
        id: this.props.simulation.id,
        name: this.state.name
      }
    });
  };

  private handleCancelClick = () => {
    debug('handleCancelClick');
  };

  private handleChange = (key: string) => (event) =>
    // @ts-ignore
    this.setState({ [key]: event.target.value });
}

export default View;
