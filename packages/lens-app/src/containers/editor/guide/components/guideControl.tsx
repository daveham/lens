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
import { Loading } from 'components/loading';

import ExpansionPanel from './ExpansionPanel';
import ExpansionPanelSummary from './ExpansionPanelSummary';
import ExpansionPanelDetails from './ExpansionPanelDetails';
import ExpansionPanelActions from './ExpansionPanelActions';
import GuideMenu from './guideMenu';
import GuideListMenu from './guideListMenu';

import _debug from 'debug';
const debug = _debug('lens:editor:guideControl');

const styles: any = theme => {
  const borderRadius = theme.shape.borderRadius * 2;
  return {
    root: {
      padding: theme.spacing(2),
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'column',
    },
    card: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      maxWidth: theme.spacing(50),
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
      padding: theme.spacing(1),
      '&:last-child': {
        padding: theme.spacing(1),
      },
    },
    badgeContent: {
      transform: 'scale(1) translate(-130%, 80%)',
      transformOrigin: '0% 0%',
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.dark,
      opacity: 0.5,
      right: 'auto',
    },
    expansionHeadingContainer: {
      width: '100%',
      paddingLeft: theme.spacing(2),
      position: 'relative',
      left: -4,
      top: -8,
    },
    expansionHeading: {
      color: theme.palette.primary.contrastText,
      fontWeight: 400,
      fontSize: '11px',
      opacity: 0.6,
    },
    expansionSecondaryHeading: {
      color: theme.palette.primary.contrastText,
      position: 'relative',
      left: 10,
      top: 0,
      fontWeight: 500,
      fontSize: '14px',
    },
    detailsContent: {
      width: '100%',
      transition: theme.transitions.create('height'),
    },
    list: {
      width: '100%',
      maxHeight: theme.spacing(12),
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
      padding: theme.spacing(1),
      width: '100%',
    },
  };
};

interface IProps {
  classes?: any;
  loading?: boolean;
  action?: string;
  sourceId?: string;
  simulationId?: number;
  executionId?: number;
  renderingId?: number;
  title?: string;
  thumbnailUrl?: string;
  simulations: ReadonlyArray<ISimulation>;
  submitEnabled?: boolean;
  onControlParametersChanged: (params: object, active?: string, action?: string) => void;
  onControlActionSubmit: () => void;
  onControlActionCancel: () => void;
}

interface IPanelSelections {
  simulation?: ISimulation;
  execution?: IExecution;
  rendering?: IRendering;
}

interface IState {
  expandedPanel: string;
  activePanel: string;
  panelSelections: IPanelSelections;
  locked: boolean;
  action: string;
  delayedAction: string;
  delayedUnlock: boolean;
}

const KEY_SIMULATION = 'simulation';
const KEY_EXECUTION = 'execution';
const KEY_RENDERING = 'rendering';

export const controlSegmentKeys = {
  simulation: KEY_SIMULATION,
  execution: KEY_EXECUTION,
  rendering: KEY_RENDERING,
};

export const controlSegmentActions = {
  new: 'new',
  edit: 'edit',
  delete: 'delete',
  run: 'run',
  render: 'render',
};

const KEY_SIMULATION_ADD = 1000;

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
      { label: 'Edit', value: KEY_SIMULATION_EDIT, action: controlSegmentActions.edit },
      '-',
      {
        label: 'Add New Execution',
        value: KEY_SIMULATION_ADD_EXE,
        action: controlSegmentActions.new,
      },
      '-',
      { label: 'Delete', value: KEY_SIMULATION_DELETE, action: controlSegmentActions.delete },
    ],
  },
  execution: {
    title: 'Executions',
    menuItems: [
      { label: 'View', value: KEY_EXECUTION_VIEW },
      { label: 'Edit', value: KEY_EXECUTION_EDIT, action: controlSegmentActions.edit },
      { label: 'Run', value: KEY_EXECUTION_RUN, action: controlSegmentActions.run },
      '-',
      {
        label: 'Add New Rendering',
        value: KEY_EXECUTION_ADD_REN,
        action: controlSegmentActions.new,
      },
      '-',
      { label: 'Delete', value: KEY_EXECUTION_DELETE, action: controlSegmentActions.delete },
    ],
  },
  rendering: {
    title: 'Renderings',
    menuItems: [
      { label: 'View', value: KEY_RENDERING_VIEW },
      { label: 'Edit', value: KEY_RENDERING_EDIT, action: controlSegmentActions.edit },
      { label: 'Render', value: KEY_RENDERING_RENDER, action: controlSegmentActions.run },
      '-',
      { label: 'Delete', value: KEY_RENDERING_DELETE, action: controlSegmentActions.delete },
    ],
  },
};

