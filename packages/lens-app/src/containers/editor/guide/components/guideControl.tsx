import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles: any = makeStyles((theme: any) => {
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
      maxHeight: theme.spacing(16),
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
});

interface IProps {
  loading?: boolean;
  action?: string;
  simulationId: string;
  executionId: string;
  renderingId: string;
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

function determineSelections(
  simulations,
  simulationId,
  executionId,
  renderingId,
  action,
) {
  debug('determineSelections - input', {
    simulations,
    simulationId,
    executionId,
    renderingId,
    action,
  });
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

  // determine active panel based on Id's present in the URL
  const isNewAction = action === controlSegmentActions.new;
  let activePanel: string = '';

  if (renderingId || (executionId && isNewAction)) {
    activePanel = KEY_RENDERING;
  } else if (executionId || (simulationId && isNewAction)) {
    activePanel = KEY_EXECUTION;
  } else if (simulationId || isNewAction) {
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

  // set selected item for each panel (if there is one)
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

interface ISelectedItemChanges {
  locked?: boolean;
  action?: string;
  delayedAction?: string;
}

const GuideControl = (props: IProps) => {
  const classes = useStyles();

  const {
    simulations,
    simulationId,
    executionId,
    renderingId,
    action,
    onControlParametersChanged,
  } = props;

  const [activePanel, setActivePanel] = useState('');
  const [expandedPanel, setExpandedPanel] = useState('');
  const [panelSelections, setPanelSelections] = useState(emptyPanelSelections);
  const [nextAction, setNextAction] = useState('');
  const [delayedAction, setDelayedAction] = useState('');
  const [locked, lock] = useState(false);
  const [delayedUnlock, setDelayedUnlock] = useState(false);

  // useEffect(() => { setStateFromSelections(props); }, []);

  useEffect(() => {
    debug('useEffect to determine selections');
    const initialSelections = determineSelections(
      simulations, simulationId, executionId, renderingId, action,
    );
    setActivePanel(initialSelections.activePanel);
    setPanelSelections(initialSelections.panelSelections);
    lock(initialSelections.locked);
    setNextAction(initialSelections.action);
    }, [simulations, simulationId, executionId, renderingId, action]);

  useEffect(() => {
    debug('useEffect to report control parameter changes');
    const { simulation, execution, rendering } = panelSelections;
    onControlParametersChanged(
      {
        simulationId: simulation ? simulation.id : '',
        executionId: execution ? execution.id : '',
        renderingId: rendering ? rendering.id : '',
      },
      activePanel,
      nextAction,
    );
  }, [panelSelections, activePanel, nextAction, onControlParametersChanged]);

  useEffect(() => {
    debug('useEffect to process delayed action');
    if (delayedAction) {
      setTimeout(() => {
        setNextAction(delayedAction);
        setDelayedAction('');
      }, 250);
    }
  }, [delayedAction]);

  useEffect(() => {
    debug('useEffect to process delayed unlock');
    if (delayedUnlock) {
      setTimeout(() => {
        setDelayedUnlock(false);
        setNextAction('');
      }, 250);
    }
  }, [delayedUnlock]);

  const setSelectedItem = (key, item, changes: ISelectedItemChanges = {}) => {
    debug('setSelectedItem', { key, item, changes });

    let nextPanelSelections = {
      ...panelSelections,
      [key]: item,
    };

    // cascade selection
    if (key === KEY_SIMULATION) {
      nextPanelSelections.execution =
        item ? getFirstExecution(item) : undefined;
      nextPanelSelections.rendering =
        item ? getFirstRendering(nextPanelSelections.execution) : undefined;
    } else if (key === KEY_EXECUTION) {
      nextPanelSelections.rendering =
        item ? getFirstRendering(item) : undefined;
    }

    // preserve reference equality on empty selection
    if (!(nextPanelSelections.simulation ||
      nextPanelSelections.execution ||
      nextPanelSelections.rendering)) {
      nextPanelSelections = emptyPanelSelections;
    }

    setExpandedPanel('');
    setActivePanel(key);
    setPanelSelections(nextPanelSelections);

    if (changes.hasOwnProperty('locked') && locked !== changes.locked) {
      lock(changes.locked!);
    }
    if (changes.hasOwnProperty('action') && action !== changes.action) {
      setNextAction(changes.action!);
    }
    if (changes.hasOwnProperty('delayedAction') && delayedAction !== changes.delayedAction) {
      setDelayedAction(changes.delayedAction!);
    }
  };

  const getItemsForKey = key => {
    if (key === KEY_SIMULATION) {
      return simulations || [];
    }
    if (key === KEY_EXECUTION) {
      const simulation = panelSelections[KEY_SIMULATION];
      return simulation ? simulation.executions || [] : [];
    }
    const execution = panelSelections[KEY_EXECUTION];
    return execution ? execution.renderings || [] : [];
  };

  // called when panel expansion is toggled

  const handlePanelChange = key => (event, expanded) => {
    debug('handlePanelChange', { key, locked, expanded });
    if (locked) {
      // guide is locked, ignore any attempts to change
      return;
    }

    setExpandedPanel(expanded ? key : '');
    if (!expanded) {
      setActivePanel(key);
    }
  };

  const handleGuideMenuSelection = menuItem => {
    debug('handleGuideMenuSelection', { menuItem });
    const { action } = menuItem;
    if (action === controlSegmentActions.new) {
      debug('create a new simulation item');
      setSelectedItem(controlSegmentKeys.simulation, null, { locked: true, action });
    }
  };

  const handlePanelListItemChange = (key, item) => () => {
    debug('handlePanelListItemChange', { key, item, locked });
    if (locked) {
      return;
    }

    const currentActiveItem = panelSelections[key];
    if (item === currentActiveItem) {
      debug('handlePanelListItemChange - same item', { currentActiveItem });
      return;
    }

    debug('handlePanelListItemChange', { from: currentActiveItem, to: item });
    setSelectedItem(key, item);
  };

  const handleListMenuSelection = (key, itemIndex) => menuItem => {
    if (locked) {
      return;
    }

    const item = getItemsForKey(key)[itemIndex];
    debug('handleListMenuSelection', { key, item, menuItem });

    const { action } = menuItem;
    if (action === controlSegmentActions.new) {
      const lowerKey =
        key === controlSegmentKeys.execution
          ? controlSegmentKeys.rendering
          : controlSegmentKeys.execution;
      setSelectedItem(lowerKey, null, { locked: true, action });
    } else {
      const actionChanges =
        action && lockingActions.includes(action) ? { locked: true, delayedAction: action } : {};
      setSelectedItem(key, item, actionChanges);
    }
  };

  const handleCancelLock = () => {
    debug('handleCancelLock');
    lock(false);
    setDelayedUnlock(true);
    props.onControlActionCancel();
  };

  const handleCommitLock = () => {
    debug('handleCommitLock');
    lock(false);
    setDelayedUnlock(true);
    props.onControlActionSubmit();
  };

  const renderHeader = () => {
    const {
      thumbnailUrl,
      title,
      loading,
    } = props;

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
            onMenuSelection={handleGuideMenuSelection}
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
  };

  const renderLockedDetails = key => {
    let message;
    switch (nextAction) {
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

  const renderListMenu= (key, itemIndex) => {
    const { menuItems } = panelDetails[key];
    return (
      <GuideListMenu
        id={`${key}-list-menu`}
        onMenuSelection={handleListMenuSelection(key, itemIndex)}
        menuItems={menuItems}
      />
    );
  };

  const renderListItems = (key, items) => {
    const listItemClasses = {
      root: classes.listItemRoot,
      container: classes.listItemContainer,
      selected: classes.listItemSelected,
    };
    const currentItem = panelSelections[key];
    const currentItemId = currentItem ? currentItem.id : null;
    const isPanelExpanded = expandedPanel === key;

    return items.map((item, itemIndex) => (
      <ListItem
        classes={listItemClasses}
        key={item.id}
        onClick={handlePanelListItemChange(key, item)}
        dense
        button
        selected={isPanelExpanded && item.id === currentItemId}
      >
        <ListItemText primary={item.name} secondary={`${key} details`} />
        <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
          {renderListMenu(key, itemIndex)}
        </ListItemSecondaryAction>
      </ListItem>
    ));
  };

  const renderDetails = (key, items) => {
    const listItems = renderListItems(key, items);
    return (
      <ExpansionPanelDetails>
        <div className={classes.detailsContent}>
          <List dense disablePadding classes={{ root: classes.list }}>
            {listItems}
          </List>
        </div>
      </ExpansionPanelDetails>
    );
  };

  const renderMedia = () => {
    const { thumbnailUrl } = props;

    if (!thumbnailUrl) {
      return null;
    }

    const fullUrl = thumbnailUrl!.indexOf('http') > -1
      ? thumbnailUrl
      : `${getConfig().dataHost}${thumbnailUrl}`;

    return <CardMedia className={classes.media} image={fullUrl} />;
  };

  const renderActionsForNew = () => {
    debug('renderActionsForNew', { submitEnabled: props.submitEnabled });
    return (
      <ExpansionPanelActions>
        <Button size='small' onClick={handleCancelLock}>
          Cancel
        </Button>
        <Button
          size='small'
          disabled={!props.submitEnabled}
          onClick={handleCommitLock}
          color='primary'
        >
          Add
        </Button>
      </ExpansionPanelActions>
    );
  };

  const renderActionsForEdit = () => {
    return (
      <ExpansionPanelActions>
        <Button size='small' onClick={handleCancelLock}>
          Cancel
        </Button>
        <Button
          size='small'
          disabled={!props.submitEnabled}
          onClick={handleCommitLock}
          color='primary'
        >
          Save
        </Button>
      </ExpansionPanelActions>
    );
  }

  const renderActionsForDelete = () => {
    return (
      <ExpansionPanelActions>
        <Button size='small' onClick={handleCancelLock}>
          Cancel
        </Button>
        <Button
          size='small'
          disabled={!props.submitEnabled}
          onClick={handleCommitLock}
          color='primary'
        >
          OK
        </Button>
      </ExpansionPanelActions>
    );
  }

  const renderActions = () => {
    switch (nextAction) {
      case controlSegmentActions.new:
        return renderActionsForNew();
      case controlSegmentActions.edit:
        return renderActionsForEdit();
      case controlSegmentActions.delete:
      case controlSegmentActions.run:
      case controlSegmentActions.render:
        return renderActionsForDelete();
    }
  };

  const renderPanel = (key, items) => {
    const currentItem = panelSelections[key];
    const { title } = panelDetails[key];

    const isPanelActive = activePanel === key;
    const isPanelLocked = isPanelActive && locked;
    const isPanelExpanded = !delayedAction && (expandedPanel === key || isPanelLocked);
    debug('renderPanel', {
      key,
      isPanelActive,
      isPanelLocked,
      isPanelExpanded });

    return (
      <ExpansionPanel
        disabled={items.length === 0}
        expanded={isPanelExpanded}
        onChange={handlePanelChange(key)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.expansionHeadingContainer}>
            <Badge badgeContent={items.length} classes={{ badge: classes.badgeContent }}>
              <Typography classes={{ body1: classes.expansionHeading }}>{title}</Typography>
            </Badge>
            {currentItem && (
              <Typography className={classes.expansionSecondaryHeading}>
                {currentItem.name}
              </Typography>
            )}
          </div>
        </ExpansionPanelSummary>
        {isPanelActive && (locked || delayedUnlock) && !delayedAction
          // locked details are rendered when the panel includes dialog buttons
          ? renderLockedDetails(key)
          // regular details are rendered when the panel includes information
          : renderDetails(key, items)}
        {isPanelActive && (locked || delayedUnlock) && renderActions()}
      </ExpansionPanel>
    );
  };

  const renderContents = () => {
    if (!simulations) {
      return null;
    }

    const { simulation, execution } = panelSelections;
    const executions = simulation ? simulation!.executions : [];
    const renderings = execution ? execution!.renderings : [];

    return (
      <CardContent classes={{ root: classes.cardContent }}>
        {renderPanel(KEY_SIMULATION, simulations)}
        {renderPanel(KEY_EXECUTION, executions)}
        {renderPanel(KEY_RENDERING, renderings)}
      </CardContent>
    );
  }

  debug('render');
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        {renderHeader()}
        {renderMedia()}
        {renderContents()}
      </Card>
    </div>
  );
};

export default GuideControl;
