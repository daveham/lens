import React from 'react';
import ListToolbar from '../../../components/listToolbar';

interface IProps {
  sourceId: string;
  simulationId: number;
}

const ExecutionListToolbar = ({ sourceId, simulationId }: IProps) => {
  const links = {
    back: `/Catalog/${sourceId}/Simulation`,
    newItem: `/Catalog/${sourceId}/Simulation/${simulationId}/Execution/new`
  };

  return <ListToolbar links={links} />;
};

export default ExecutionListToolbar;