const lockingActions = [
  controlSegmentActions.new,
  controlSegmentActions.edit,
  controlSegmentActions.delete,
];

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

const emptyPanelSelections: IPanelSelections = {
  simulation: undefined,
  execution: undefined,
  rendering: undefined,
};

function determineSelections(props) {
  const {
    simulations,
    simulationId = '',
    executionId = '',
    renderingId = '',
    action,
  } = props;

  let simulation;
  let execution;
  let rendering;

  if (simulations) {
    simulation = simulations.find(s => s.id === simulationId) || simulations[0];
    if (simulation) {
      const { executions } = simulation;
      if (executions) {
        execution = executions.find(e => e.id === executionId) || executions[0];
        if (execution) {
          const { renderings } = execution;
          if (renderings) {
            rendering = renderings.find(r => r.id === renderingId) || renderings[0];
          }
        }
      }
    }
  }

  const isNewAction = action === controlSegmentActions.new;
  let activePanel: string = '';

  if (rendering || (execution && isNewAction)) {
    activePanel = KEY_RENDERING;
  } else if (execution || (simulation && isNewAction)) {
    activePanel = KEY_EXECUTION;
  } else if (simulation || isNewAction) {
    activePanel = KEY_SIMULATION;
  }

  const locked = lockingActions.includes(action);

  debug('determineSelections', {
    activePanel,
    simulation,
    execution,
    rendering,
    locked,
    action,
  });

  const panelSelections = simulation || execution || rendering
    ? { simulation, execution, rendering }
    : emptyPanelSelections;

  return {
    activePanel,
    panelSelections,
    locked,
    action,
  };
}

