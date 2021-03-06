import React, { useState, useEffect, useRef } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Home from '../../home';
import CommandBar from './commandBar';
import { renderMainListItems, renderSecondaryListItems } from './listItems';
import { catalogRoute } from 'src/routes';
import { useDispatch, useSelector } from 'react-redux';
import {
  connecting as connectingSelector,
  connected as connectedSelector,
  socketId as socketIdSelector,
  isSocketInErrorState as isSocketInErrorStateSelector,
  command as commandSelector,
} from 'src/modules/selectors';
import { titleSelector } from 'src/modules/ui';
import {
  closeSocket,
  requestSocketStatus,
  sendSocketCommand,
  sendPing
} from 'modules/common';

import getDebugLog from './debugLog';
const debug = getDebugLog('dashboard');

const drawerWidth = 240;

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  content: {
    backgroundColor: theme.palette.app.background,
    flexGrow: 1,
    padding: theme.spacing(10, 1, 1, 1),
    height: '100vh',
    overflow: 'auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexFlow: 'column',
    margin: '0px auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing(2),
  },
  list: {
    '& a': {
      textDecoration: 'none',
    },
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const location = useLocation();
  const { pathname } = location;

  const connected = useSelector(connectedSelector);
  const connecting = useSelector(connectingSelector);
  const socketId = useSelector(socketIdSelector);
  const isSocketInErrorState = useSelector(isSocketInErrorStateSelector);
  const command = useSelector(commandSelector);
  const title = useSelector(titleSelector);

  const [open, setOpen] = useState(true);

  const connectDelayRef = useRef(0);

  useEffect(() => {
    if (isSocketInErrorState) {
      debug('socket is in error state, closing socket');
      connectDelayRef.current = 2000;
      dispatch(closeSocket());
    }
    if (!connected && !connecting && !isSocketInErrorState) {
      debug('useEffect(socketState) - dispatching', {
        connected,
        connecting,
        isSocketInErrorState,
      });
      setTimeout(() => {
        dispatch(requestSocketStatus());
      }, connectDelayRef.current);
    } else {
      debug('useEffect(socketState) - not dispatching', {
        connected,
        connecting,
        isSocketInErrorState,
      });
    }
  }, [connected, connecting, isSocketInErrorState, dispatch]);

  useEffect(() => {
    if (socketId) {
      dispatch(sendSocketCommand({ command: 'register' }));
    }
  }, [socketId, dispatch]);

  const appTitle = title ? `Lens: ${title}` : 'Lens';

  return (
    <>
      <CssBaseline />
      <div className={classes.root}>
        <AppBar
          position='absolute'
          className={cx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!open} className={classes.toolbar}>
            <IconButton
              color='inherit'
              aria-label='Open drawer'
              onClick={() => setOpen(true)}
              className={cx(
                classes.menuButton,
                open && classes.menuButtonHidden,
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' color='inherit' noWrap className={classes.title}>
              {appTitle}
            </Typography>
            <CommandBar
              connected={connected}
              hasError={isSocketInErrorState}
              pingFlash={() => dispatch(sendSocketCommand({ command: 'ping' }))}
              pingJob={() => dispatch(sendPing())}
              command={command}
            />
          </Toolbar>
        </AppBar>
        <Drawer
          variant='permanent'
          classes={{
            paper: cx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={() => setOpen(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List className={classes.list}>{renderMainListItems(pathname)}</List>
          <Divider />
          <List className={classes.list}>{renderSecondaryListItems(pathname)}</List>
        </Drawer>
        <main className={classes.content}>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/Catalog' component={catalogRoute}/>
          </Switch>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
