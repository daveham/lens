import React from 'react';
import ListToolbar from '../../../components/listToolbar';

interface IProps {
  sourceId: string;
  simulationId: number;
  executionId: number;
}

const RenderingListToolbar = ({ sourceId, simulationId, executionId }: IProps) => {
  const links = {
    back: `/Catalog/${sourceId}/Simulation/${simulationId}/Execution`,
    newItem: `/Catalog/${sourceId}/Simulation/${simulationId}/Execution/${executionId}/Rendering/new`
  };

  return <ListToolbar links={links} />;
};

export default RenderingListToolbar;
