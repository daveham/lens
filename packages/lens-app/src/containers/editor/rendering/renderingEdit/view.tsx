import React from 'react';
import { IRendering } from 'editor/interfaces';
import { Mutation } from 'react-apollo';
import {
  UPDATE_RENDERING,
  getRenderingsRefetchQueries,
} from 'editor/queries';

import Form from './form';

// import _debug from 'debug';
// const debug = _debug('lens:editor:rendering:renderingEdit:view');

interface IProps {
  sourceId: string;
  simulationId: number;
  executionId: number;
  renderingId: number;
  rendering: IRendering;
  loading: boolean;
  onClose: () => void;
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
      onClose,
      sourceId,
      simulationId,
      executionId,
      renderingId,
      rendering: {
        created,
        modified
      }
    } = this.props;

    return (
      <Mutation mutation={UPDATE_RENDERING} key={renderingId}>
        {(updateRendering) => (
          <Form
            name={this.state.name}
            created={created}
            modified={modified}
            tag={`${sourceId}:${simulationId}:${executionId}:${renderingId}`}
            onNameChange={this.handleChange('name')}
            onSave={this.handleSaveClick(updateRendering)}
            onCancel={onClose}
          />
        )}
      </Mutation>
    );
  }

  private initializeEditFields() {
    this.setState({ name: this.props.rendering.name });
  }

  private handleSaveClick = (mutateFunc) => () => {
    const { renderingId, executionId, onClose } = this.props;
    const { name } = this.state;
    mutateFunc({
      variables: { id: renderingId, name },
      refetchQueries: getRenderingsRefetchQueries(executionId)
    });
    onClose();
  };

  private handleChange = (key: string) => (event) =>
    // @ts-ignore
    this.setState({ [key]: event.target.value });
}

export default View;
