import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { withStyles } from '@material-ui/core/styles';

import { ISimulation, IExecution, IRendering } from 'editor/interfaces';
import { default as getConfig } from 'src/config';
import Loading from 'src/components/loading';

import ExpansionPanel from './ExpansionPanel';
import ExpansionPanelSummary from './ExpansionPanelSummary';
import ExpansionPanelDetails from './ExpansionPanelDetails';
import GuideMenu from './guideMenu';
import GuideListMenu from './guideListMenu';

import _debug from 'debug';
const debug = _debug('lens:editor:guideControl');

const styles: any = theme => {
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
    listItem: {
      '&:hover $listItemSecondaryAction': {
        visibility: 'inherit',
      },
    },
    listItemRoot: {
      backgroundColor: theme.palette.background.default,
      '&$listItemSelected': {
        backgroundColor: theme.palette.background.paper,
      },
    },
    listItemSelected: {},
    listItemSecondaryAction: {
      visibility: 'hidden',
    },
  };
};

interface IProps {
  classes?: any;
  action?: string;
  sourceId?: string;
  simulationId?: number;
  executionId?: number;
  renderingId?: number;
  title?: string;
  thumbnailUrl?: string;
  simulations?: ReadonlyArray<ISimulation>;
  onPathChanged: (path: string) => void;
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
  locked: boolean;
}

const KEY_SIMULATION = 'simulation';
const KEY_EXECUTION = 'execution';
const KEY_RENDERING = 'rendering';

const panelDetails = {
  simulation: {
    title: 'Simulations',
    menuItems: ['Edit', 'Add Execution', 'Delete'],
  },
  execution: {
    title: 'Executions',
    menuItems: ['Edit', 'Add Rendering', 'Delete'],
  },
  rendering: {
    title: 'Renderings',
    menuItems: ['Render', 'View', 'Delete'],
  },
};

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

function determineSelections(props) {
  const { simulations, simulationId = -1, executionId = -1, renderingId = -1, action } = props;

  let activePanel = null;
  if (renderingId > -1) {
    activePanel = KEY_RENDERING;
  } else if (executionId > -1) {
    activePanel = KEY_EXECUTION;
  } else if (simulationId > -1) {
    activePanel = KEY_SIMULATION;
  }

  const panelSelections = {
    simulation: null,
    execution: null,
    rendering: null,
  };
  if (simulations) {
    panelSelections.simulation = simulations.find(s => s.id === simulationId) || simulations[0];
    if (panelSelections.simulation) {
      const { executions } = panelSelections.simulation;
      panelSelections.execution = executions.find(e => e.id === executionId) || executions[0];
      if (panelSelections.execution) {
        const { renderings } = panelSelections.execution;
        panelSelections.rendering = renderings.find(r => r.id === renderingId) || renderings[0];
      }
    }
  }

  const locked = action === 'add' || action === 'edit' || action === 'delete';

  return { activePanel, panelSelections, locked };
}