export class GuideControl extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      activePanel: '',
      expandedPanel: '',
      panelSelections: emptyPanelSelections,
      action: '',
      delayedAction: '',
      locked: false,
      delayedUnlock: false,
    };
  }

  public componentDidMount(): void {
    debug('componentDidMount');
    this.setState({ ...determineSelections(this.props) });
  }

  public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>): void {
    const {
      simulations,
      simulationId,
      executionId,
      renderingId,
    } = this.props;
    debug('componentDidUpdate', {
      propsAction: this.props.action,
      simulationId,
      executionId,
      renderingId,
    });

    if (simulations !== prevProps.simulations ||
      this.props.action !== prevProps.action) {
      debug('componentDidUpdate - change in props detected', {
        simulationsChanged: simulations !== prevProps.simulations,
        actionChanged: this.props.action !== prevProps.action,
      });
      this.setState({ ...determineSelections(this.props) });
      return;
    }

    const { panelSelections, activePanel, action, delayedAction, delayedUnlock } = this.state;
    debug('componentDidUpdate', { stateAction: action, delayedAction });
    if (
      (prevState.panelSelections !== panelSelections ||
        prevState.activePanel !== activePanel ||
        prevState.action !== action)
    ) {
      debug('componentDidUpdate - state changes', {
        panelSelections: prevState.panelSelections !== panelSelections,
        activePanel: prevState.activePanel !== activePanel,
        action: prevState.action !== action,
      });
      if (prevState.panelSelections !== panelSelections) {
        debug('componentDidUpdate - panelSelections from changes', {
          ...prevState.panelSelections,
        });
        debug('componentDidUpdate - panelSelections to changes', {
          ...panelSelections,
        });
      }
      const { simulation, execution, rendering } = panelSelections;
      this.props.onControlParametersChanged(
        {
          simulationId: simulation ? simulation.id : null,
          executionId: execution ? execution.id : null,
          renderingId: rendering ? rendering.id : null,
        },
        activePanel,
        action,
      );
    }

    if (delayedAction && !prevState.delayedAction) {
      // delay the transition to an action for animation purposes
      setTimeout(() => this.setState({ action: delayedAction, delayedAction: '' }), 250);
    }

    if (delayedUnlock && !prevState.delayedUnlock) {
      // delay the transition out of an action for animation purposes
      setTimeout(() => this.setState({ action: '', delayedUnlock: false }), 250);
    }
  }

  public render() {
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
      expandedPanel: expanded ? key : '',
    };
    if (!expanded) {
      newState.activePanel = key;
    }
    this.setState(newState);
  };

  private setSelectedItem = (key, item, changes = {}) => {
    debug('setSelectedItem', { key, item, changes });
    this.setState(prevState => {
      let panelSelections = {
        ...prevState.panelSelections,
        [key]: item,
      };
      if (!(panelSelections.simulation ||
        panelSelections.execution ||
        panelSelections.rendering)) {
        panelSelections = emptyPanelSelections;
      }

      if (key === KEY_SIMULATION) {
        panelSelections[KEY_EXECUTION] =
          item ? getFirstExecution(item) : undefined;
        panelSelections[KEY_RENDERING] =
          item ? getFirstRendering(panelSelections.execution) : undefined;
      } else if (key === KEY_EXECUTION) {
        panelSelections[KEY_RENDERING] =
          item ? getFirstRendering(item) : undefined;
      }

      return {
        expandedPanel: '',
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
    const { action } = menuItem;
    if (action === controlSegmentActions.new) {
      debug('create a new simulation item');
      this.setSelectedItem(controlSegmentKeys.simulation, null, { locked: true, action });
    }
  };

  private handleListMenuSelection = (key, itemIndex) => menuItem => {
    if (this.state.locked) {
      return;
    }

    const item = this.getItemsForKey(key)[itemIndex];
    debug('handleListMenuSelection', { key, item, menuItem });

    const { action } = menuItem;
    if (action === controlSegmentActions.new) {
      const lowerKey =
        key === controlSegmentKeys.execution
          ? controlSegmentKeys.rendering
          : controlSegmentKeys.execution;
      this.setSelectedItem(lowerKey, null, { locked: true, action });
    } else {
      const actionChanges =
        action && lockingActions.includes(action) ? { locked: true, delayedAction: action } : {};
      this.setSelectedItem(key, item, actionChanges);
    }
  };

  private handleCancelLock = () => {
    debug('handleCancelLock');
    this.setState({ locked: false, delayedUnlock: true });
    this.props.onControlActionCancel();
  };

  private handleCommitLock = () => {
    debug('handleCommitLock');
    this.setState({ locked: false, delayedUnlock: true });
    this.props.onControlActionSubmit();
  };

  private getItemsForKey = key => {
    if (key === KEY_SIMULATION) {
      return this.props.simulations || [];
    }
    const { panelSelections } = this.state;
    if (key === KEY_EXECUTION) {
      const simulation = panelSelections[KEY_SIMULATION];
      return simulation ? simulation.executions || [] : [];
    }
    const execution = panelSelections[KEY_EXECUTION];
    return execution ? execution.renderings || [] : [];
  };

  private renderHeader() {
    const {
      classes,
      thumbnailUrl,
      title,
      loading,
    } = this.props;
    const { locked } = this.state;

    const headerContent = thumbnailUrl ? null : <Loading pulse={true} />;
    const avatar = loading ? 'L' : 'P';

    return (
      <CardHeader
        classes={{
          root: classes.cardHeader,
          title: classes.cardHeaderTitle,
        }}
        avatar={<Avatar className={classes.avatar}>{avatar}</Avatar>}
        action={
          <GuideMenu
            onMenuSelection={this.handleGuideMenuSelection}
            menuItems={[
              {
                label: 'Add New Simulation',
                value: KEY_SIMULATION_ADD,
                action: controlSegmentActions.new,
              },
            ]}
            disabled={locked}
          />
        }
        title={title}
      >
        {headerContent}
      </CardHeader>
    );
  }

  private renderMedia() {
    const { classes, thumbnailUrl } = this.props;

    if (!thumbnailUrl) {
      return null;
    }

    const fullUrl =
      thumbnailUrl.indexOf('http') > -1 ? thumbnailUrl : `${getConfig().dataHost}${thumbnailUrl}`;

    return <CardMedia className={classes.media} image={fullUrl} />;
  }

  private renderContents() {
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
    const listItemClasses = {
      root: classes.listItemRoot,
      container: classes.listItemContainer,
      selected: classes.listItemSelected,
    };
    const { expandedPanel, panelSelections } = this.state;
    const currentItem = panelSelections[key];
    const currentItemId = currentItem ? currentItem.id : null;
    const isPanelExpanded = expandedPanel === key;

    return items.map((item, itemIndex) => (
      <ListItem
        classes={listItemClasses}
        key={item.id}
        onClick={this.handlePanelListItemChange(key, item)}
        dense
        button
        selected={isPanelExpanded && item.id === currentItemId}
      >
        <ListItemText primary={item.name} secondary={`${key} details`} />
        <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
          {this.renderListMenu(key, itemIndex)}
        </ListItemSecondaryAction>
      </ListItem>
    ));
  }

  private renderLockedDetails(key) {
    const { classes } = this.props;
    const { action } = this.state;
    let message;
    switch (action) {
      case controlSegmentActions.new:
        message = `Add a new ${key}.`;
        break;
      case controlSegmentActions.edit:
        message = `Edit the current ${key}.`;
        break;
      case controlSegmentActions.delete:
        message = `Delete this ${key}?`;
        break;
      case controlSegmentActions.run:
        message = `Run this ${key}?`;
        break;
      case controlSegmentActions.render:
        message = `Render this ${key}?`;
        break;
      default:
        return null;
    }
    return (
      <ExpansionPanelDetails>
        <div className={classes.detailsContent}>
          <Typography classes={{ root: classes.lockedPanelMessage }} component='div' align='center'>
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
    debug('renderActionsForNew', { submitEnabled: this.props.submitEnabled });
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
      case controlSegmentActions.new:
        return this.renderActionsForNew();
      case controlSegmentActions.edit:
        return this.renderActionsForEdit();
      case controlSegmentActions.delete:
      case controlSegmentActions.run:
      case controlSegmentActions.render:
        return this.renderActionsForDelete();
    }
  }

  private renderPanel(key, items) {
    const { classes } = this.props;
    const {
      expandedPanel,
      activePanel,
      panelSelections,
      locked,
      delayedAction,
      delayedUnlock,
    } = this.state;
    const currentItem = panelSelections[key];
    const { title } = panelDetails[key];

    const isPanelLocked = locked && activePanel === key;
    const expanded = !delayedAction && (expandedPanel === key || isPanelLocked);
    debug('renderPanel', { key, isPanelLocked, activePanel, expanded });

    return (
      <ExpansionPanel
        disabled={items.length === 0}
        expanded={expanded}
        onChange={this.handlePanelChange(key)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.expansionHeadingContainer}>
            <Badge badgeContent={items.length} classes={{ badge: classes.badgeContent }}>
              <Typography classes={{ body2: classes.expansionHeading }}>{title}</Typography>
            </Badge>
            {currentItem && (
              <Typography className={classes.expansionSecondaryHeading}>
                {currentItem.name}
              </Typography>
            )}
          </div>
        </ExpansionPanelSummary>
        {(isPanelLocked || delayedUnlock) && !delayedAction
          // locked details are rendered when the panel includes dialog buttons
          ? this.renderLockedDetails(key)
          // regular details are rendered when the panel includes information
          : this.renderDetails(key, items)}
        {(isPanelLocked || delayedUnlock) && this.renderActions()}
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(GuideControl);
