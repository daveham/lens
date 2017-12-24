import React from 'react';
import SourceThumbnail from '../sourceThumbnail';
import { IImageDescriptor, ISourceDescriptor } from '../../../../interfaces';
import styles from './styles.scss';

interface IProps {
  sources: ReadonlyArray<ISourceDescriptor>;
  catalogName: string;
  thumbnailImageDescriptors: ReadonlyArray<IImageDescriptor>;
  thumbnailImageKeys: ReadonlyArray<string>;
  thumbnailImages: any;
  ensureImages: (payload: {[imageDescriptors: string]: ReadonlyArray<IImageDescriptor>}) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): any {
    if (this.props.thumbnailImageDescriptors.length &&
      !Object.keys(this.props.thumbnailImages).length) {
      this.requestImages();
    }
  }

  public componentDidUpdate(prevProps: IProps): any {
    if (prevProps.thumbnailImageDescriptors !== this.props.thumbnailImageDescriptors) {
      this.requestImages();
    }
  }

  public render() {
    const { thumbnailImages, sources, catalogName } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.catalogName}>{catalogName}</div>
        <div className={styles.thumbnailsContainer}>
          {this.props.thumbnailImageKeys.map((key, index) => {
            const source = sources[index];
            const thumbnail = thumbnailImages[key];
            return (
              <SourceThumbnail
                key={key}
                thumbnailUrl={thumbnail ? thumbnail.url : null}
                label={source.name}
                link={`/Catalog/Source/${source.id}`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  private requestImages(): void {
    setTimeout(() => {
      this.props.ensureImages({ imageDescriptors: this.props.thumbnailImageDescriptors });
    }, 0);
  }
}

export default View;
