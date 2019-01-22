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
import {
  ISimulation,
  IExecution,
  IRendering,
} from 'editor/interfaces';
import { default as getConfig } from 'src/config';
import Loading from 'src/components/loading';

import { withStyles } from '@material-ui/core/styles';

import _debug from 'debug';
const debug = _debug('lens:editor:guide');

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
  simulations?: ReadonlyArray<ISimulation>;
}

interface IPanelSelections {
  simulation?: ISimulation;
  execution?: IExecution;
  rendering?: IRendering;
}

interface IState {
  expandedPanel?: string;
  activePanel?: string;
  panelSelections: IPanelSelections;
}

const panelTitles = {
  simulation: 'Simulations',
  execution: 'Executions',
  rendering: 'Renderings',
};

function panelKeyFromTitle(title) {
  return title === panelTitles.simulation
    ? 'simulation'
    : title === panelTitles.execution
      ? 'execution'
      : 'rendering';
}

function getFirstExecution(simulation) {
  if (simulation) {
    const { executions } = simulation;
    if (executions && executions.length) {
      return executions[0];
    }
  }
  return null;
}

function getFirstRendering(execution) {
  if (execution) {
    const { renderings } = execution;
    if (renderings && renderings.length) {
      return renderings[0];
    }
  }
  return null;
}

class View extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      expandedPanel: null,
      ...this.determineSelectionsFromRoute(props),
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
    if (this.props.simulations && !prevProps.simulations) {
      this.setState({ ...this.determineSelectionsFromRoute(this.props) });
    }

    const { panelSelections, activePanel } = this.state;
    if (prevState.panelSelections !== panelSelections || prevState.activePanel !== activePanel) {
      const { match, history, simulations } = this.props;

      if (simulations) {
        const { params: { sourceId } } = match;
        const { simulation, execution, rendering } = panelSelections;

        const {
          simulation: prevSimulation,
          execution: prevExecution,
          rendering: prevRendering,
        } = prevState.panelSelections;

        if (rendering !== prevRendering ||
          execution !== prevExecution ||
          simulation !== prevSimulation ||
          activePanel !== prevState.activePanel) {
          let url = `/Catalog/${sourceId}/Simulation/${simulation.id}`;
          if (activePanel !== panelTitles.simulation) {
            url = `${url}/Execution/${execution.id}`;
          }
          if (activePanel === panelTitles.rendering) {
            url = `${url}/Rendering/${rendering.id}`;
          }
          url = `${url}/show`;
          history.push(url);
        }
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
          {this.renderContents()}
        </Card>
      </div>
    );
  }

  private handlePanelChange = (panel) => (event, expanded) => {
    debug('handlePanelChange', { panel });
    const newState: any = {
      expandedPanel: expanded ? panel : null,
    };
    if (!expanded) {
      newState.activePanel = panel;
    }
    this.setState(newState);
  };

  private handlePanelListItemChange = (panel, item) => () => {
    const key = panelKeyFromTitle(panel);
    debug('handlePanelListItemChange', { panel, key, item });
    this.setState((priorState) => {
      const panelSelections = {
        ...priorState.panelSelections,
        [key]: item,
      };

      if (panel === panelTitles.simulation) {
        panelSelections.execution = getFirstExecution(item);
        panelSelections.rendering = getFirstRendering(panelSelections.execution);
      } else if (panel === panelTitles.execution) {
        panelSelections.rendering = getFirstRendering(item);
      }

      return {
        expandedPanel: null,
        activePanel: panel,
        panelSelections,
      };
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

  private renderContents(): any {
    const {
      classes,
      simulations,
    } = this.props;

    if (!simulations) {
      return null;
    }

    const { simulation, execution } = this.state.panelSelections;
    const executions = simulation ? simulation.executions : [];
    const renderings = execution ? execution.renderings : [];

    return (
      <CardContent classes={{ root: classes.cardContent }}>
        {this.renderContentsPanel(panelTitles.simulation, simulations)}
        {this.renderContentsPanel(panelTitles.execution, executions)}
        {this.renderContentsPanel(panelTitles.rendering, renderings)}
      </CardContent>
    );
  }

  private renderContentsPanel(title, items): any {
    const { classes } = this.props;
    const { expandedPanel } = this.state;
    const key = panelKeyFromTitle(title);
    const currentItem = this.state.panelSelections[key];

    const listItems = items.map((item) => (
      <ListItem
        key={item.id}
        onClick={this.handlePanelListItemChange(title, item)}
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
          {currentItem && (
            <Typography className={classes.expansionSecondaryHeading}>{currentItem.name}</Typography>
          )}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List dense disablePadding classes={{ root: classes.list }}>
            {listItems}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  private determineSelectionsFromRoute(props) {
    const { simulations, match: { params: {
      simulationId = -1,
      executionId = -1,
      renderingId = -1,
    } } } = props;
    debug('determineSelectionsFromRoute', { simulationId, executionId, renderingId });

    const panelSelections = {
      simulation: null,
      execution: null,
      rendering: null,
    };
    let activePanel = null;
    if (renderingId > -1) {
      activePanel = panelTitles.rendering;
    } else if (executionId > -1) {
      activePanel = panelTitles.execution;
    } else if (simulationId > -1) {
      activePanel = panelTitles.simulation;
    }

    if (simulations) {
      panelSelections.simulation = simulations.find((s) => s.id === simulationId);
      if (panelSelections.simulation) {
        const { executions } = panelSelections.simulation;
        panelSelections.execution = executions.find((e) => e.id === executionId) || executions[0];
        if (panelSelections.execution) {
          const { renderings } = panelSelections.execution;
          panelSelections.rendering = renderings.find((r) => r.id === renderingId) || renderings[0];
        }
      }
    }
    return { activePanel, panelSelections };
  }
}

export default withStyles(styles)(View);
