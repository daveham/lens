import * as React from 'react';
import { ISourceDescriptor, IThumbnailDescriptor } from '../../../../interfaces';
import styles from './styles.scss';

import debugLib from 'debug';
const debug = debugLib('lens:catalog:sourceview');

interface IProps {
  match?: any;
  loaded?: boolean;
  sources: ReadonlyArray<ISourceDescriptor>;
  thumbnailImageDescriptors: ReadonlyArray<IThumbnailDescriptor>;
  thumbnailImageUrls: ReadonlyArray<string>;
  ensureImage: (descriptors: {[name: string]: IThumbnailDescriptor}) => void;
}

class View extends React.Component<IProps, any> {
  public render() {
    debug('render', { match: this.props.match });
    const { match } = this.props;
    const { id } = match.params;
    return (
      this.props.loaded && (
        <div className={styles.container}>
          {`a single source ${id}`}
        </div>
      )
    );
  }
}

export default View;
