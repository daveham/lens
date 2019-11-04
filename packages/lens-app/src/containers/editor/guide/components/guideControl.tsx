import React, { useReducer, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import { operationPendingSelector, operationEndedSelector } from 'editor/modules/selectors';

import ExpansionPanel from './ExpansionPanel';
import ExpansionPanelSummary from './ExpansionPanelSummary';
import ExpansionPanelDetails from './ExpansionPanelDetails';
import ExpansionPanelActions from './ExpansionPanelActions';
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
  expandedPanel?: string;
  locked: boolean;
  delayedUpdate: boolean;
  nextPath?: string;
}

const initialGuideParameters: IGuideParameters = {
  simulations: [],
  activeItem: '',
  action: '',
  expandedPanel: '',
  locked: false,
  delayedUpdate: false,
  nextPath: '',
};

const guideActions = {
  update: 'UPDATE',
  beginDelay: 'BEGIN_DELAY',
  endDelay: 'END_DELAY',
  lockPanel: 'LOCK_PANEL',
  unlockPanel: 'UNLOCK_PANEL',
  setExpandedPanel: 'SET_EXPANDED_PANEL',
  clearExpandedPanel: 'CLEAR_EXPANDED_PANEL',
  clearAndDelayExpandedPanel: 'CLEAR_AND_DELAY_EXPANDED_PANEL',
  calculateNextPath: 'CALCULATE_NEXT_PATH',
};

// Helper to get id of selected element type indicated by key,
// cascade to next available item of type if none selected
const getIdForSegmentKey = (controlParameters, key) => {
  if (controlParameters[key]) {
    return controlParameters[key].id;
  }

  // no element of type indicated by key is selected, do cascade
  if (controlParameters.simulations.length) {
    if (key === controlSegmentKeys.simulation) {
      // return id of first simulation
      return controlParameters.simulations[0].id;
    } else if (key === controlSegmentKeys.execution) {
      const s = controlParameters.simulation;
      if (s && s.executions && s.executions.length) {
        // return id of first execution selected simulation
        return s.executions[0].id;
      }
    } else if (key === controlSegmentKeys.rendering) {
      const e = controlParameters.execution;
      if (e && e.renderings && e.renderings.length) {
        // return id of first rendering of selected execution
        return e.renderings[0].id;
      }
    }
  }
  return '';
};

const guideParametersReducer = (state, { type, payload }) => {
  debug('guideParametersReducer', { type, delayedUpdate: state.delayedUpdate });
  switch (type) {
    case guideActions.update:
      if (!state.delayedUpdate) {
        return {
          ...state,
          ...payload,
        };
      }
      break;
    case guideActions.beginDelay:
      return {
        ...state,
        delayedUpdate: true,
      };
    case guideActions.endDelay:
      return {
        ...state,
        delayedUpdate: false,
      };
    case guideActions.lockPanel:
      if (!state.delayedUpdate) {
        return {
          ...state,
          locked: true,
        };
      }
      break;
    case guideActions.unlockPanel:
      if (!state.delayedUpdate) {
        return {
          ...state,
          locked: false,
        };
      }
      break;
    case guideActions.setExpandedPanel:
      if (!state.delayedUpdate) {
        return {
          ...state,
          expandedPanel: payload,
        };
      }
      break;
    case guideActions.clearExpandedPanel:
      if (!state.delayedUpdate) {
        return {
          ...state,
          expandedPanel: '',
        };
      }
      break;
    case guideActions.clearAndDelayExpandedPanel:
      return {
        ...state,
        expandedPanel: '',
        delayedUpdate: true,
      };
    case guideActions.calculateNextPath: {
      const { nextPanel, nextId = '', nextAction = '' } = payload;
      if (!nextPanel) {
        return state;
      }
      const id = nextId || getIdForSegmentKey(state, nextPanel);

      let nextPath = 'Simulation';
      if (nextPanel === controlSegmentKeys.execution) {
        nextPath = `${nextPath}/${state.simulation!.id}/Execution`;
      } else if (nextPanel === controlSegmentKeys.rendering) {
        nextPath = `${nextPath}/${state.simulation!.id}/Execution/${state.execution!.id}/Rendering`;
      }

      if (nextAction === controlSegmentActions.new) {
        nextPath = `${nextPath}/${nextAction}`;
      } else if (id) {
        nextPath = `${nextPath}/${id}`;
        if (nextAction) {
          nextPath = `${nextPath}/${nextAction}`;
        }
      }
      return {
        ...state,
        nextPath,
      };
    }
    default:
      throw new Error();
  }
  return state;
};

