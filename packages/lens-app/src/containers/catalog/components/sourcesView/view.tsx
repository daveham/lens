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

interface IState {
  resolution: number;
}

class View extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      resolution: 32
    };
  }

  public componentDidMount(): any {
    const idCount = this.props.thumbnailImageDescriptors.length;
    if (idCount && Object.keys(this.props.thumbnailImages).length < idCount) {
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
    const { resolution } = this.state;
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
                link={`/Catalog/Source/${source.id}/${resolution}`}
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
