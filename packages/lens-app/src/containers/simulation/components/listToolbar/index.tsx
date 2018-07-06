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

interface IProps {
  links: {[key: string]: string};
  iconSize?: number;
  buttonSize?: number;
  disableGutters?: boolean;
}

export default ({ links, iconSize, buttonSize, disableGutters }: IProps) => {
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
        <RouterLink to={links.back}>
          <IconButton key='back' style={buttonStyle}><Reply style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.newItem) {
      buttons.push(
        <RouterLink to={links.newItem}>
          <IconButton key='newItem' style={buttonStyle}><AddToPhotos style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.editItem) {
      buttons.push(
        <RouterLink to={links.editItem}>
          <IconButton key='editItem' style={buttonStyle}><Edit style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.deleteItem) {
      buttons.push(
        <RouterLink to={links.deleteItem}>
          <IconButton key='deleteItem' style={buttonStyle}><Delete style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.executions) {
      buttons.push(
        <RouterLink to={links.executions}>
          <IconButton key='executions' style={buttonStyle}><Landscape style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.renderings) {
      buttons.push(
        <RouterLink to={links.renderings}>
          <IconButton key='renderings' style={buttonStyle}><Photo style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.other) {
      buttons.push(
        <RouterLink to={links.other}>
          <IconButton key='other' style={buttonStyle}><PhotoLibrary style={iconStyle} /></IconButton>
        </RouterLink>
      );
    }
    if (links.extra) {
      buttons.push(
        <RouterLink to={links.extra}>
          <IconButton key='extra' style={buttonStyle}><MoreVert style={iconStyle} /></IconButton>
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
