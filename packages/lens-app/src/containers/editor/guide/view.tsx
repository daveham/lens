import React from 'react';
import { IThumbnailDescriptor } from 'src/interfaces';
import { ISimulation } from 'editor/interfaces';
import GuideControl from './components/guideControl';

import _debug from 'debug';
const debug = _debug('lens:editor:guide:view');

interface IProps {
  match: any;
  title?: string;
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: {[imageDescriptor: string]: IThumbnailDescriptor}) => void;
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
      match: { params: { sourceId } },
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
      match: { params: {
        sourceId,
        simulationId,
        executionId,
        renderingId,
      }},
    } = this.props;

    return (
      <GuideControl
        title={title}
        thumbnailUrl={thumbnailUrl}
        simulations={simulations}
        sourceId={sourceId}
        simulationId={simulationId}
        executionId={executionId}
        renderingId={renderingId}
        onPathChanged={this.handlePathChange}
      />
    );
  }

  private handlePathChange = (path) => {
    debug('handlePathChange', { path });
  };
}

export default EditorGuideView;
