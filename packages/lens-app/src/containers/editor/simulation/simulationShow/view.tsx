import React, { Fragment } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
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
  sourceId: string;
  simulationId: number;
  simulation: ISimulation;
  loading: boolean;
  hike?: IHike;
}

interface IState {
  activeTab: number;
  hike: IHike;
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
      hike,
      selectedTrailIndex: 0,
      trails,
      selectedHikerIndex: 0,
      hikers,
    };
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState): void {
    const { hike } = this.props;
    if (prevProps.hike !== hike) {
      this.setState({
        hike,
        trails: hike.trails,
        hikers: hike.trails[0].hikers,
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
    const { simulation: { name } } = this.props;
    const {
      trails,
      selectedTrailIndex,
      hikers,
      selectedHikerIndex,
    } = this.state;
    return (
      <Fragment>
        <ReadOnlyTextField
          label='Name'
          margin='dense'
          multiline
          value={name}
          fullWidth
          disabled
        />
        <Trails
          disabled
          items={trails}
          selectedIndex={selectedTrailIndex}
          onListChanged={this.handleTrailsListChanged}
          onSelectionChanged={this.handleTrailsSelectionChanged}
        />
        <Hikers
          disabled
          items={hikers}
          selectedIndex={selectedHikerIndex}
          onListChanged={this.handleHikersListChanged}
          onSelectionChanged={this.handleHikersSelectionChanged}
        />
      </Fragment>
    );
  }

  private renderContent(): any {
    const {
      activeTab,
      hike,
      trails,
      selectedTrailIndex,
      hikers,
      selectedHikerIndex,
    } = this.state;

    if (activeTab === 0) {
      return (
        <Hike
          disabled
          hike={hike}
          onChange={this.handleHikeFieldChange}
        />
      );
    }

    if (activeTab === 1) {
      return (
        <Trail
          disabled
          trail={trails[selectedTrailIndex]}
          onChange={this.handleTrailFieldChange}
        />
      );
    }

    return (
      <Hiker
        disabled
        hiker={hikers[selectedHikerIndex]}
        onChange={this.handleHikerFieldChange}
      />
    );
  }

  private handleTabChange = (e, value) =>
    this.setState({ activeTab: value });

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
    this.setState((prevState) => ({
      selectedTrailIndex: index,
      selectedHikerIndex: 0,
      hikers: prevState.hike.trails[index].hikers,
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
