import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
import {
  KEY_SIMULATION_ADD,
  controlSegmentKeys,
  controlSegmentActions,
  panelDetails,
  lockingActions,
} from './guideConstants';
import GuideMenu from './guideMenu';
import GuideListMenu from './guideListMenu';
import {
  reduxActionForCancelOperation,
  reduxActionForFinishOperation,
  reduxActionForStartOperation,
} from '../utils';

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

interface IControlParameters {
  simulation?: ISimulation;
  execution?: IExecution;
  rendering?: IRendering;
  activeItem?: string;
  action?: string;
}

const emptyControlParameters: IControlParameters = {
  activeItem: '',
  action: '',
};

const animationDelay = 300;

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

  // the parameters rendered in the component, could be delayed from props by delayedUpdate
  const [renderedControlParameters, setRenderedControlParameters] = useState(
    emptyControlParameters,
  );
  // expandedPanel is the one and only panel that is expanded - not necessarily the active panel
  const [expandedPanel, setExpandedPanel] = useState('');
  // the active and expanded panel is locked to display dialog controls
  const [locked, lock] = useState(false);
  // about to be unlocked, waiting for animation to finish
  const [delayedUpdate, setDelayedUpdate] = useState(true);
  // const [renderedAction, setRenderedAction] = useState('');

  // update component state if external data or url items change
  useEffect(() => {
    if (!delayedUpdate) {
      setRenderedControlParameters(prev => {
        const changed =
          simulation !== prev.simulation ||
          execution !== prev.execution ||
          rendering !== prev.rendering ||
          activeItem !== prev.activeItem ||
          action !== prev.action;
        return changed
          ? {
              simulation,
              execution,
              rendering,
              activeItem,
              action,
            }
          : prev;
      });
      lock(Boolean(action) && lockingActions.includes(action!));
      setExpandedPanel(activeItem || '');
    }
  }, [simulation, execution, rendering, activeItem, action, delayedUpdate]);

  // schedule a delayed update, delayed to allow time for animation
  useEffect(() => {
    if (delayedUpdate) {
      setTimeout(() => {
        setDelayedUpdate(false);
      }, animationDelay);
    }
  }, [delayedUpdate]);

  const getIdForSegmentKey = key => {
    if (renderedControlParameters[key]) {
      return renderedControlParameters[key].id;
    }
    if (simulations.length) {
      if (key === controlSegmentKeys.simulation) {
        return simulations[0].id;
      } else if (key === controlSegmentKeys.execution) {
        const s = renderedControlParameters.simulation;
        if (s && s.executions && s.executions.length) {
          return s.executions[0].id;
        }
      } else if (key === controlSegmentKeys.rendering) {
        const e = renderedControlParameters.execution;
        if (e && e.renderings && e.renderings.length) {
          return e.renderings[0].id;
        }
      }
    }
    return '';
  };

  const setPathForChange = (nextPanel, nextId = '', nextAction = '') => {
    if (!nextPanel) {
      return;
    }
    const isNewAction = nextAction === controlSegmentActions.new;
    const id = nextId || getIdForSegmentKey(nextPanel);

    let path = 'Simulation';
    if (nextPanel === controlSegmentKeys.execution) {
      path = `${path}/${renderedControlParameters.simulation!.id}/Execution`;
    } else if (nextPanel === controlSegmentKeys.rendering) {
      path = `${path}/${renderedControlParameters.simulation!.id}/Execution/${
        renderedControlParameters.execution!.id
      }/Rendering`;
    }

    if (isNewAction) {
      path = `${path}/${nextAction}`;
    } else if (id) {
      path = `${path}/${id}`;
      if (nextAction) {
        path = `${path}/${nextAction}`;
      }
    }

    if (nextAction) {
      setExpandedPanel('');
    }
    onControlChanged(path);
  };

  const getItemsForKey = key => {
    if (key === controlSegmentKeys.simulation) {
      return simulations || [];
    }
    if (key === controlSegmentKeys.execution) {
      const simulation = renderedControlParameters[controlSegmentKeys.simulation];
      return simulation ? simulation.executions || [] : [];
    }
    const execution = renderedControlParameters[controlSegmentKeys.execution];
    return execution ? execution.renderings || [] : [];
  };

  // event handlers

  // called when panel expansion is toggled
  const handlePanelChange = key => (event, expanded) => {
    // debug('handlePanelChange', { key, expanded, locked, expandedPanel });
    if (locked) {
      // guide is locked, ignore any attempts to change
      return;
    }

    setExpandedPanel(expanded ? key : '');
  };

  const handleGuideMenuSelection = menuItem => {
    // debug('handleGuideMenuSelection', { menuItem });
    const { action } = menuItem;
    if (action === controlSegmentActions.new) {
      debug('create a new simulation item');
      dispatch(reduxActionForStartOperation(action, controlSegmentKeys.simulation));
      setPathForChange(controlSegmentKeys.simulation, '', action!);
    }
  };

  const handlePanelListItemChange = (key, item) => () => {
    // debug('handlePanelListItemChange', { key, item, locked });
    if (locked) {
      return;
    }

    const currentActiveItem = activeItem ? renderedControlParameters[activeItem] : null;
    if (item === currentActiveItem) {
      // debug('handlePanelListItemChange - same item', { currentActiveItem });
      return;
    }

    debug('handlePanelListItemChange', { from: currentActiveItem, to: item });
    dispatch(reduxActionForStartOperation(key, controlSegmentActions.view, item.id));
    setPathForChange(key, item.id);
  };

  const handleListMenuSelection = (key, itemIndex) => menuItem => {
    if (locked) {
      return;
    }

    const item = getItemsForKey(key)[itemIndex];
    // debug('handleListMenuSelection', { key, item, menuItem });

    const { action } = menuItem;
    if (action === controlSegmentActions.new) {
      const lowerKey =
        key === controlSegmentKeys.execution
          ? controlSegmentKeys.rendering
          : controlSegmentKeys.execution;
      debug('handleListMenuSelection - new', { lowerKey, action });
      dispatch(reduxActionForStartOperation(key, action));
      setPathForChange(lowerKey, '', action);
    } else {
      debug('handleListMenuSelection - not new', { key, item, action });
      dispatch(reduxActionForStartOperation(key, action, item.id));
      setPathForChange(key, item.id, action);
    }
    setDelayedUpdate(true);
  };

  const handleCancelLock = () => {
    debug('handleCancelLock', { locked, delayedUpdate, activeItem });
    setDelayedUpdate(true);
    setExpandedPanel('');
    dispatch(reduxActionForCancelOperation(activeItem, action));
    setPathForChange(activeItem, '', '');
  };

  const handleCommitLock = () => {
    debug('handleCommitLock', { locked, delayedUpdate });
    setDelayedUpdate(true);
    setExpandedPanel('');
    dispatch(reduxActionForFinishOperation(activeItem, action));
    setPathForChange(activeItem, '', '');
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
    switch (renderedControlParameters.action) {
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
    const currentItem = renderedControlParameters[key];
    const currentItemId = currentItem ? currentItem.id : '';
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
        <Button size='small' onClick={handleCancelLock} color='primary'>
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
  };

  const renderActionsForDelete = () => {
    return (
      <ExpansionPanelActions>
        <Button size='small' onClick={handleCancelLock} color='primary'>
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
  };

  const renderActions = () => {
    switch (renderedControlParameters.action) {
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
    const currentItem = renderedControlParameters[key];
    const { title } = panelDetails[key];

    const isPanelActive = renderedControlParameters.activeItem === key;
    const isPanelLocked = isPanelActive && locked;
    // const isPanelExpanded = !delayedUpdate && (expandedPanel === key || isPanelLocked);
    const isPanelExpanded = expandedPanel === key;
    // debug('renderPanel', {
    //   key,
    //   isPanelActive,
    //   isPanelLocked,
    //   isPanelExpanded });

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
    if (!simulations) {
      return null;
    }

    const { simulation, execution } = renderedControlParameters;
    const executions = simulation ? simulation!.executions : [];
    const renderings = execution ? execution!.renderings : [];

    return (
      <CardContent classes={{ root: classes.cardContent }}>
        {renderPanel(controlSegmentKeys.simulation, simulations)}
        {renderPanel(controlSegmentKeys.execution, executions)}
        {renderPanel(controlSegmentKeys.rendering, renderings)}
      </CardContent>
    );
  };

  debug('render', {
    expandedPanel,
    locked,
    activeItem: renderedControlParameters.activeItem,
    action: renderedControlParameters.action,
  });
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
