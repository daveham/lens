import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

// import getDebugLog from './debugLog';
// const debug = getDebugLog('view');

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
}

const ExecutionEmptyStateView = (props: IProps) => {
  const classes = useStyles();

  const handleAddNewExecution = () => {
    const {
      history,
      sourceId,
      simulationId,
    } = props;

    const path = `/Catalog/${sourceId}/Simulation/${simulationId}/Execution/new`;
    history.push(path);
  };

  return (
    <div className={classes.empty}>
      <Button
        size='small'
        onClick={handleAddNewExecution}
        color='primary'
        variant='contained'
      >
        Add a new Execution
      </Button>
    </div>
  );
};

export default ExecutionEmptyStateView;
