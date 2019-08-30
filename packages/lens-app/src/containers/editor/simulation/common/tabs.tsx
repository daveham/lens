import React, { Component } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { withStyles } from '@material-ui/core/styles';

const styles: any = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    marginTop: theme.spacing(2),
  },
});

interface IProps {
  classes?: any;
  hikeContent?: any;
  trailsContent?: any;
  hikersContent?: any;
}

interface IState {
  active: number;
}

class SimulationTabs extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = { active: 0 };
  }

  public render(): any {
    const {
      classes,
      hikeContent,
      trailsContent,
      hikersContent,
    } = this.props;
    const { active } = this.state;

    return (
      <div className={classes.root}>
        <Tabs
          centered
          value={active}
          indicatorColor='primary'
          textColor='primary'
          onChange={this.handleTabChange}
        >
          <Tab label='Hike' />
          <Tab label='Trails' />
          <Tab label='Hikers' />
        </Tabs>
        <div className={classes.content}>
          {active === 0 && hikeContent}
          {active === 1 && trailsContent}
          {active === 2 && hikersContent}
        </div>
      </div>
    );
  }

  private handleTabChange = (e, value) =>
    this.setState({ active: value });
}

export default withStyles(styles)(SimulationTabs);
