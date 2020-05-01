import React, { useReducer, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { ISimulation, IExecution, IRendering } from 'editor/interfaces';
import { default as getConfig } from 'src/config';
import { Loading } from 'components/loading';

import {
  operationPendingSelector,
  selectedExecutionSelector,
  selectedRenderingSelector,
  selectedSimulationSelector,
} from 'editor/modules/selectors';

import { usePrevious } from 'helpers/usePrevious';
import ExpansionPanel from './ExpansionPanel';
import ExpansionPanelSummary from './ExpansionPanelSummary';
import ExpansionPanelDetails from './ExpansionPanelDetails';
import {
  KEY_SIMULATION_ADD,
  controlSegmentKeys,
  controlSegmentActions,
  panelDetails,
  lockingActions,
} from './guideConstants';
import GuideMenu from './guideMenu';
import GuideListMenu from './guideListMenu';
import { reduxActionForCancelOperation, reduxActionForFinishOperation } from '../utils';

import getDebugLog from './debugLog';
const debug = getDebugLog('guideControl');

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
    avatarWrapper: {
      position: 'relative',
    },
    avatar: {
      backgroundColor: theme.palette.secondary.main,
    },
    avatarProgress: {
      color: theme.palette.primary.light,
      position: 'absolute',
      zIndex: 1,
      top: -4,
      left: -4,
    },
    cardContent: {
      backgroundColor: 'inherit',
      color: 'inherit',
      padding: theme.spacing(1),
      '&:last-child': {
        padding: theme.spacing(1),
      },
    },
    actionPaper: {
      margin: theme.spacing(1),
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

const animationDelay = 400;

interface IProps {
  loading?: boolean;
  title?: string;
  thumbnailUrl?: string;
  simulations: ReadonlyArray<ISimulation>;
  simulation?: ISimulation;
  execution?: IExecution;
  rendering?: IRendering;
  action?: string;
  activeItem?: string;
  submitEnabled?: boolean;
  onControlChanged: (path: string) => void;
}

interface IGuideParameters {
  simulations: ReadonlyArray<ISimulation>;
  simulation?: ISimulation;
  execution?: IExecution;
  rendering?: IRendering;
  activeItem?: string;
  action?: string;
  renderLockedAction?: string;
  renderLockedItem?: string;
  expandedPanel?: string;
  locked: boolean;
  nextPath?: string;
}

const initialGuideParameters: IGuideParameters = {
  simulations: [],
  activeItem: '',
  action: '',
  renderLockedAction: '',
  renderLockedItem: '',
  expandedPanel: '',
  locked: false,
  nextPath: '',
};

const guideActions = {
  setExpandedPanel: 'SET_EXPANDED_PANEL',
  calculateNextPathAtEndOfOperation: 'CALCULATE_NEXT_PATH_AT_END_OF_OPERATION',
  calculateNextPathOnGuideMenuSelection: 'CALCULATE_NEXT_PATH_ON_GUIDE_MENU_SELECTION',
  calculateNextPathOnListMenuSelection: 'CALCULATE_NEXT_PATH_ON_LIST_MENU_SELECTION',
  calculateNextPathOnPanelListItemChange: 'CALCULATE_NEXT_PATH_ON_PANEL_LIST_ITEM_CHANGE',
  updateFromProps: 'UPDATE_FROM_PROPS',
};

function parentKeyFor(key) {
  if (key === controlSegmentKeys.rendering) {
    return controlSegmentKeys.execution;
  }
  return controlSegmentKeys.simulation;
}

const resolvePath = (nextActiveItem, nextAction, nextActiveId, simulation, execution) => {
  let nextPath = 'Simulation';
  if (nextActiveItem === controlSegmentKeys.execution) {
    nextPath = `${nextPath}/${simulation.id}/Execution`;
  } else if (nextActiveItem === controlSegmentKeys.rendering) {
    nextPath = `${nextPath}/${simulation.id}/Execution/${execution.id}/Rendering`;
  }

  if (nextAction === controlSegmentActions.new) {
    nextPath = `${nextPath}/${nextAction}`;
  } else if (nextActiveId) {
    nextPath = `${nextPath}/${nextActiveId}`;
    if (nextAction) {
      nextPath = `${nextPath}/${nextAction}`;
    }
  }
  debug('resolvePath', { nextPath });
  return nextPath;
};

const determineNextPathAtEndOfOperation = (payload) => {
  const {
    activeItem, // one of controlSegmentKeys: simulation | execution | rendering
    lastAction = '', // one of controlSegmentActions: view | edit | new | delete
    actionFinishedBy = '', // one of: commit | cancel | ''
  } = payload;

  debug('determineNextPathAtEndOfOperation - inputs', {
    activeItem,
    lastAction,
    actionFinishedBy,
  });

  let nextActiveItem = activeItem;
  let nextActiveId = payload[activeItem] ? payload[activeItem].id : '';
  const nextAction = ''; // controlSegmentActions.view;

  debug('determineNextPathAtEndOfOperation - before resolve', { nextActiveItem, nextActiveId });

  if (lastAction && actionFinishedBy) {
    if (lastAction === controlSegmentActions.new) {
      // /sim/new or /sim/x/exe/new or /sim/x/exe/y/ren/new
      //   if commit, /sim/x` or /sim/x/exe/y` or /sim/x/exe/y/ren/z`
      //   if cancel, /sim/n or /sim/x/exe/o or /sim/x/exe/y/ren/p
      if (actionFinishedBy === 'commit') {
        // commit new
        // use key and payload[key].id
        //  defaults should work here, assuming id is not changed by db layer
      } else {
        // cancel new
        // use parent key and payload[parent key].id or first available sim
        nextActiveItem = parentKeyFor(activeItem);
        if (activeItem === nextActiveItem) {
          nextActiveId = payload.simulations.length ? payload.simulations[0].id : '';
        } else {
          nextActiveId = payload[nextActiveItem].id;
        }
      }
    } else if (lastAction === controlSegmentActions.delete) {
      // /sim/x/delete or /sim/x/exe/y/delete or /sim/x/exe/y/ren/z/delete
      //    if commit, /sim/n or /sim/x/exe/o or /sim/x/exe/y/ren/p
      //    if cancel, /sim/x or /sim/x/exe/y or /sim/x/exe/y/ren/z
      if (actionFinishedBy === 'commit') {
        // commit delete
        // select prior sibling if exists, otherwise select parent
        // use parent key and payload[parent key].id
        const parentItem = parentKeyFor(activeItem);
        const deletedItemCreated = payload[activeItem].created;
        const activeCollection = parentItem === activeItem ? payload.simulations : payload[parentItem][`${activeItem}s`];
        const nextItem = activeCollection.find(i => i.created > deletedItemCreated && i.id !== nextActiveId);
        if (nextItem) {
          nextActiveId = nextItem.id;
        } else {
          nextActiveItem = parentItem;
          nextActiveId = payload[parentItem].id;
        }
      } else {
        // cancel delete
        // use key and payload[key].id
        // defaults will work here
      }
    }
  }

  debug('determineNextPathAtEndOfOperation - resolve next', { nextActiveItem, nextActiveId });
  return resolvePath(nextActiveItem, nextAction, nextActiveId, payload.simulation, payload.execution);
};

// currently only used for new simulation
const determineNextPathOnGuideMenuSelection = ({ key, action, simulation, execution }) =>
  resolvePath(key, action, '', simulation, execution);

const determineNextPathOnPanelListItemChange = ({ key, nextId, simulation, execution }) =>
  resolvePath(key, '', nextId, simulation, execution);

const determineNextPathOnListMenuSelection = ({ key, nextId, action, simulation, execution }) =>
  resolvePath(key, action, nextId, simulation, execution);

const GuideControl = (props: IProps) => {
  const {
    simulations,
    simulation,
    execution,
    rendering,
    activeItem,
    action,
    onControlChanged,
  } = props;

  // hooks
  const dispatch = useDispatch();

  const selectedSimulation = useSelector(selectedSimulationSelector);
  const selectedExecution = useSelector(selectedExecutionSelector);
  const selectedRendering = useSelector(selectedRenderingSelector);

  const operationPending = useSelector(operationPendingSelector);
  const previousOperationPending = usePrevious(operationPending);

  const [collapseIn, setCollapseIn] = useState(false);

  const [guideParameters, dispatchGuideParameters] = useReducer((state, { type, payload }) => {
    debug('guideParametersReducer', { type });
    switch (type) {
      case guideActions.updateFromProps: {
        const { action, activeItem } = payload;
        const nextState = {
          ...state,
          ...payload,
        };
        let locked = false;
        if (payload.hasOwnProperty('action')) {
          locked = Boolean(action && lockingActions.includes(action));
          if (locked) {
            nextState.renderLockedAction = action;
          }
        }
        if (payload.hasOwnProperty('activeItem')) {
          if (locked) {
            nextState.renderLockedItem = activeItem;
          }
        }
        nextState.locked = locked;
        return nextState;
      }
      case guideActions.setExpandedPanel:
        return {
          ...state,
          expandedPanel: payload,
        };
      case guideActions.calculateNextPathAtEndOfOperation:
        return {
          ...state,
          nextPath: determineNextPathAtEndOfOperation({
            ...payload,
            activeItem,
            simulations,
            simulation: selectedSimulation,
            execution: selectedExecution,
            rendering: selectedRendering,
          }),
        };
      case guideActions.calculateNextPathOnGuideMenuSelection:
        return {
          ...state,
          nextPath: determineNextPathOnGuideMenuSelection({
            ...payload,
            simulations,
            simulation: state.simulation,
            execution: state.execution,
            rendering: state.rendering,
          }),
        };
      case guideActions.calculateNextPathOnPanelListItemChange:
        return {
          ...state,
          nextPath: determineNextPathOnPanelListItemChange({
            ...payload,
            simulations,
            simulation: state.simulation,
            execution: state.execution,
            rendering: state.rendering,
          }),
        };
      case guideActions.calculateNextPathOnListMenuSelection:
        return {
          ...state,
          nextPath: determineNextPathOnListMenuSelection({
            ...payload,
            simulations,
            simulation: state.simulation,
            execution: state.execution,
            rendering: state.rendering,
          }),
        };
      default:
        throw new Error();
    }
  }, initialGuideParameters);
  const previousSimulationsLength = usePrevious(
    guideParameters.simulations ? guideParameters.simulations.length : 0,
  );

  debug('on render', {
    guideParameters,
    operationPending,
    previousOperationPending,
    collapseIn,
    previousSimulationsLength,
    props,
  });

  const lastAction = useRef(action);
  const actionFinishedBy = useRef('');

  // update rendered control parameters from prop changes
  useEffect(() => {
    debug('useEffect(props) props changed', {
      simulations,
      simulation,
      execution,
      rendering,
      activeItem,
      action,
    });
    dispatchGuideParameters({
      type: guideActions.updateFromProps,
      payload: {
        simulations,
        simulation,
        execution,
        rendering,
        activeItem, // one of controlSegmentKeys: simulation | execution | rendering
        action, // one of controlSegmentActions: view | edit | new | delete
      },
    });
  }, [simulations, simulation, execution, rendering, activeItem, action]);

  // when current operation completes, trigger panel update and path calculation
  useEffect(() => {
    if (previousOperationPending && !operationPending) {
      dispatchGuideParameters({
        type: guideActions.calculateNextPathAtEndOfOperation,
        payload: {
          lastAction: lastAction.current,
          actionFinishedBy: actionFinishedBy.current,
        },
      });
    }
  }, [operationPending, previousOperationPending]);

  // if nextPath has changed, notify parent control which handles routing.
  useEffect(() => {
    if (guideParameters.nextPath) {
      debug('useEffect(gpNextPath) invoke onControlChanged', {
        nextPath: guideParameters.nextPath,
      });
      onControlChanged(guideParameters.nextPath);
    }
  }, [guideParameters.nextPath, onControlChanged]);

  // sometimes delay the expanded panel setting to allow time for animation
  const expandedPanelTimerActive = useRef(false);
  useEffect(() => {
    if (expandedPanelTimerActive.current) {
      return;
    }
    const nextSimulationsLength = guideParameters.simulations.length;
    const nextExpandedPanel = nextSimulationsLength ? guideParameters.activeItem : '';
    const lastExpandedPanel = guideParameters.expandedPanel;
    debug('useEffect(expandedPanel)', {
      nextSimulationsLength,
      nextExpandedPanel,
      lastExpandedPanel,
    });
    if (nextExpandedPanel !== lastExpandedPanel) {
      if (!previousSimulationsLength && nextSimulationsLength) {
        expandedPanelTimerActive.current = true;
        debug('useEffect(expandPanel) - set timer', { nextExpandedPanel });
        setTimeout(() => {
          expandedPanelTimerActive.current = false;
          debug('useEffect(expandPanel) - on timer', { nextExpandedPanel });
          dispatchGuideParameters({
            type: guideActions.setExpandedPanel,
            payload: nextExpandedPanel,
          });
        }, animationDelay);
      }
    }
  }, [
    guideParameters.activeItem,
    guideParameters.expandedPanel,
    simulations,
    previousSimulationsLength,
    guideParameters.simulations.length,
  ]);

  // sometimes delay the collapse of dialog controls to allow time for animation
  const collapseTimerActive = useRef(false);
  useEffect(() => {
    if (operationPending || collapseTimerActive.current) {
      return;
    }
    const nextCollapseIn = Boolean(guideParameters.locked && guideParameters.simulations);
    debug('useEffect(collapse)', {
      locked: guideParameters.locked,
      simulations: guideParameters.simulations,
      nextCollapseIn,
    });
    if (nextCollapseIn !== collapseIn) {
      collapseTimerActive.current = true;
      debug('useEffect(collapse) - set timer', { nextCollapseIn });
      setTimeout(() => {
        collapseTimerActive.current = false;
        debug('useEffect(collapse) - on timer', { nextCollapseIn });
        setCollapseIn(nextCollapseIn);
      }, animationDelay);
    }
  }, [collapseIn, guideParameters.locked, guideParameters.simulations, operationPending]);

  const getItemsForKey = key => {
    if (key === controlSegmentKeys.simulation) {
      return guideParameters.simulations || [];
    }
    if (key === controlSegmentKeys.execution) {
      const simulation = guideParameters[controlSegmentKeys.simulation];
      return simulation ? simulation.executions || [] : [];
    }
    const execution = guideParameters[controlSegmentKeys.execution];
    return execution ? execution.renderings || [] : [];
  };

  const getIdsForReduxAction = () => {
    const reduxActionPayload: any = {};
    const { simulation, execution, rendering } = guideParameters;
    if (simulation) {
      reduxActionPayload.simulationId = simulation.id;
    }
    if (activeItem !== controlSegmentKeys.simulation && execution) {
      reduxActionPayload.executionId = execution.id;
    }
    if (activeItem === controlSegmentKeys.rendering && rendering) {
      reduxActionPayload.renderingId = rendering.id;
    }
    return reduxActionPayload;
  };

  const handlePanelChange = key => (event, expanded) => {
    if (!guideParameters.locked && !operationPending) {
      dispatchGuideParameters({
        type: guideActions.setExpandedPanel,
        payload: expanded ? key : '',
      });
    }
  };

  const handleGuideMenuSelection = menuItem => {
    const { action } = menuItem;
    lastAction.current = action;
    actionFinishedBy.current = '';
    if (action === controlSegmentActions.new) {
      dispatchGuideParameters({
        type: guideActions.calculateNextPathOnGuideMenuSelection,
        payload: {
          key: controlSegmentKeys.simulation,
          action,
        },
      });
    }
  };

  const handlePanelListItemChange = (key, item) => () => {
    if (!guideParameters.locked) {
      const currentActiveItem = activeItem ? guideParameters[activeItem] : null;
      if (item !== currentActiveItem) {
        dispatchGuideParameters({
          type: guideActions.calculateNextPathOnPanelListItemChange,
          payload: {
            key,
            nextId: item.id,
          },
        });
      }
    }
  };

  const handleListMenuSelection = (key, itemIndex) => menuItem => {
    if (!guideParameters.locked) {
      const { action } = menuItem;
      const item = getItemsForKey(key)[itemIndex];
      let nextPanel;
      if (action === controlSegmentActions.new) {
        nextPanel =
          key === controlSegmentKeys.execution
            ? controlSegmentKeys.rendering
            : controlSegmentKeys.execution;
      } else {
        nextPanel = key;
      }
      lastAction.current = action;
      actionFinishedBy.current = '';
      dispatchGuideParameters({
        type: guideActions.calculateNextPathOnListMenuSelection,
        payload: {
          key: nextPanel,
          nextId: item.id,
          action,
        },
      });
    }
  };

  const handleCancelLock = () => {
    actionFinishedBy.current = 'cancel';
    dispatch(reduxActionForCancelOperation(activeItem, action, getIdsForReduxAction()));
  };

  const handleCommitLock = () => {
    actionFinishedBy.current = 'commit';
    dispatch(reduxActionForFinishOperation(activeItem, action, getIdsForReduxAction()));
  };

  // rendering
  const classes = useStyles();

  const renderHeader = () => {
    const { thumbnailUrl, title, loading } = props;

    const headerContent = thumbnailUrl ? null : <Loading pulse={true} />;
    const avatar = (
      <div className={classes.avatarWrapper}>
        <Avatar className={classes.avatar}>P</Avatar>
        {(loading || operationPending) && (
          <CircularProgress size={48} className={classes.avatarProgress} />
        )}
      </div>
    );

    return (
      <CardHeader
        classes={{
          root: classes.cardHeader,
          title: classes.cardHeaderTitle,
        }}
        avatar={avatar}
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
            disabled={Boolean(guideParameters.locked)}
          />
        }
        title={title}
      >
        {headerContent}
      </CardHeader>
    );
  };

  const renderListMenu = (key, itemIndex) => {
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
    const currentItem = guideParameters[key];
    const currentItemId = currentItem ? currentItem.id : '';
    const isPanelExpanded = guideParameters.expandedPanel === key;

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
          {!guideParameters.locked && renderListMenu(key, itemIndex)}
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

    const fullUrl =
      thumbnailUrl!.indexOf('http') > -1 ? thumbnailUrl : `${getConfig().dataHost}${thumbnailUrl}`;

    return <CardMedia className={classes.media} image={fullUrl} />;
  };

  const renderPanel = (key, items) => {
    const currentItem = guideParameters[key];
    const { title } = panelDetails[key];
    const isPanelExpanded = guideParameters.expandedPanel === key;

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
        {renderDetails(key, items)}
      </ExpansionPanel>
    );
  };

  const renderActionControls = (
    commitLabel = 'OK',
    cancelLabel = 'Cancel',
    commitDisabled = !props.submitEnabled || operationPending,
    cancelDisabled = false,
  ) => {
    return (
      <CardActions>
        <Button size='small' disabled={cancelDisabled} onClick={handleCancelLock} color='primary'>
          {cancelLabel}
        </Button>
        <Button size='small' disabled={commitDisabled} onClick={handleCommitLock} color='primary'>
          {commitLabel}
        </Button>
      </CardActions>
    );
  };

  const renderActions = () => {
    if (guideParameters.renderLockedAction) {
      switch (guideParameters.renderLockedAction) {
        case controlSegmentActions.edit:
          return renderActionControls('Save');
        case controlSegmentActions.new:
          return renderActionControls('Add');
        default:
          return renderActionControls();
      }
    }
  };

  const renderLockedDetails = item => {
    let message;
    switch (guideParameters.renderLockedAction) {
      case controlSegmentActions.new:
        message = `Add a new ${item}.`;
        break;
      case controlSegmentActions.edit:
        message = `Edit the current ${item}.`;
        break;
      case controlSegmentActions.delete:
        message = `Delete this ${item}?`;
        break;
      case controlSegmentActions.run:
        message = `Run this ${item}?`;
        break;
      case controlSegmentActions.render:
        message = `Render this ${item}?`;
        break;
      default:
        return null;
    }

    return (
      <Typography classes={{ root: classes.lockedPanelMessage }} component='div' align='center'>
        {message}
      </Typography>
    );
  };

  const renderLockedContent = () => {
    const { renderLockedItem } = guideParameters;
    return (
      <Collapse
        in={collapseIn}
        timeout={{ enter: animationDelay - 100, exit: animationDelay - 100 }}
      >
        <Paper elevation={4} className={classes.actionPaper}>
          {renderLockedDetails(renderLockedItem)}
          {renderActions()}
        </Paper>
      </Collapse>
    );
  };

  const renderContents = () => {
    if (!guideParameters.simulations) {
      return null;
    }

    const { simulation, execution } = guideParameters;
    const executions = simulation ? simulation!.executions : [];
    const renderings = execution ? execution!.renderings : [];

    return (
      <CardContent classes={{ root: classes.cardContent }}>
        {renderLockedContent()}
        {renderPanel(controlSegmentKeys.simulation, guideParameters.simulations)}
        {renderPanel(controlSegmentKeys.execution, executions)}
        {renderPanel(controlSegmentKeys.rendering, renderings)}
      </CardContent>
    );
  };

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
