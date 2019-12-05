import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor/rendering/renderingEmptyState/view');

const useStyles: any = makeStyles((theme: any) => ({
  empty: {
    padding: theme.spacing(10),
    border: `solid 1px ${theme.palette.grey['300']}`,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    paddingTop: '10%',
  },
}));

interface IProps {
  history: any;
  sourceId: string;
  simulationId: string;
  executionId: string;
}

const RenderingEmptyStateView = (props: IProps) => {
  const classes = useStyles();

  const handleAddNewRendering = () => {
    const {
      history,
      sourceId,
      simulationId,
      executionId,
    } = props;

    const path = `/Catalog/${sourceId}/Simulation/${simulationId}/Execution/${executionId}/Rendering/new`;
    history.push(path);
  };

  return (
    <div className={classes.empty}>
      <Button
        size='small'
        onClick={handleAddNewRendering}
        color='primary'
        variant='contained'
      >
        Add a new Rendering
      </Button>
    </div>
  );
};

export default RenderingEmptyStateView;
