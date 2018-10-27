import React from 'react';
import ThumbnailCard from 'components/thumbnailCard';
import { IImageDescriptor, ISourceDescriptor } from 'src/interfaces';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  thumbnailContainer: {
    padding: theme.spacing.unit * 4
  }
});

interface IProps {
  classes: any;
  sources: ReadonlyArray<ISourceDescriptor>;
  thumbnailImageDescriptors: ReadonlyArray<IImageDescriptor>;
  thumbnailImageKeys: ReadonlyArray<string>;
  thumbnailImages: any;
  ensureImages: (payload: {[imageDescriptors: string]: ReadonlyArray<IImageDescriptor>}) => void;
  ensureCatalogTitle: (sourceId?: string) => void;
}

interface IState {
  resolution: number;
}

class SourcesView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      resolution: 32
    };
  }

  public componentDidMount(): any {
    setTimeout(() => this.props.ensureCatalogTitle());

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

  public renderThumbnailCard(resolution, source, thumbnail, key) {
    const { classes } = this.props;
    return (
      <div className={classes.thumbnailContainer} key={key}>
        <ThumbnailCard
          thumbnailUrl={thumbnail ? thumbnail.url : null}
          label={source.name}
          imageDataLink={`/Catalog/Source/${source.id}/${resolution}`}
          catalogLink={`/Catalog/${source.id}/Simulation`}
        />
      </div>
    );
  }

  public render() {
    const { classes, thumbnailImages, sources } = this.props;
    const { resolution } = this.state;
    return (
      <div className={classes.root}>
        {this.props.thumbnailImageKeys.map((key, index) =>
          this.renderThumbnailCard(
            resolution,
            sources[index],
            thumbnailImages[key],
            key))}
      </div>
    );
  }

  private requestImages(): void {
    setTimeout(() => {
      this.props.ensureImages({ imageDescriptors: this.props.thumbnailImageDescriptors });
    }, 0);
  }
}

// @ts-ignore
export default withStyles(styles)(SourcesView);