const animationDelay = 400;

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

  const operationPending = useSelector(operationPendingSelector);
  const operationEnded = useSelector(operationEndedSelector);

  // the parameters rendered in the component, could be delayed from props by delayedUpdate
  const [guideParameters, dispatchGuideParameters] = useReducer(
    guideParametersReducer,
    initialGuideParameters,
  );

  useEffect(() => {
    debug('useEffect(initial) - begin delay');
    // @ts-ignore
    dispatchGuideParameters({ type: guideActions.beginDelay });
  }, []);

  // update rendered control parameters
  useEffect(() => {
    debug('useEffect(props)', {
      simulations,
      simulation,
      execution,
      rendering,
      activeItem,
      action,
    });
    dispatchGuideParameters({
      type: guideActions.update,
      payload: {
        simulations,
        simulation,
        execution,
        rendering,
        activeItem, // one of controlSegmentKeys: simulation | execution | rendering
        action, // one of controlSegmentActions: view | edit | new | delete
      },
    });
  }, [
    simulations,
    simulation,
    execution,
    rendering,
    activeItem,
    action,
    guideParameters.delayedUpdate,
  ]);

  // update locked state of active panel
  useEffect(() => {
    debug('useEffect(gp.action)', { action: guideParameters.action });
    if (guideParameters.action && lockingActions.includes(guideParameters.action)) {
      // @ts-ignore
      dispatchGuideParameters({ type: guideActions.lockPanel });
    } else {
      // @ts-ignore
      dispatchGuideParameters({ type: guideActions.unlockPanel });
    }
  }, [guideParameters.action]);

  // update which panel is expanded
  useEffect(() => {
    debug('useEffect(gp.activeItem)', { activeItem: guideParameters.activeItem });
    if (guideParameters.activeItem) {
      dispatchGuideParameters({
        type: guideActions.setExpandedPanel,
        payload: guideParameters.activeItem,
      });
    } else {
      // @ts-ignore
      dispatchGuideParameters({ type: guideActions.clearExpandedPanel });
    }
  }, [guideParameters.activeItem]);

  // when delayedUpdate is set, schedule its reset based on animation delay
  useEffect(() => {
    debug('useEffect(gp.delayedUpdate)', { delayedUpdate: guideParameters.delayedUpdate });
    if (guideParameters.delayedUpdate) {
      setTimeout(() => {
        debug('useEffect(gp.delayedUpdate) - timeout');
        // @ts-ignore
        dispatchGuideParameters({ type: guideActions.endDelay });
      }, animationDelay);
    }
  }, [guideParameters.delayedUpdate]);

  useEffect(() => {
    debug('useEffect(gp.nextPath)', { nextPath: guideParameters.nextPath });
    if (guideParameters.nextPath) {
      onControlChanged(guideParameters.nextPath);
    }
  }, [guideParameters.nextPath, onControlChanged]);

  useEffect(() => {
    debug('useEffect(operationEnded)', { operationEnded, activeItem });
    if (operationEnded) {
      debug('useEffect(operationEnded)', { activeItem });
      // setPathForChange(activeItem, '', '');
      dispatchGuideParameters({
        type: guideActions.calculateNextPath,
        payload: {
          // nextPanel, nextId, nextAction
          nextPanel: activeItem,
        },
      });
    }
  }, [operationEnded, activeItem]);

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
    if (guideParameters.locked || operationPending) {
      return;
    }

    debug('handlePanelChange', { setExPnl: expanded ? key : 'empty' });
    if (expanded) {
      dispatchGuideParameters({ type: guideActions.setExpandedPanel, payload: key });
    } else {
      // @ts-ignore
      dispatchGuideParameters({ type: guideActions.clearExpandedPanel });
    }
  };

  const handleGuideMenuSelection = menuItem => {
    const { action } = menuItem;
    if (action === controlSegmentActions.new) {
      // setPathForChange(controlSegmentKeys.simulation, '', action!);
      dispatchGuideParameters({
        type: guideActions.calculateNextPath,
        payload: {
          // nextPanel, nextId, nextAction
          nextPanel: controlSegmentKeys.simulation,
          nextAction: action,
        },
      });
    }
  };

  const handlePanelListItemChange = (key, item) => () => {
    if (guideParameters.locked) {
      return;
    }

    const currentActiveItem = activeItem ? guideParameters[activeItem] : null;
    if (item === currentActiveItem) {
      return;
    }

    // setPathForChange(key, item.id);
    dispatchGuideParameters({
      type: guideActions.calculateNextPath,
      payload: {
        // nextPanel, nextId, nextAction
        nextPanel: key,
        nextId: item.id,
      },
    });
  };

  const handleListMenuSelection = (key, itemIndex) => menuItem => {
    if (guideParameters.locked) {
      return;
    }

    // @ts-ignore
    dispatchGuideParameters({ type: guideActions.clearAndDelayExpandedPanel });

    const { action } = menuItem;
    if (action === controlSegmentActions.new) {
      const nextLevelKey =
        key === controlSegmentKeys.execution
          ? controlSegmentKeys.rendering
          : controlSegmentKeys.execution;
      // setPathForChange(nextLevelKey, '', action);
      dispatchGuideParameters({
        type: guideActions.calculateNextPath,
        payload: {
          // nextPanel, nextId, nextAction
          nextPanel: nextLevelKey,
          nextAction: action,
        },
      });
    } else {
      const item = getItemsForKey(key)[itemIndex];
      // setPathForChange(key, item.id, action);
      dispatchGuideParameters({
        type: guideActions.calculateNextPath,
        payload: {
          // nextPanel, nextId, nextAction
          nextPanel: key,
          nextId: item.id,
          nextAction: action,
        },
      });
    }
  };

  const handleCancelLock = () => {
    // @ts-ignore
    dispatchGuideParameters({ type: guideActions.clearAndDelayExpandedPanel });
    dispatch(reduxActionForCancelOperation(activeItem, action, getIdsForReduxAction()));
  };

  const handleCommitLock = () => {
    // @ts-ignore
    dispatchGuideParameters({ type: guideActions.clearAndDelayExpandedPanel });
    dispatch(reduxActionForFinishOperation(activeItem, action, getIdsForReduxAction()));
  };

  // rendering
  const classes = useStyles();

  const renderHeader = () => {
    const { thumbnailUrl, title, loading } = props;

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
            disabled={guideParameters.locked}
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
    switch (guideParameters.action) {
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

    const fullUrl =
      thumbnailUrl!.indexOf('http') > -1 ? thumbnailUrl : `${getConfig().dataHost}${thumbnailUrl}`;

    return <CardMedia className={classes.media} image={fullUrl} />;
  };

  const renderActionsForNew = () => {
    return (
      <ExpansionPanelActions>
        <Button size='small' onClick={handleCancelLock} color='primary'>
          Cancel
        </Button>
        <Button
          size='small'
          disabled={!props.submitEnabled || operationPending}
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
        <Button size='small' onClick={handleCancelLock} color='primary'>
          Cancel
        </Button>
        <Button
          size='small'
          disabled={!props.submitEnabled || operationPending}
          onClick={handleCommitLock}
          color='primary'
        >
          Save
        </Button>
      </ExpansionPanelActions>
    );
  };

  const renderActionsForDelete = () => {
    return (
      <ExpansionPanelActions>
        <Button size='small' onClick={handleCancelLock} color='primary'>
          Cancel
        </Button>
        <Button
          size='small'
          disabled={!props.submitEnabled || operationPending}
          onClick={handleCommitLock}
          color='primary'
        >
          OK
        </Button>
      </ExpansionPanelActions>
    );
  };

  const renderActions = () => {
    switch (guideParameters.action) {
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
    const currentItem = guideParameters[key];
    const { title } = panelDetails[key];

    const isPanelActive = guideParameters.activeItem === key;
    const isPanelLocked = isPanelActive && guideParameters.locked;
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
        {isPanelLocked
          ? // locked details are rendered when the panel includes dialog buttons
            renderLockedDetails(key)
          : // regular details are rendered when the panel includes information
            renderDetails(key, items)}
        {isPanelLocked && renderActions()}
      </ExpansionPanel>
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
        {renderPanel(controlSegmentKeys.simulation, guideParameters.simulations)}
        {renderPanel(controlSegmentKeys.execution, executions)}
        {renderPanel(controlSegmentKeys.rendering, renderings)}
      </CardContent>
    );
  };

  debug('--render--');
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
