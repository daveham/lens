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
  history: any;
  match: any;
  photo?: string;
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: {[imageDescriptor: string]: IThumbnailDescriptor}) => void;
  ensureEditorTitle: (sourceId?: string) => void;
}

interface IPanelSelections {
  simulationIndex?: number;
  executionIndex?: number;
  renderingIndex?: number;
}

interface IState {
  expandedPanel?: any;
  panelSelections: IPanelSelections;
}

function createMockData({ id, name, renderingsPerExecution}) {
  return {
    id,
    name,
    executions: renderingsPerExecution.map((rpe, executionIndex) => ({
      id: executionIndex + 1,
      name: `Execution ${id}.${executionIndex + 1}`,
      renderings: Array.from({ length: rpe }, (v, renderingIndex) => ({
        id: renderingIndex + 1,
        name: `Rendering ${id}.${executionIndex + 1}.${renderingIndex + 1}`,
      }))
    }))
  };
}

const mockData = {
  simulations: [{
    id: 1,
    name: 'Simulation One',
    renderingsPerExecution: [2, 5, 3],
  }, {
    id: 2,
    name: 'Simulation Two',
    renderingsPerExecution: [7, 2, 8],
  }, {
    id: 3,
    name: 'Simulation Three',
    renderingsPerExecution: [1, 8, 2],
  }, {
    id: 4,
    name: 'Simulation Four',
    renderingsPerExecution: [9, 15, 11],
  }].map((spec) => createMockData(spec))
};

function panelKeyFromTitle(title) {
  return title === 'Simulations'
    ? 'simulationIndex'
    : title === 'Executions'
      ? 'executionIndex'
      : 'renderingIndex';
}

class View extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      expandedPanel: null,
      panelSelections: {},
    };
  }

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

  public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>): void {
    const { panelSelections } = this.state;
    if (prevState.panelSelections !== panelSelections) {
      const { match, history } = this.props;
      const { params: { sourceId } } = match;

      const { simulationIndex = 0, executionIndex = 0, renderingIndex = 0 } = panelSelections;
      const simulation = mockData.simulations[simulationIndex];
      const execution = simulation.executions[executionIndex];
      const rendering = execution.renderings[renderingIndex];

      if (simulationIndex !== prevState.panelSelections.simulationIndex) {
        history.push(`/Catalog/${sourceId}/Simulation/${simulation.id}/show`);
      } else if (executionIndex !== prevState.panelSelections.executionIndex) {
        history.push(`/Catalog/${sourceId}/Simulation/${simulation.id}/Execution` +
          `/${execution.id}/show`);
      } else if (renderingIndex !== prevState.panelSelections.renderingIndex) {
        history.push(`/Catalog/${sourceId}/Simulation/${simulation.id}` +
          `/Execution/${execution.id}/Rendering/${rendering.id}/show`);
      }
    }
  }

  public render(): any {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          {this.renderHeader()}
          {this.renderMedia()}
          {this.renderContents(mockData)}
        </Card>
      </div>
    );
  }

  private handlePanelChange = (panel) => (event, expanded) => {
    this.setState({
      expandedPanel: expanded ? panel : null,
    });
  };

  private handlePanelListItemChange = (panel, index) => () => {
    this.setState((priorState) => {
      const key = panelKeyFromTitle(panel);
      const newState = {
        expandedPanel: null,
        panelSelections: {
          ...priorState.panelSelections,
          [key]: index,
        }
      };
      if (panel !== 'Renderings') {
        newState.panelSelections.renderingIndex = 0;
      }
      if (panel === 'Simulations') {
        newState.panelSelections.executionIndex = 0;
      }
      return newState;
    });
  };

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

    if (!thumbnailUrl) {
      return null;
    }

    const fullUrl = `${getConfig().dataHost}${thumbnailUrl}`;

    return (
      <CardMedia
        className={classes.media}
        image={fullUrl}
      />
    );
  }

  private renderContents(data): any {
    const {
      classes,
      thumbnailUrl,
    } = this.props;

    if (!thumbnailUrl) {
      return null;
    }

    const { simulationIndex = 0, executionIndex = 0 } = this.state.panelSelections;
    const currentSimulation = data.simulations[simulationIndex];
    const currentExecution = currentSimulation.executions[executionIndex];

    return (
      <CardContent classes={{ root: classes.cardContent }}>
        {this.renderContentsPanel('Simulations', data.simulations)}
        {this.renderContentsPanel('Executions', currentSimulation.executions)}
        {this.renderContentsPanel('Renderings', currentExecution.renderings)}
      </CardContent>
    );
  }

  private renderContentsPanel(title, items): any {
    const { classes } = this.props;
    const { expandedPanel } = this.state;

    const key = panelKeyFromTitle(title);
    const currentIndex = this.state.panelSelections[key] || 0;

    const listItems = items.map((item, index) => (
      <ListItem
        key={index}
        onClick={this.handlePanelListItemChange(title, index)}
        dense
        button
      >
        <ListItemText primary={item.name} />
        <ListItemSecondaryAction>
          <IconButton classes={{ root: classes.listIcon }}>
            <MoreVertIcon fontSize='inherit' />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ));

    return (
      <ExpansionPanel
        expanded={expandedPanel === title}
        onChange={this.handlePanelChange(title)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography classes={{ body2: classes.expansionHeading }}>{title}</Typography>
          <Typography className={classes.expansionSecondaryHeading}>{items[currentIndex].name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List dense disablePadding classes={{ root: classes.list }}>
            {listItems}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(View);
