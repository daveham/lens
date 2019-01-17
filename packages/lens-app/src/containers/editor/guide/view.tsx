import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IThumbnailDescriptor } from 'src/interfaces';
import { default as getConfig } from 'src/config';
import Loading from 'src/components/loading';

import { withStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor:guide');

const styles: any = (theme) => {
  const { unit } = theme.spacing;
  const { borderRadius } = theme.shape;
  return {
    root: {
      padding: unit * 2,
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'column',
      // border: '1px solid #f00',
    },
    card: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      maxWidth: unit * 50,
      // maxWidth: 225,
      // minWidth: 225,
    },
    cardHeader: {
      backgroundColor: 'inherit',
      color: 'inherit',
    },
    cardHeaderTitle: {
      color: 'inherit',
    },
    cardAction: {
      width: '100%',
    },
    media: {
      // objectFit: 'cover',
      height: 0,
      paddingTop: '66.66%',
    },
    avatar: {
      backgroundColor: theme.palette.secondary.main,
    },
    cardContent: {
      backgroundColor: 'inherit',
      color: 'inherit',
      padding: unit,
      '&:last-child': {
        padding: unit,
      },
    },
    expansion: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: borderRadius * 2,
      margin: `${unit}px 0`,
      '&:first-child': {
        borderRadius: borderRadius * 2,
        margin: `${unit}px 0`,
      },
      '&:last-child': {
        borderRadius: borderRadius * 2,
        margin: `${unit}px 0`,
      },
    },
    expansionHeading: {
      flexBasis: '33%',
      flexShrink: 0,
      color: theme.palette.primary.contrastText,
      fontWeight: 600,
    },
    expansionSecondaryHeading: {
      color: theme.palette.primary.contrastText,
    },
    expansionDetails: {
      backgroundColor: theme.editor.guide.background,
      borderRadius: borderRadius * 2,
      // borderBottomLeftRadius: borderRadius * 2,
      // borderBottomRightRadius: borderRadius * 2,
    },
  };
};

interface IProps {
  classes?: any;
  match: any;
  label: string;
  photo?: string;
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: {[imageDescriptor: string]: IThumbnailDescriptor}) => void;
  ensureEditorTitle: (sourceId?: string) => void;
}

class View extends React.Component<IProps, any> {
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
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          {this.renderHeader()}
          {this.renderMedia()}
          {this.renderContents()}
        </Card>
      </div>
    );
  }

  private renderHeader(): any {
    const {
      classes,
      thumbnailUrl,
      photo,
    } = this.props;

    const headerContent = thumbnailUrl
      ? null
      : <Loading pulse={true} />;

    return (
      <CardHeader
        classes={{
          root: classes.cardHeader,
          title: classes.cardHeaderTitle,
        }}
        avatar={(
          <Avatar className={classes.avatar}>
            P
          </Avatar>
        )}
        title={photo}
      >
        {headerContent}
      </CardHeader>
    );
  }

  private renderMedia(): any {
    const {
      classes,
      thumbnailUrl,
    } = this.props;

    const fullUrl = thumbnailUrl
      ? `${getConfig().dataHost}${thumbnailUrl}`
      : null;

    return (
      <CardMedia
        className={classes.media}
        image={fullUrl}
      />
    );
  }

  private renderContents(): any {
    const {
      classes,
      thumbnailUrl,
    } = this.props;

    if (!thumbnailUrl) {
      return null;
    }

    return (
      <CardContent classes={{ root: classes.cardContent }}>
        <ExpansionPanel classes={{ root: classes.expansion }}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography classes={{ body2: classes.expansionHeading }}>Simulations</Typography>
            <Typography className={classes.expansionSecondaryHeading}>Current Simulation</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails classes={{ root: classes.expansionDetails }}>
            <Typography color='textSecondary'>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissim quam.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel classes={{ root: classes.expansion }}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography classes={{ body2: classes.expansionHeading }}>Executions</Typography>
            <Typography className={classes.expansionSecondaryHeading}>Current Execution</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails classes={{ root: classes.expansionDetails }}>
            <Typography color='textSecondary'>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissim quam.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel classes={{ root: classes.expansion }}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography classes={{ body2: classes.expansionHeading }}>Renderings</Typography>
            <Typography className={classes.expansionSecondaryHeading}>Current Rendering</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails classes={{ root: classes.expansionDetails }}>
            <Typography color='textSecondary'>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissim quam.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </CardContent>
    );
  }
}

export default withStyles(styles)(View);
