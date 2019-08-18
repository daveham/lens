import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor/simulation/simulationEmptyState/view');

const styles: any = (theme => ({
  empty: {
    padding: `${theme.spacing.unit * 10}px`,
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
  classes?: any;
  history: any;
  sourceId: string;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    const { classes } = this.props;
    return (
      <div className={classes.empty}>
        <Button
          size='small'
          onClick={this.handleAddNewSimulation}
          color='primary'
          variant='contained'
        >
          Add a new Simulation
        </Button>
      </div>
    );
  }

  handleAddNewSimulation = () => {
    const {
      history,
      sourceId,
    } = this.props;

    const path = `/Catalog/${sourceId}/Simulation/new`;
    history.push(path);
  };
}

export default withStyles(styles)(View);
