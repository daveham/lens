import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Gradient from '@material-ui/icons/Gradient';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import { Link as RouterLink } from 'react-router-dom';
import SourceThumbnail from '@components/sourceThumbnail';
import { IImageDescriptor, ISourceDescriptor } from '@src/interfaces';
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

  public renderThumbnail(resolution, source, thumbnail, key) {
    const SimulationLink = (props) => (
      <RouterLink
        to={`/Catalog/${source.id}/Simulation`}
        {...props}
      />
    );
    const TileLink = (props) => (
      <RouterLink
        to={`/Catalog/Source/${source.id}/${resolution}`}
        {...props}
      />
    );

    return (
      <div className={styles.thumbnailContainer} key={key}>
        <SourceThumbnail
          thumbnailUrl={thumbnail ? thumbnail.url : null}
          label={source.name}
          link={`/Catalog/Source/${source.id}/${resolution}`}
        >
          <Toolbar>
            <IconButton component={SimulationLink}><PhotoLibrary/></IconButton>
            <IconButton component={TileLink}><Gradient/></IconButton>
          </Toolbar>
        </SourceThumbnail>
      </div>
    );
  }

  public render() {
    const { thumbnailImages, sources, catalogName } = this.props;
    const { resolution } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.catalogName}>{catalogName}</div>
        <div className={styles.thumbnailsContainer}>
          {this.props.thumbnailImageKeys.map((key, index) =>
            this.renderThumbnail(
              resolution,
              sources[index],
              thumbnailImages[key],
              key))}
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
