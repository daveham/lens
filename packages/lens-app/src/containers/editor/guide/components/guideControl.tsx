import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
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
import ExpansionPanelActions from './ExpansionPanelActions';
import GuideMenu from './guideMenu';
import GuideListMenu from './guideListMenu';

import _debug from 'debug';
const debug = _debug('lens:editor:guideControl');

const styles: any = theme => {
  const { unit } = theme.spacing;
  const borderRadius = theme.shape.borderRadius * 2;
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
    badgeContent: {
      transform: 'scale(1) translate(-130%, 0%)',
      transformOrigin: '0% 0%',
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.dark,
      opacity: .6,
      right: 'auto',
    },
    expansionHeadingContainer: {
      flexBasis: '30%',
      flexShrink: 0,
      paddingLeft: unit * 2,
    },
    expansionHeading: {
      color: theme.palette.primary.contrastText,
      fontWeight: 500,
    },
    expansionSecondaryHeading: {
      color: theme.palette.primary.contrastText,
    },
    detailsContent: {
      width: '100%',
      transition: theme.transitions.create('height'),
    },
    list: {
      width: '100%',
      maxHeight: unit * 12,
      overflow: 'auto',
    },
    listItemContainer: {
      '&:last-child': {
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
      },
      '&:last-child $listItemRoot': {
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
      },
      '&:hover $listItemSecondaryAction': {
        visibility: 'inherit',
      },
    },
    listItemRoot: {
      backgroundColor: theme.palette.grey[100],
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
      '&$listItemSelected': {
        backgroundColor: theme.palette.secondary.light,
      },
      '&:hover$listItemSelected': {
        backgroundColor: theme.palette.grey[400],
      },
    },
    listItemSelected: {},
    listItemSecondaryAction: {
      visibility: 'hidden',
    },
    lockedPanelMessage: {
      padding: unit,
      width: '100%',
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
  submitEnabled?: boolean;
  onControlParametersChanged: (params: object, active: string, action: string) => void;
  onControlActionSubmit: () => void;
  onControlActionCancel: () => void;
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
  action?: string;
}

const KEY_SIMULATION = 'simulation';
const KEY_EXECUTION = 'execution';
const KEY_RENDERING = 'rendering';

export const controlSegmentKeys = {
  simulation: KEY_SIMULATION,
  execution: KEY_EXECUTION,
  rendering: KEY_RENDERING,
};

const KEY_SIMULATION_VIEW = 1001;
const KEY_SIMULATION_EDIT = 1002;
const KEY_SIMULATION_ADD_EXE = 1003;
const KEY_SIMULATION_DELETE = 1004;

const KEY_EXECUTION_VIEW = 2001;
const KEY_EXECUTION_EDIT = 2002;
const KEY_EXECUTION_RUN = 2003;
const KEY_EXECUTION_ADD_REN = 2004;
const KEY_EXECUTION_DELETE = 2005;

const KEY_RENDERING_VIEW = 3001;
const KEY_RENDERING_EDIT = 3002;
const KEY_RENDERING_RENDER = 3003;
const KEY_RENDERING_DELETE = 3004;

const panelDetails = {
  simulation: {
    title: 'Simulations',
    menuItems: [
      { label: 'View', value: KEY_SIMULATION_VIEW },
      { label: 'Edit', value: KEY_SIMULATION_EDIT, action: 'edit' },
      '-',
      { label: 'Add New Execution', value: KEY_SIMULATION_ADD_EXE, action: 'new' },
      '-',
      { label: 'Delete', value: KEY_SIMULATION_DELETE, action: 'delete' },
    ],
  },
  execution: {
    title: 'Executions',
    menuItems: [
      { label: 'View', value: KEY_EXECUTION_VIEW },
      { label: 'Edit', value: KEY_EXECUTION_EDIT, action: 'edit' },
      { label: 'Run', value: KEY_EXECUTION_RUN, action: 'run' },
      '-',
      { label: 'Add New Rendering', value: KEY_EXECUTION_ADD_REN, action: 'new' },
      '-',
      { label: 'Delete', value: KEY_EXECUTION_DELETE, action: 'delete' },
    ],
  },
  rendering: {
    title: 'Renderings',
    menuItems: [
      { label: 'View', value: KEY_RENDERING_VIEW },
      { label: 'Edit', value: KEY_RENDERING_EDIT, action: 'edit' },
      { label: 'Render', value: KEY_RENDERING_RENDER, action: 'run' },
      '-',
      { label: 'Delete', value: KEY_RENDERING_DELETE, action: 'delete' },
    ],
  },
};

const lockingActions = ['new', 'edit', 'delete'];

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

  return { activePanel, panelSelections, locked, action };
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

    const { panelSelections, activePanel, action } = this.state;
    if (
      simulations &&
      (prevState.panelSelections !== panelSelections ||
        prevState.activePanel !== activePanel ||
        prevState.action !== action)
    ) {
      const {
        simulation: { id: simulationId },
        execution: { id: executionId },
        rendering: { id: renderingId },
      } = panelSelections;

      this.props.onControlParametersChanged(
        {
          simulationId,
          executionId,
          renderingId,
        },
        activePanel,
        action || 'show',
      );
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

  private setSelectedItem = (key, item, changes = {}) => {
    this.setState(priorState => {
      const panelSelections = {
        ...priorState.panelSelections,
        [key]: item,
      };

      if (key === KEY_SIMULATION) {
        panelSelections[KEY_EXECUTION] = getFirstExecution(item);
        panelSelections[KEY_RENDERING] = getFirstRendering(panelSelections.execution);
      } else if (key === KEY_EXECUTION) {
        panelSelections[KEY_RENDERING] = getFirstRendering(item);
      }

      return {
        expandedPanel: null,
        activePanel: key,
        panelSelections,
        ...changes,
      };
    });
  };

  private handlePanelListItemChange = (key, item) => () => {
    debug('handlePanelListItemChange', { key, item, locked: this.state.locked });
    if (this.state.locked) {
      return;
    }

    const currentActiveItem = this.state.panelSelections[key];
    if (item === currentActiveItem) {
      debug('handlePanelListItemChange - same item', { currentActiveItem });
      return;
    }

    debug('handlePanelListItemChange', { from: currentActiveItem, to: item });
    this.setSelectedItem(key, item);
  };

  private handleGuideMenuSelection = menuItem => {
    debug('handleGuideMenuSelection', { menuItem });
  };

  private handleListMenuSelection = (key, itemIndex) => menuItem => {
    if (this.state.locked) {
      return;
    }

    const item = this.getItemsForKey(key)[itemIndex];

    debug('handleListMenuSelection', { key, item, menuItem });
    const actionChanges = this.getActionChangesForMenuItem(key, menuItem);
    this.setSelectedItem(key, item, actionChanges);
  };

  private handleCancelLock = () => {
    debug('handleCancelLock');
    this.setState({ locked: false, action: '' });
    this.props.onControlActionCancel();
  };

  private handleCommitLock = () => {
    debug('handleCommitLock');
    this.setState({ locked: false, action: '' });
    this.props.onControlActionSubmit();
  };

  // private handleListMenuEnter = (key, listIndex) => () => {
  //   debug('handleListMenuEnter', { key, listIndex });
  // };

  private getActionChangesForMenuItem = (key, menuItem) => {
    // const menuItem = panelDetails[key].menuItems.find(item => item.id ===)
    const { action } = menuItem;
    return action && lockingActions.includes(action) ? { locked: true, action } : {};
  };

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
    const { locked } = this.state;

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
            menuItems={[{ label: 'Add Simulation' }]}
            disabled={locked}
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

  private renderSimulationListItems(items, isPanelExpanded, currentItemId) {
    const { classes } = this.props;
    const listItemClasses = {
      root: classes.listItemRoot,
      container: classes.listItemContainer,
      selected: classes.listItemSelected,
    };
    return items.map((item, itemIndex) => (
      <ListItem
        classes={listItemClasses}
        key={item.id}
        onClick={this.handlePanelListItemChange(controlSegmentKeys.simulation, item)}
        dense
        button
        selected={isPanelExpanded && item.id === currentItemId}
      >
        <ListItemText primary={item.name} secondary='simulation details' />
        <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
          {this.renderListMenu(controlSegmentKeys.simulation, itemIndex)}
        </ListItemSecondaryAction>
      </ListItem>
    ));
  }

  private renderExecutionListItems(items, isPanelExpanded, currentItemId) {
    const { classes } = this.props;
    const listItemClasses = {
      root: classes.listItemRoot,
      container: classes.listItemContainer,
      selected: classes.listItemSelected,
    };
    return items.map((item, itemIndex) => (
      <ListItem
        classes={listItemClasses}
        key={item.id}
        onClick={this.handlePanelListItemChange(controlSegmentKeys.execution, item)}
        dense
        button
        selected={isPanelExpanded && item.id === currentItemId}
      >
        <ListItemText primary={item.name} secondary='execution details' />
        <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
          {this.renderListMenu(controlSegmentKeys.execution, itemIndex)}
        </ListItemSecondaryAction>
      </ListItem>
    ));
  }

  private renderRenderingListItems(items, isPanelExpanded, currentItemId) {
    const { classes } = this.props;
    const listItemClasses = {
      root: classes.listItemRoot,
      container: classes.listItemContainer,
      selected: classes.listItemSelected,
    };
    return items.map((item, itemIndex) => (
      <ListItem
        classes={listItemClasses}
        key={item.id}
        onClick={this.handlePanelListItemChange(controlSegmentKeys.rendering, item)}
        dense
        button
        selected={isPanelExpanded && item.id === currentItemId}
      >
        <ListItemText primary={item.name} secondary='rendering details' />
        <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
          {this.renderListMenu(controlSegmentKeys.rendering, itemIndex)}
        </ListItemSecondaryAction>
      </ListItem>
    ));
  }

  private renderListItems(key, items) {
    const { expandedPanel, panelSelections } = this.state;
    const { currentItem } = panelSelections[key];
    const currentItemId = currentItem ? currentItem.id : null;
    const isPanelExpanded = expandedPanel === key;

    if (key === controlSegmentKeys.simulation) {
      return this.renderSimulationListItems(items, isPanelExpanded, currentItemId);
    }
    if (key === controlSegmentKeys.execution) {
      return this.renderExecutionListItems(items, isPanelExpanded, currentItemId);
    }
    if (key === controlSegmentKeys.rendering) {
      return this.renderRenderingListItems(items, isPanelExpanded, currentItemId);
    }
  }

  private renderLockedDetails(key) {
    const { classes } = this.props;
    const { action } = this.state;
    let message;
    switch (action) {
      case 'new':
        message = `Add a new ${key}.`;
        break;
      case 'edit':
        message = `Edit the current ${key}.`;
        break;
      case 'delete':
        message = `Delete this ${key}?`;
        break;
      default:
        return null;
    }
    return (
      <ExpansionPanelDetails>
        <div className={classes.detailsContent}>
          <Typography className={classes.lockedPanelMessage} component='div' align='center'>
            {message}
          </Typography>
        </div>
      </ExpansionPanelDetails>
    );
  }

  private renderDetails(key, items) {
    const { classes } = this.props;
    const listItems = this.renderListItems(key, items);
    return (
      <ExpansionPanelDetails>
        <div className={classes.detailsContent}>
          <List dense disablePadding classes={{ root: classes.list }}>
            {listItems}
          </List>
        </div>
      </ExpansionPanelDetails>
    );
  }

  private renderActionsForNew() {
    return (
      <ExpansionPanelActions>
        <Button size='small' onClick={this.handleCancelLock}>
          Cancel
        </Button>
        <Button
          size='small'
          disabled={!this.props.submitEnabled}
          onClick={this.handleCommitLock}
          color='primary'
        >
          Add
        </Button>
      </ExpansionPanelActions>
    );
  }

  private renderActionsForEdit() {
    return (
      <ExpansionPanelActions>
        <Button size='small' onClick={this.handleCancelLock}>
          Cancel
        </Button>
        <Button
          size='small'
          disabled={!this.props.submitEnabled}
          onClick={this.handleCommitLock}
          color='primary'
        >
          Save
        </Button>
      </ExpansionPanelActions>
    );
  }

  private renderActionsForDelete() {
    return (
      <ExpansionPanelActions>
        <Button size='small' onClick={this.handleCancelLock}>
          Cancel
        </Button>
        <Button
          size='small'
          disabled={!this.props.submitEnabled}
          onClick={this.handleCommitLock}
          color='primary'
        >
          OK
        </Button>
      </ExpansionPanelActions>
    );
  }

  private renderActions() {
    const { action } = this.state;
    switch (action) {
      case 'new':
        return this.renderActionsForNew();
      case 'edit':
        return this.renderActionsForEdit();
      case 'delete':
        return this.renderActionsForDelete();
    }
  }

  private renderPanel(key, items) {
    const { classes } = this.props;
    const { expandedPanel, activePanel, panelSelections, locked } = this.state;
    const currentItem = panelSelections[key];
    const { title } = panelDetails[key];

    const isPanelLocked = locked && activePanel === key;
    const expanded = expandedPanel === key || isPanelLocked;
    debug('renderPanel', { key, isPanelLocked, activePanel, expanded });

    return (
      <ExpansionPanel expanded={expanded} onChange={this.handlePanelChange(key)}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.expansionHeadingContainer}>
            <Badge
              badgeContent={items.length}
              classes={{ badge: classes.badgeContent }}
            >
              <Typography classes={{ body2: classes.expansionHeading }}>{title}</Typography>
            </Badge>
          </div>
          {currentItem && (
            <Typography className={classes.expansionSecondaryHeading}>
              {currentItem.name}
            </Typography>
          )}
        </ExpansionPanelSummary>
        {isPanelLocked ? this.renderLockedDetails(key) : this.renderDetails(key, items)}
        {isPanelLocked && this.renderActions()}
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(GuideControl);