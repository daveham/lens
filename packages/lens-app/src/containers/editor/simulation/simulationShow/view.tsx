import React, { Fragment } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import {
  ISimulation,
  IHike,
  ITrail,
  IHiker,
} from 'editor/interfaces';

import ReadOnlyTextField from 'editor/components/readOnlyTextField';
import Layout from '../common/layout';
import Hike from '../common/hike';
import Trail from '../common/trail';
import Trails from '../common/trails';
import Hiker from '../common/hiker';
import Hikers from '../common/hikers';

import {
  reduceItemWithChanges,
  reduceListWithItem,
  reduceListItemWithChanges,
  initialHike,
} from 'editor/simulation/common/helpers';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationShow:view');

interface IProps {
  classes?: any;
  editMode?: boolean;
  sourceId: string;
  simulationId: number;
  simulation: ISimulation;
  loading: boolean;
  hike?: IHike;
}

interface IState {
  activeTab: number;
  simulation: ISimulation;
  hike?: IHike;
  trails: ReadonlyArray<ITrail>;
  hikers: ReadonlyArray<IHiker>;
  selectedTrailIndex: number;
  selectedHikerIndex: number;
}

const styles: any = (theme) => ({
  tabIndicator: {
    backgroundColor: theme.palette.secondary.main,
  },
});

class View extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const { hike = initialHike } = props;
    const { hike: { trails = [] } = initialHike } = props;
    const { hike: { trails: [{ hikers }] } = initialHike } = props;

    this.state = {
      activeTab: 0,
      simulation: { ...props.simulation },
      hike,
      selectedTrailIndex: 0,
      trails,
      selectedHikerIndex: 0,
      hikers,
    };
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState): void {
    const { hike, simulation } = this.props;
    if (prevProps.hike !== hike) {
      this.setState({
        hike,
        trails: hike ? hike.trails : [],
        hikers: hike && hike.trails[0] ? hike.trails[0].hikers : [],
      });
    }
    if (prevProps.simulation !== simulation) {
      this.setState({
        simulation: { ...simulation }
      });
    }
  }

  public render(): any {
    if (this.props.loading) {
      return null;
    }

    return (
      <Layout
        title='Simulation'
        contentLeft={this.renderSimulation()}
        contentRight={this.renderContent()}
        controls={this.renderTabs()}
      />
    );
  }

  private renderTabs(): any {
    const { activeTab } = this.state;
    return (
      <Tabs
        classes={{ indicator: this.props.classes.tabIndicator }}
        value={activeTab}
        indicatorColor='primary'
        textColor='inherit'
        onChange={this.handleTabChange}
      >
        <Tab label='Hike' />
        <Tab label='Trail' />
        <Tab label='Hiker' />
      </Tabs>
    );
  }

  private renderSimulation(): any {
    const { editMode } = this.props;
    const {
      simulation: { name },
      trails,
      selectedTrailIndex,
      hikers,
      selectedHikerIndex,
    } = this.state;

    if (!name) {
      return null;
    }
    return (
      <Fragment>
        {!editMode && (
          <ReadOnlyTextField
            label='Name'
            margin='dense'
            multiline
            value={name}
            fullWidth
            disabled
          />
        )}
        {editMode && (
          <TextField
            label='Name'
            margin='normal'
            multiline
            onChange={this.handleSimulationFieldChange}
            inputProps={{
              name: 'name',
              id: 'simulation-name'
            }}
            value={name}
            fullWidth
            required
          />
        )}
        <Trails
          disabled={!editMode}
          items={trails}
          selectedIndex={selectedTrailIndex}
          onListChanged={this.handleTrailsListChanged}
          onSelectionChanged={this.handleTrailsSelectionChanged}
        />
        <Hikers
          disabled={!editMode}
          items={hikers}
          selectedIndex={selectedHikerIndex}
          onListChanged={this.handleHikersListChanged}
          onSelectionChanged={this.handleHikersSelectionChanged}
        />
      </Fragment>
    );
  }

  private renderContent(): JSX.Element | undefined {
    const { editMode } = this.props;
    const {
      activeTab,
      hike,
      trails,
      selectedTrailIndex,
      hikers,
      selectedHikerIndex,
    } = this.state;

    if (activeTab === 0) {
      return hike && (
        <Hike
          disabled={!editMode}
          hike={hike}
          onChange={this.handleHikeFieldChange}
        />
      );
    }

    if (activeTab === 1) {
      return (
        <Trail
          disabled={!editMode}
          trail={trails[selectedTrailIndex]}
          onChange={this.handleTrailFieldChange}
        />
      );
    }

    return (
      <Hiker
        disabled={!editMode}
        hiker={hikers[selectedHikerIndex]}
        onChange={this.handleHikerFieldChange}
      />
    );
  }

  private handleTabChange = (e, value) =>
    this.setState({ activeTab: value });

  private handleSimulationFieldChange = ({ target: { name, value } }) => {
    this.setState(({ simulation }) => ({
      simulation: reduceItemWithChanges(simulation, { [name]: value })
    }));
  };

  private handleHikeFieldChange = ({ target: { name, value } }) => {
    this.setState(({ hike }) => ({
      hike: reduceItemWithChanges(hike, { [name]: value })
    }));
  };

  private handleTrailFieldChange = ({ target: { name, value } }) => {
    this.setState(({
      hike,
      trails,
      selectedTrailIndex,
    }) => {
      const newTrail = reduceItemWithChanges(trails[selectedTrailIndex], { [name]: value });
      const newTrails = reduceListWithItem(trails, selectedTrailIndex, newTrail);
      const newHike = reduceItemWithChanges(hike, { trails: newTrails });
      return {
        hike: newHike,
        trails: newTrails,
      };
    });
  };

  private handleHikerFieldChange = ({ target: { name, value } }) => {
    this.setState(({
      hike,
      trails,
      selectedTrailIndex,
      hikers,
      selectedHikerIndex,
    }) => {
      const newHiker = reduceItemWithChanges(hikers[selectedHikerIndex], { [name]: value });
      const newHikers = reduceListWithItem(hikers, selectedHikerIndex, newHiker);
      const newTrails = reduceListItemWithChanges(trails, selectedTrailIndex, { hikers: newHikers });
      const newHike = reduceItemWithChanges(hike, { trails: newTrails });
      return {
        hike: newHike,
        trails: newTrails,
        hikers: newHikers,
      };
    });
  };

  private handleTrailsSelectionChanged = (index) => {
    this.setState(({ hike}) => ({
      selectedTrailIndex: index,
      selectedHikerIndex: 0,
      hikers: hike && hike.trails[index] ? hike.trails[index].hikers : [],
    }));
  };

  private handleHikersSelectionChanged = (index) => {
    this.setState({
      selectedHikerIndex: index,
    });
  };

  private handleTrailsListChanged = (items) => {
    this.setState(({ hike }) => ({
      hike: reduceItemWithChanges(hike, { trails: items }),
      trails: items,
    }));
  };

  private handleHikersListChanged = (items) => {
    this.setState(({ hike, trails, selectedTrailIndex }) => {
      const newTrails = reduceListItemWithChanges(trails, selectedTrailIndex, { hikers: items });
      return {
        hike: reduceItemWithChanges(hike, { trails: newTrails }),
        trails: newTrails,
        hikers: items
      };
    });
  };
}

export default withStyles(styles)(View);
