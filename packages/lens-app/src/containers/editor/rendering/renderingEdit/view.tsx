import React from 'react';
import { IRendering } from '@editor/interfaces';
import { Mutation } from 'react-apollo';
import { backupUrl } from '@src/helpers';
import { UPDATE_RENDERING } from '@editor/queries';

import Form from './form';

// import _debug from 'debug';
// const debug = _debug('lens:editor:rendering:renderingEdit:view');

interface IProps {
  match: any;
  history: any;
  sourceId: string;
  rendering: IRendering;
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
      rendering: {
        id,
        executionId,
        simulationId,
        created,
        modified
      }
    } = this.props;

    return (
      <Mutation mutation={UPDATE_RENDERING} key={id}>
        {(updateRendering) => (
          <Form
            name={this.state.name}
            created={created}
            modified={modified}
            tag={`${sourceId}:${simulationId}:${executionId}:${id}`}
            onNameChange={this.handleChange('name')}
            onSave={this.handleSaveClick(updateRendering)}
            onCancel={this.returnToList}
          />
        )}
      </Mutation>
    );
  }

  private initializeEditFields() {
    this.setState({ name: this.props.rendering.name });
  }

  private returnToList = () => {
    const { match: { url }, history } = this.props;
    history.replace(backupUrl(url));
  };

  private handleSaveClick = (mutateFunc) => () => {
    mutateFunc({
      variables: {
        id: this.props.rendering.id,
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
