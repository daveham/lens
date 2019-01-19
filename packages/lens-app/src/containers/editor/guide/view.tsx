import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from './components/ExpansionPanel';
import ExpansionPanelSummary from './components/ExpansionPanelSummary';
import ExpansionPanelDetails from './components/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IThumbnailDescriptor } from 'src/interfaces';
import { default as getConfig } from 'src/config';
import Loading from 'src/components/loading';

import { withStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor:guide');

const styles: any = (theme) => {
  const { unit } = theme.spacing;
  return {
    root: {
      padding: unit * 2,
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'column',
    },
    card: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      maxWidth: unit * 50,
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
    expansionHeading: {
      flexBasis: '33%',
      flexShrink: 0,
      color: theme.palette.primary.contrastText,
      fontWeight: 600,
    },
    expansionSecondaryHeading: {
      color: theme.palette.primary.contrastText,
    },
    list: {
      width: '100%',
      maxHeight: unit * 12,
      overflow: 'auto',
    },
    listIcon: {
      fontSize: '16px',
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
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography classes={{ body2: classes.expansionHeading }}>Simulations</Typography>
            <Typography className={classes.expansionSecondaryHeading}>Current Simulation</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>

            <List dense disablePadding classes={{ root: classes.list }}>
              <ListItem key={1} dense button>
                <ListItemText primary='one' />
                <ListItemSecondaryAction>
                  <IconButton classes={{ root: classes.listIcon }}>
                    <MoreVertIcon fontSize='inherit' />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem key={2} dense button>
                <ListItemText primary='two' />
              </ListItem>
              <ListItem key={3} dense button>
                <ListItemText primary='three' />
              </ListItem>
              <ListItem key={4} dense button>
                <ListItemText primary='four' />
              </ListItem>
            </List>

          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography classes={{ body2: classes.expansionHeading }}>Executions</Typography>
            <Typography className={classes.expansionSecondaryHeading}>Current Execution</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>

            <List dense disablePadding classes={{ root: classes.list }}>
              <ListItem key={1} dense button>
                <ListItemText primary='one' />
              </ListItem>
              <ListItem key={2} dense button>
                <ListItemText primary='two' />
              </ListItem>
              <ListItem key={3} dense button>
                <ListItemText primary='three' />
              </ListItem>
              <ListItem key={4} dense button>
                <ListItemText primary='four' />
              </ListItem>
            </List>

          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography classes={{ body2: classes.expansionHeading }}>Renderings</Typography>
            <Typography className={classes.expansionSecondaryHeading}>Current Rendering</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>

            <List dense disablePadding classes={{ root: classes.list }}>
              <ListItem key={1} dense button>
                <ListItemText primary='one' />
              </ListItem>
              <ListItem key={2} dense button>
                <ListItemText primary='two' />
              </ListItem>
              <ListItem key={3} dense button>
                <ListItemText primary='three' />
              </ListItem>
              <ListItem key={4} dense button>
                <ListItemText primary='four' />
              </ListItem>
            </List>

          </ExpansionPanelDetails>
        </ExpansionPanel>
      </CardContent>
    );
  }
}

export default withStyles(styles)(View);
