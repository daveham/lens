import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Photo from '@material-ui/icons/Photo';
import Landscape from '@material-ui/icons/Landscape';
import MoreVert from '@material-ui/icons/MoreVert';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';
import Reply from '@material-ui/icons/Reply';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import AddToPhotos from '@material-ui/icons/AddToPhotos';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:components:listToolbar');

interface IProps {
  links: {[key: string]: string};
  iconSize?: number;
  buttonSize?: number;
  disableGutters?: boolean;
}

export default ({ links, iconSize, buttonSize, disableGutters }: IProps) => {
  // debug('render', { links });

  const buttons = [];

  let buttonStyle;
  let iconStyle;
  let toolbarStyle;

  if (buttonSize) {
    buttonStyle = {
      width: buttonSize,
      height: buttonSize
    };
    toolbarStyle = {
      minHeight: buttonSize
    };
  }

  if (iconSize) {
    iconStyle = {
      width: iconSize,
      height: iconSize
    };
  }

  if (links) {
    if (links.back) {
      buttons.push(
        <RouterLink key='back' to={links.back}>
          <IconButton style={buttonStyle}><Reply style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.newItem) {
      buttons.push(
        <RouterLink key='newItem' to={links.newItem}>
          <IconButton style={buttonStyle}><AddToPhotos style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.editItem) {
      buttons.push(
        <RouterLink key='editItem' to={links.editItem}>
          <IconButton style={buttonStyle}><Edit style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.deleteItem) {
      buttons.push(
        <RouterLink key='deleteItem' to={links.deleteItem}>
          <IconButton style={buttonStyle}><Delete style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.executions) {
      buttons.push(
        <RouterLink key='executions' to={links.executions}>
          <IconButton style={buttonStyle}><Landscape style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.renderings) {
      buttons.push(
        <RouterLink key='renderings' to={links.renderings}>
          <IconButton style={buttonStyle}><Photo style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.other) {
      buttons.push(
        <RouterLink key='other' to={links.other}>
          <IconButton style={buttonStyle}><PhotoLibrary style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.extra) {
      buttons.push(
        <RouterLink key='extra' to={links.extra}>
          <IconButton style={buttonStyle}><MoreVert style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
  }

  return (
    <Toolbar style={toolbarStyle} disableGutters={disableGutters}>
      {buttons}
    </Toolbar>
  );
};
