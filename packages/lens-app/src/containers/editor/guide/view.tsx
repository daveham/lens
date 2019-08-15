import React from 'react';
import { IThumbnailDescriptor } from 'src/interfaces';
import { ISimulation } from 'editor/interfaces';
import GuideControl, { controlSegmentKeys, controlSegmentActions } from './components/guideControl';

import _debug from 'debug';
const debug = _debug('lens:editor:guide:view');

interface IProps {
  match: any;
  history: any;
  photo?: string;
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: { [imageDescriptor: string]: IThumbnailDescriptor }) => void;
  ensureEditorTitle: (sourceId?: string) => void;
  simulations?: ReadonlyArray<ISimulation>;
  loading?: any;
  error?: any;
}

export class EditorGuideView extends React.Component<IProps, any> {
  public componentDidMount(): void {
    const {
      thumbnailUrl,
      thumbnailImageDescriptor: imageDescriptor,
      ensureImage,
      ensureEditorTitle,
      match: {
        params: { sourceId },
      },
    } = this.props;

    ensureEditorTitle(sourceId);

    if (!thumbnailUrl) {
      ensureImage({ imageDescriptor });
    }
  }

  public render(): any {
    const {
      photo,
      thumbnailUrl,
      simulations,
      match: {
        params: { sourceId, simulationId, executionId, renderingId, action },
      },
      loading,
    } = this.props;

    let resolvedSimulationId = simulationId;
    let resolvedExecutionId = executionId;
    let resolvedRenderingId = renderingId;
    let resolvedAction = action;
    const re = /^[a-z]+$/;
    debug('render', { simulationId, executionId, renderingId });
    if (renderingId && re.test(renderingId)) {
      resolvedAction = renderingId; // interpret id as rest action and clear id
      resolvedRenderingId = undefined;
    } else if (executionId && re.test(executionId)) {
      resolvedAction = executionId; // interpret id as rest action and clear id
      resolvedExecutionId = undefined;
    } else if (simulationId && re.test(simulationId)) {
      resolvedAction = simulationId; // interpret id as rest action and clear id
      resolvedSimulationId = undefined;
    }

    return (
      <GuideControl
        loading={loading}
        title={photo}
        thumbnailUrl={thumbnailUrl}
        simulations={simulations}
        sourceId={sourceId}
        simulationId={resolvedSimulationId}
        executionId={resolvedExecutionId}
        renderingId={resolvedRenderingId}
        action={resolvedAction}
        onControlParametersChanged={this.handleControlParametersChanged}
        onControlActionSubmit={this.handleControlActionSubmit}
        onControlActionCancel={this.handleControlActionCancel}
      />
    );
  }

  private handleControlActionSubmit = () => {
    debug('handleControlActionSubmit');
  };

  private handleControlActionCancel = () => {
    debug('handleControlActionCancel');
  };

  private handleControlParametersChanged = (params, active, action) => {
    const {
      match: {
        params: { sourceId },
      },
      history,
    } = this.props;
    const { simulationId, executionId, renderingId } = params;
    debug('handleControlParametersChanged', {
      active,
      simulationId,
      executionId,
      renderingId,
    });

    const isNewAction = action === controlSegmentActions.new;
    let path = `/Catalog/${sourceId}/Simulation`;

    switch (active) {
      case controlSegmentKeys.simulation:
        if (isNewAction) {
          path = `${path}/${controlSegmentActions.new}`;
        } else if (simulationId) {
          path = `${path}/${simulationId}`;
        }
        break;
      case controlSegmentKeys.execution:
        if (isNewAction) {
          path = `${path}/${simulationId}/Execution/${controlSegmentActions.new}`;
        } else if (executionId) {
          path = `${path}/${simulationId}/Execution/${executionId}`;
        } else {
          path = `${path}/${simulationId}/Execution`;
        }
        break;
      case controlSegmentKeys.rendering:
        if (isNewAction) {
          path = `${path}/${simulationId}/Execution/${executionId}/Rendering/${
            controlSegmentActions.new
          }`;
        } else if (renderingId) {
          path = `${path}/${simulationId}/Execution/${executionId}/Rendering/${renderingId}`;
        } else {
          path = `${path}/${simulationId}/Execution/${executionId}/Rendering`;
        }
        break;
      default:
        return;
    }

    if (action && !isNewAction) {
      path = `${path}/${action}`;
    }

    debug('handleControlParametersChange - navigate to', { path });
    history.push(path);
  };
}

export default EditorGuideView;