export class GuideControl extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      expandedPanel: null,
      ...determineSelections(props),
    };
  }

  public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>): void {
    const { simulations } = this.props;
    if (simulations && !prevProps.simulations) {
      this.setState({ ...determineSelections(this.props) });
    }

    const { panelSelections, activePanel } = this.state;
    if (prevState.panelSelections !== panelSelections || prevState.activePanel !== activePanel) {
      if (simulations) {
        const { onPathChanged, sourceId } = this.props;
        const { simulation, execution, rendering } = panelSelections;

        if (
          activePanel !== prevState.activePanel ||
          rendering !== prevState.panelSelections.rendering ||
          execution !== prevState.panelSelections.execution ||
          simulation !== prevState.panelSelections.simulation
        ) {
          let path = `/Catalog/${sourceId}/Simulation/${simulation.id}`;
          if (activePanel !== KEY_SIMULATION) {
            path = `${path}/Execution/${execution.id}`;
          }
          if (activePanel === KEY_RENDERING) {
            path = `${path}/Rendering/${rendering.id}`;
          }
          path = `${path}/show`;
          onPathChanged(path);
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

  private handlePanelChange = key => (event, expanded) => {
    debug('handlePanelChange', { key, locked: this.state.locked });
    if (this.state.locked) {
      return;
    }

    const newState: any = {
      expandedPanel: expanded ? key : null,
    };
    if (!expanded) {
      newState.activePanel = key;
    }
    this.setState(newState);
  };

  private handlePanelListItemChange = (key, item) => () => {
    debug('handlePanelListItemChange', { key, item, locked: this.state.locked });
    if (this.state.locked) {
      return;
    }

    this.setState(priorState => {
      const panelSelections = {
        ...priorState.panelSelections,
        [key]: item,
      };

      if (key === KEY_SIMULATION) {
        panelSelections.execution = getFirstExecution(item);
        panelSelections.rendering = getFirstRendering(panelSelections.execution);
      } else if (key === KEY_EXECUTION) {
        panelSelections.rendering = getFirstRendering(item);
      }

      return {
        expandedPanel: null,
        activePanel: key,
        panelSelections,
      };
    });
  };

  private handleGuideMenuSelection = index => {
    debug('handleGuideMenuSelection', { index });
  };

  private handleListMenuSelection = (key, itemIndex) => menuIndex => {
    debug('handleListMenuSelection', { locked: this.state.locked });
    if (this.state.locked) {
      return;
    }

    const items = this.getItemsForKey(key);
    const item = items[itemIndex];
    if (this.state.panelSelections[key] !== item) {
      this.handlePanelListItemChange(key, item)();
    }
    this.setState({ locked: true });
    debug('handleListMenuSelection', { menuIndex });
  };

  // private handleListMenuEnter = (key, listIndex) => () => {
  //   debug('handleListMenuEnter', { key, listIndex });
  // };

  private getItemsForKey = key => {
    if (key === KEY_SIMULATION) {
      return this.props.simulations;
    }
    const { panelSelections } = this.state;
    if (key === KEY_EXECUTION) {
      return panelSelections[KEY_SIMULATION].executions;
    }
    return panelSelections[KEY_EXECUTION].renderings;
  };

  private renderHeader(): any {
    const { classes, thumbnailUrl, title } = this.props;

    const headerContent = thumbnailUrl ? null : <Loading pulse={true} />;

    return (
      <CardHeader
        classes={{
          root: classes.cardHeader,
          title: classes.cardHeaderTitle,
        }}
        avatar={<Avatar className={classes.avatar}>P</Avatar>}
        action={
          <GuideMenu
            onMenuSelection={this.handleGuideMenuSelection}
            menuItems={['Add Simulation']}
          />
        }
        title={title}
      >
        {headerContent}
      </CardHeader>
    );
  }

  private renderMedia(): any {
    const { classes, thumbnailUrl } = this.props;

    if (!thumbnailUrl) {
      return null;
    }

    const fullUrl =
      thumbnailUrl.indexOf('http') > -1 ? thumbnailUrl : `${getConfig().dataHost}${thumbnailUrl}`;

    return <CardMedia className={classes.media} image={fullUrl} />;
  }

  private renderContents(): any {
    const { classes, simulations } = this.props;

    if (!simulations) {
      return null;
    }

    const { simulation, execution } = this.state.panelSelections;
    const executions = simulation ? simulation.executions : [];
    const renderings = execution ? execution.renderings : [];

    return (
      <CardContent classes={{ root: classes.cardContent }}>
        {this.renderPanel(KEY_SIMULATION, simulations)}
        {this.renderPanel(KEY_EXECUTION, executions)}
        {this.renderPanel(KEY_RENDERING, renderings)}
      </CardContent>
    );
  }

  private renderListMenu(key, itemIndex) {
    const { menuItems } = panelDetails[key];
    return (
      <GuideListMenu
        id={`${key}-list-menu`}
        onMenuSelection={this.handleListMenuSelection(key, itemIndex)}
        menuItems={menuItems}
      />
    );
  }

  private renderListItems(key, items) {
    const { classes } = this.props;
    const { expandedPanel, panelSelections, locked } = this.state;
    const currentItem = panelSelections[key];

    return items.map((item, itemIndex) => {
      if (locked && expandedPanel === key && currentItem.id === item.id) {
        debug('renderListItems - render selected contents', { item });
      }
      return (
        <ListItem
          classes={{
            root: classes.listItemRoot,
            container: classes.listItem,
            selected: classes.listItemSelected,
          }}
          key={item.id}
          onClick={this.handlePanelListItemChange(key, item)}
          dense
          button
          selected={expandedPanel === key && item.id === currentItem.id}
        >
          <ListItemText primary={item.name} />
          <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
            {this.renderListMenu(key, itemIndex)}
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  }

  private renderPanel(key, items) {
    const { classes } = this.props;
    const { expandedPanel, activePanel, panelSelections, locked } = this.state;
    const currentItem = panelSelections[key];
    const { title } = panelDetails[key];

    const listItems = this.renderListItems(key, items);
    const expanded = expandedPanel === key || (locked && activePanel === key);

    return (
      <ExpansionPanel expanded={expanded} onChange={this.handlePanelChange(key)}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography classes={{ body2: classes.expansionHeading }}>{title}</Typography>
          {currentItem && (
            <Typography className={classes.expansionSecondaryHeading}>
              {currentItem.name}
            </Typography>
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
}

export default withStyles(styles)(GuideControl);
