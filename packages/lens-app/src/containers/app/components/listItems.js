import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import CameraIcon from '@material-ui/icons/Camera';
import CameraRollIcon from '@material-ui/icons/CameraRoll';
import AutoRenewIcon from '@material-ui/icons/Autorenew';
import BarChartIcon from '@material-ui/icons/BarChart';
import BuildIcon from '@material-ui/icons/Build';
import CollectionsIcon from '@material-ui/icons/Collections';

const linkWrapper = (link) =>
  React.forwardRef((props, ref) => <Link {...props} ref={ref} to={link} />);

export const renderMainListItems = (pathname) => (
  <div>
    <ListItem
      button
      component={linkWrapper('/')}
      selected={pathname === '/'}
    >
      <ListItemIcon><CameraIcon /></ListItemIcon>
      <ListItemText primary='Home' />
    </ListItem>
    <ListItem
      button
      component={linkWrapper('/Catalog')}
      selected={pathname.includes('/Catalog')}
    >
      <ListItemIcon><CameraRollIcon /></ListItemIcon>
      <ListItemText primary='Catalog' />
    </ListItem>
    <ListItem
      button
      component={linkWrapper('/')}
      selected={pathname === '/Activity'}
    >
      <ListItemIcon><AutoRenewIcon /></ListItemIcon>
      <ListItemText primary='Activity' />
    </ListItem>
    <ListItem
      button
      component={linkWrapper('/')}
      selected={pathname === '/Statistics'}
    >
      <ListItemIcon><BarChartIcon /></ListItemIcon>
      <ListItemText primary='Statistics' />
    </ListItem>
    <ListItem
      button
      component={linkWrapper('/')}
      selected={pathname === '/Maintenance'}
    >
      <ListItemIcon><BuildIcon /></ListItemIcon>
      <ListItemText primary='Maintenance' />
    </ListItem>
  </div>
);

export const renderSecondaryListItems = (pathname) => (
  <div>
    <ListSubheader inset>Recent Renderings</ListSubheader>
    <ListItem
      button
      component={linkWrapper('/')}
      selected={pathname.includes('/Recent/Today')}
    >
      <ListItemIcon><CollectionsIcon /></ListItemIcon>
      <ListItemText primary='Today' />
    </ListItem>
    <ListItem
      button
      component={linkWrapper('/')}
      selected={pathname.includes('/Recent/Yesterday')}
    >
      <ListItemIcon><CollectionsIcon /></ListItemIcon>
      <ListItemText primary='Yesterday' />
    </ListItem>
    <ListItem
      button
      component={linkWrapper('/')}
      selected={pathname.includes('/Recent/ThisWeek')}
    >
      <ListItemIcon><CollectionsIcon /></ListItemIcon>
      <ListItemText primary='This Week' />
    </ListItem>
  </div>
);
