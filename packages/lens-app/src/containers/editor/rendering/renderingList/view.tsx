import React from 'react';

import { IRendering } from 'editor/interfaces';
import RenderingTable from './renderingTable';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:renderingList:view');

function renderError(error: any): any {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading(): any {
  return <div>'Loading...'</div>;
}

interface IProps {
  match: any;
  loading: boolean;
  error: any;
  renderings: ReadonlyArray<IRendering>;
  simulationId: number;
  executionId: number;
  simulationName: string;
  executionName: string;
  recordPathNames: (payload: any) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): void {
    if (this.props.executionName) {
      this.recordNavigationPath();
    }
  }

  public componentDidUpdate(prevProps: IProps): void {
    if (this.props.executionName && !prevProps.executionName) {
      this.recordNavigationPath();
    }
  }

  public render(): any {
    const {
      error,
      loading,
      renderings,
      match: { url }
    } = this.props;

    return (
      <div className={styles.container}>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error && (
          <RenderingTable
            renderingRows={renderings}
            matchUrl={url}
          />
        )}
      </div>
    );
  }

  private recordNavigationPath(): void {
    const {
      simulationId,
      simulationName,
      executionId,
      executionName,
      recordPathNames
    } = this.props;
    recordPathNames({
      simulationId,
      simulationName,
      executionId,
      executionName
    });
  }
}

export default View;
