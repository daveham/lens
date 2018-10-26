import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
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

// import _debug from 'debug';
// const debug = _debug('lens:containers:app:dashboard');

const drawerWidth = 240;

const styles = theme => {
  const contentPadding = theme.spacing.unit;
  return {
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
      width: theme.spacing.unit * 7,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing.unit * 9,
      },
    },
    content: {
      backgroundColor: '#f0f0f0',
      flexGrow: 1,
      padding: `70px ${contentPadding}px ${contentPadding}px ${contentPadding}px`,
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
      marginBottom: theme.spacing.unit * 2,
    },
    list: {
      '& a': {
        textDecoration: 'none',
      },
    }
  };
};

class Dashboard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    connected: PropTypes.bool,
    connecting: PropTypes.bool,
    socketId: PropTypes.string,
    command: PropTypes.object,
    connectSocket: PropTypes.func.isRequired,
    sendSocketCommand: PropTypes.func.isRequired,
    sendPing: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  componentDidMount() {
    if (!(this.props.connected || this.props.connecting)) {
      setTimeout(() => {
        this.props.connectSocket();
      }, 0);
    }
  }

  componentDidUpdate(prevProps) {
    const nowConnected = this.props.connected && prevProps.connecting && !this.props.connecting;
    const socketIdChanged = prevProps.socketId && this.props.socketId && prevProps.socketId !== this.props.socketId;
    if (nowConnected || socketIdChanged) {
      this.props.sendSocketCommand({ command: 'register' });
    }
  }

  sendFlashPing = () => {
    this.props.sendSocketCommand({ command: 'ping' });
  };

  sendCommandPing = () => {
    this.props.sendPing();
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, location: { pathname } } = this.props;

    return (
      <Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar
            position="absolute"
            className={cx(classes.appBar, this.state.open && classes.appBarShift)}
          >
            <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={cx(
                  classes.menuButton,
                  this.state.open && classes.menuButtonHidden,
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" noWrap className={classes.title}>
                Lens
              </Typography>
              <CommandBar
                connected={this.props.connected}
                pingFlash={this.sendFlashPing}
                pingJob={this.sendCommandPing}
                command={this.props.command}
              />
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: cx(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
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
      </Fragment>
    );
  }
}

export default withStyles(styles)(Dashboard);
