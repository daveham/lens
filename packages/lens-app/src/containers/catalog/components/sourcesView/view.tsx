import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Gradient from '@material-ui/icons/Gradient';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import { Link as RouterLink } from 'react-router-dom';
import SourceThumbnail from 'components/sourceThumbnail';
import { IImageDescriptor, ISourceDescriptor } from 'src/interfaces';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing.unit,
    paddingTop: theme.spacing.unit
  },
  title: {
    flexGrow: 1
  },
  thumbnailsContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  thumbnailContainer: {
    padding: 20
  }
});

interface IProps {
  classes: any;
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

class SourcesView extends React.Component<IProps, IState> {
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
    const { classes } = this.props;

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
      <div className={classes.thumbnailContainer} key={key}>
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
    const { classes, thumbnailImages, sources, catalogName } = this.props;
    const { resolution } = this.state;
    return (
      <div className={classes.root}>
        <Typography variant='display1' gutterBottom noWrap className={classes.title}>
          {catalogName}
        </Typography>
        <div className={classes.thumbnailsContainer}>
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

// @ts-ignore
export default withStyles(styles)(SourcesView);
