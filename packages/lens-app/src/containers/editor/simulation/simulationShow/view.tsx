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

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationShow:view');

const hikeData = {
  id: 1,
  name: 'Simple',
  type: 'simple',
  size: 'full',
  logger: 'none',
  trackWriter: 'none',
};

const trailsData = [
  { id: 1, name: 'Simple' },
  { id: 2, name: 'One' },
  { id: 3, name: 'Two' },
  { id: 4, name: 'Three' },
];

const hikersData = [
  { id: 1, name: 'Simple' },
  { id: 2, name: 'One' },
  { id: 3, name: 'Two' },
  { id: 4, name: 'Three' },
  { id: 5, name: 'Four' },
  { id: 6, name: 'Five' },
  { id: 7, name: 'Six' },
  { id: 8, name: 'Seven' },
  { id: 9, name: 'Eight' },
];

const hikeInstance: any = { ...hikeData };
hikeInstance.trails = trailsData.map((t) => ({ ...t }));
hikeInstance.trails.forEach((t) => {
  t.hikers = hikersData.map((k) => ({ ...k, id: k.id + t.id * 10, name: `${k.name}.${t.id}.${k.id}` }));
});

interface IProps {
  classes?: any;
  sourceId: string;
  simulationId: number;
  simulation: ISimulation;
  loading: boolean;
  hike?: IHike;
  trailList?: ReadonlyArray<ITrail>;
  hikerList?: ReadonlyArray<IHiker>;
}

interface IState {
  activeTab: number;
  hike: IHike;
  trailList: ReadonlyArray<ITrail>;
  hikerList: ReadonlyArray<IHiker>;
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
    this.state = {
      activeTab: 0,
      hike: props.hike || hikeInstance,
      selectedTrailIndex: 0,
      trailList: props.trailList || hikeInstance.trails,
      selectedHikerIndex: 0,
      hikerList: props.hikerList || hikeInstance.trails[0].hikers,
    };
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState): void {
    const { hike, trailList, hikerList } = this.props;
    if (prevProps.hike !== hike ||
      prevProps.trailList !== trailList ||
      prevProps.hikerList !== hikerList) {
      const newState: any = {};
      if (prevProps.hike !== hike) {
        newState.hike = hike;
      }
      if (prevProps.trailList !== trailList) {
        newState.trailList = trailList;
        newState.selectedTrailIndex = 0;
      }
      if (prevProps.hikerList !== hikerList) {
        newState.hikerList = hikerList;
        newState.selectedHikerIndex = 0;
      }
      this.setState(newState);
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
      trailList,
      selectedTrailIndex,
      hikerList,
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
          items={trailList}
          selectedIndex={selectedTrailIndex}
          onListChanged={this.handleTrailsListChanged}
          onSelectionChanged={this.handleTrailsSelectionChanged}
        />
        <Hikers
          disabled
          items={hikerList}
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
      trailList,
      selectedTrailIndex,
      hikerList,
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
          trail={trailList[selectedTrailIndex]}
          onChange={this.handleTrailFieldChange}
        />
      );
    }

    return (
      <Hiker
        disabled
        hiker={hikerList[selectedHikerIndex]}
        onChange={this.handleHikerFieldChange}
      />
    );
  }

  private handleTabChange = (e, value) =>
    this.setState({ activeTab: value });

  private handleHikeFieldChange = ({ target: { name, value } }) => {
    this.setState(({ hike }) => ({
      hike: reduceItem(hike, { [name]: value })
    }));
  };

  private handleTrailFieldChange = ({ target: { name, value } }) => {
    this.setState(({
      hike,
      trailList,
      selectedTrailIndex,
    }) => {
      const newTrail = reduceItem(trailList[selectedTrailIndex], { [name]: value });
      const newTrails = reduceList(trailList, selectedTrailIndex, newTrail);
      const newHike = reduceItem(hike, { trails: newTrails });
      return {
        hike: newHike,
        trailList: newTrails,
      };
    });
  };

  private handleHikerFieldChange = ({ target: { name, value } }) => {
    this.setState(({
      hike,
      trailList,
      selectedTrailIndex,
      hikerList,
      selectedHikerIndex,
    }) => {
      const newHiker = reduceItem(hikerList[selectedHikerIndex], { [name]: value });
      const newHikers = reduceList(hikerList, selectedHikerIndex, newHiker);
      const newTrails = reduceListItem(trailList, selectedTrailIndex, { hikers: newHikers });
      const newHike = reduceItem(hike, { trails: newTrails });
      return {
        hike: newHike,
        trailList: newTrails,
        hikerList: newHikers,
      };
    });
  };

  private handleTrailsSelectionChanged = (index) => {
    this.setState((prevState) => ({
      selectedTrailIndex: index,
      selectedHikerIndex: 0,
      hikerList: prevState.hike.trails[index].hikers,
    }));
  };

  private handleHikersSelectionChanged = (index) => {
    this.setState({
      selectedHikerIndex: index,
    });
  };

  private handleTrailsListChanged = (items) => {
    this.setState(({ hike }) => ({
      hike: reduceItem(hike, { trails: items }),
      trailList: items,
    }));
  };

  private handleHikersListChanged = (items) => {
    this.setState(({ hike, trailList, selectedTrailIndex }) => {
      const newTrails = reduceListItem(trailList, selectedTrailIndex, { hikers: items });
      return {
        hike: reduceItem(hike, { trails: newTrails }),
        trailList: newTrails,
        hikerList: items
      };
    });
  };
}

function reduceItem(item, changes) {
  return { ...item, ...changes };
}

function reduceListItem(list, itemIndex, itemChanges) {
  return list.map((item, index) => {
    return index === itemIndex
      ? reduceItem(item, itemChanges)
      : item;
  });
}

function reduceList(list, itemIndex, newItem) {
  return list.map((item, index) => {
    return index === itemIndex
      ? newItem
      : item;
  });
}

export default withStyles(styles)(View);
