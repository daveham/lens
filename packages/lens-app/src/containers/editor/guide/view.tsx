import React from 'react';
import { IThumbnailDescriptor } from 'src/interfaces';
import { ISimulation } from 'editor/interfaces';
import GuideControl, { controlSegmentKeys, controlSegmentActions } from './components/guideControl';

import _debug from 'debug';
const debug = _debug('lens:editor:guide:view');

interface IProps {
  match: any;
  title?: string;
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: { [imageDescriptor: string]: IThumbnailDescriptor }) => void;
  ensureEditorTitle: (sourceId?: string) => void;
  simulations?: ReadonlyArray<ISimulation>;
}

export class EditorGuideView extends React.Component<IProps, any> {
  public componentDidMount(): void {
    const {
      thumbnailUrl,
      thumbnailImageDescriptor,
      ensureImage,
      ensureEditorTitle,
      match: {
        params: { sourceId },
      },
    } = this.props;

    ensureEditorTitle(sourceId);

    if (!thumbnailUrl) {
      ensureImage({ imageDescriptor: thumbnailImageDescriptor });
    }
  }

  public render(): any {
    const {
      title,
      thumbnailUrl,
      simulations,
      match: {
        params: { sourceId, simulationId, executionId, renderingId, action },
      },
    } = this.props;

    let resolvedSimulationId = simulationId;
    let resolvedExecutionId = executionId;
    let resolvedRenderingId = renderingId;
    let resolvedAction = action;
    const re = /^[a-z]+$/;
    if (renderingId && re.test(renderingId)) {
      resolvedAction = renderingId;
      resolvedRenderingId = undefined;
    } else if (executionId && re.test(executionId)) {
      resolvedAction = executionId;
      resolvedExecutionId = undefined;
    } else if (simulationId && re.test(simulationId)) {
      resolvedAction = simulationId;
      resolvedSimulationId = undefined;
    }

    return (
      <GuideControl
        title={title}
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
    } = this.props;
    const { simulationId, executionId, renderingId } = params;

    const isNewAction = action === controlSegmentActions.new;
    let path = `/Catalog/${sourceId}/Simulation`;

    switch (active) {
      case controlSegmentKeys.simulation:
        path = `${path}/${isNewAction ? controlSegmentActions.new : simulationId}`;
        break;
      case controlSegmentKeys.execution:
        path = `${path}/${simulationId}/Execution/${
          isNewAction ? controlSegmentActions.new : executionId
        }`;
        break;
      case controlSegmentKeys.rendering:
        path = `${path}/${simulationId}/Execution/${executionId}/Rendering/${
          isNewAction ? controlSegmentActions.new : renderingId
        }`;
        break;
    }

    if (action && !isNewAction) {
      path = `${path}/${action}`;
    }

    debug('handleControlParametersChange', { path });
  };
}

export default EditorGuideView;
