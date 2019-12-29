import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { TypedUseSelectorHook, useSelector as useSelectorGeneric } from 'react-redux';
import { RootEditorState } from 'editor/modules';
import { simulationsLoadingSelector } from 'editor/modules/selectors';

// import _debug from 'debug';
// const debug = _debug('lens:editor/simulation/simulationEmptyState/view');

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
}

const SimulationEmptyStateView = (props: IProps) => {
  const classes = useStyles();

  const useSelector: TypedUseSelectorHook<RootEditorState> = useSelectorGeneric;
  const simulationsLoading = useSelector(simulationsLoadingSelector);

  const handleAddNewSimulation = () => {
    const {
      history,
      sourceId,
    } = props;

    const path = `/Catalog/${sourceId}/Simulation/new`;
    history.push(path);
  };

  return (
    <div className={classes.empty}>
      {!simulationsLoading && (
        <Button
          size='small'
          onClick={handleAddNewSimulation}
          color='primary'
          variant='contained'
        >
          Add a new Simulation
        </Button>
      )}
    </div>
  );
};

export default SimulationEmptyStateView;
