import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Photo from '@material-ui/icons/Photo';
import Landscape from '@material-ui/icons/Landscape';
import MoreVert from '@material-ui/icons/MoreVert';
import PhotoLibrary from '@material-ui/icons/PhotoLibrary';

export default () => (
  <Toolbar>
    <IconButton><Landscape/></IconButton>
    <IconButton><Photo/></IconButton>
    <IconButton><PhotoLibrary/></IconButton>
    <IconButton><MoreVert/></IconButton>
  </Toolbar>
);
