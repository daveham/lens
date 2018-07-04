import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Photo from '@material-ui/icons/Photo';
import Landscape from '@material-ui/icons/Landscape';
import MoreVert from '@material-ui/icons/MoreVert';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';

const buttonStyle = {
  width: 36,
  height: 36
};

const iconStyle = {
  width: 16,
  height: 16
};

const toolbarStyle = {
  minHeight: 36
};

export default () => (
  <Toolbar disableGutters style={toolbarStyle}>
    <IconButton style={buttonStyle}><Landscape style={iconStyle} /></IconButton>
    <IconButton style={buttonStyle}><Photo style={iconStyle} /></IconButton>
    <IconButton style={buttonStyle}><PhotoLibrary style={iconStyle} /></IconButton>
    <IconButton style={buttonStyle}><MoreVert style={iconStyle} /></IconButton>
  </Toolbar>
);
