import React from 'react';
import ListToolbar from '../listToolbar';

interface IProps {
  links: {[key: string]: string};
}

export default ({ links }: IProps) => (
  <ListToolbar links={links} iconSize={16} buttonSize={36} disableGutters />
);
