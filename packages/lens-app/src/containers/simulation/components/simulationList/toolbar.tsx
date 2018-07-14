import React from 'react';
import ListToolbar from '../listToolbar';

interface IProps {
  sourceId: string;
}

const SimulationListToolbar = ({ sourceId }: IProps) => {
  const links = {
    back: '/Catalog',
    newItem: `/Catalog/${sourceId}/Simulation/new`
  };

  return <ListToolbar links={links} />;
};

export default SimulationListToolbar;
