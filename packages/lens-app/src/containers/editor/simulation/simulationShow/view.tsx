import React, { Fragment, useState, useEffect } from 'react';
import {
  useSelector as useSelectorGeneric,
  useDispatch,
  TypedUseSelectorHook,
} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
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

// import {
//   reduceItemWithChanges,
//   reduceListWithItem,
//   reduceListItemWithChanges,
//   initialHike,
// } from 'editor/simulation/common/helpers';
import { RootEditorState } from 'editor/modules';
import {
  simulationsSelector,
  simulationsLoadingSelector,
  hikesSelector,
  hikesLoadingSelector,
  formSelector,
  detailFormSelector,
} from 'editor/modules/selectors';
import {
  setForm,
  updateForm,
  setDetailForm,
  updateDetailForm,
  requestHikes,
} from 'editor/modules/actions';

import _debug from 'debug';
const debug = _debug('lens:editor:simulation:simulationShow:view');

interface IProps {
  editMode?: boolean;
  sourceId: string;
  simulationId: string;
}

const TABS = {
  HIKE: 0,
  TRAIL: 1,
  HIKER: 2,
};

const useStyles: any = makeStyles((theme: any) => ({
  tabIndicator: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const View = (props: IProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(TABS.HIKE);
  const [selectedTrailIndex, setSelectedTrailIndex] = useState(0);
  const [selectedHikerIndex, setSelectedHikerIndex] = useState(0);
  const [currentSimulation, setCurrentSimulation] = useState<ISimulation|undefined>(undefined);
  const [currentHike, setCurrentHike] = useState<IHike | undefined>(undefined);

  const useSelector: TypedUseSelectorHook<RootEditorState> = useSelectorGeneric;
  const simulations = useSelector<ReadonlyArray<ISimulation>>(simulationsSelector);
  const simulationsLoading = useSelector(simulationsLoadingSelector);
  const hikes = useSelector<ReadonlyArray<IHike>>(hikesSelector);
  const hikesLoading = useSelector(hikesLoadingSelector);
  const form = useSelector<ISimulation>(formSelector);
  const detailForm = useSelector<IHike|ITrail|IHiker>(detailFormSelector);

  const { sourceId, simulationId, editMode } = props;

  useEffect(() => {
    if (!simulationId || !(simulations && simulations.length)) {
      debug('useEffect:simulations - setCurrentSimulation=undefined');
      setCurrentSimulation(undefined);
    } else {
      const simulation = simulations.find(s => s.id === simulationId);
      debug('useEffect:simulations', { simulationId, simulation });
      setCurrentSimulation(simulation);
      dispatch(requestHikes({ sourceId, simulationId }));
    }
  }, [simulations, simulationId, sourceId, dispatch]);
  useEffect(() => {
    debug('useEffect:currentSimulation', { currentSimulation });
    dispatch(setForm(currentSimulation))
  }, [currentSimulation, dispatch]);

  useEffect(() => {
    const hike = hikes && hikes.length ? hikes[0] : undefined;
    debug('useEffect:hikes', { hike });
    setCurrentHike(hike);
    setSelectedTrailIndex(0);
    setSelectedHikerIndex(0);
  }, [hikes]);
  useEffect(() => {
    debug('useEffect:currentHike', { currentHike });
    dispatch(setDetailForm(currentHike));
  }, [currentHike, dispatch]);

  const trails = currentHike ? (currentHike!.trails || []) : [];
  const trail = trails.length ? trails[selectedTrailIndex] : undefined;
  const hikers = trail ? trail.hikers : [];
  const hiker = hikers.length ? hikers[selectedHikerIndex] : undefined;

  const handleTabChange = (e, value) => setActiveTab(value);

  const handleSimulationFieldChange = ({ target: { name, value } }) =>
    dispatch(updateForm({ [name]: value }));

  const handleHikeFieldChange = ({ target: { name, value } }) =>
    dispatch(updateDetailForm({ [name]: value }));

  const handleTrailFieldChange = ({ target: { name, value } }) =>
    dispatch(updateDetailForm({ [name]: value }));

  const handleHikerFieldChange = ({ target: { name, value } }) =>
    dispatch(updateDetailForm({ [name]: value }));

  const handleTrailsSelectionChanged = (index) => {
    setSelectedTrailIndex(index);
    setActiveTab(TABS.TRAIL);
    setSelectedHikerIndex(0);
  };

  const handleHikersSelectionChanged = (index) => {
    setSelectedHikerIndex(index);
    setActiveTab(TABS.HIKER);
  };

  const handleTrailsListChanged = (items) => {
    debug('handleTrailsListChanged', items);
    // this.setState(({ hike }) => ({
    //   hike: reduceItemWithChanges(hike, { trails: items }),
    //   trails: items,
    // }));
  };

  const handleHikersListChanged = (items) => {
    debug('handleHikersListChanged', items);
    // this.setState(({ hike, trails, selectedTrailIndex }) => {
    //   const newTrails = reduceListItemWithChanges(trails, selectedTrailIndex, { hikers: items });
    //   return {
    //     hike: reduceItemWithChanges(hike, { trails: newTrails }),
    //     trails: newTrails,
    //     hikers: items
    //   };
    // });
  };

  const renderTabs = () => (
    <Tabs
      classes={{ indicator: classes.tabIndicator }}
      value={activeTab}
      indicatorColor='primary'
      textColor='inherit'
      onChange={handleTabChange}
    >
      <Tab label='Hike' />
      <Tab label='Trail' />
      <Tab label='Hiker' />
    </Tabs>
  );

  const renderSimulation = () => {
    if (!(form && form.name)) {
      return null;
    }
    return (
      <Fragment>
        {!editMode && (
          <ReadOnlyTextField
            label='Name'
            margin='dense'
            multiline
            value={form.name}
            fullWidth
            disabled
          />
        )}
        {editMode && (
          <TextField
            label='Name'
            margin='normal'
            multiline
            onChange={handleSimulationFieldChange}
            inputProps={{
              name: 'name',
              id: 'simulation-name'
            }}
            value={form.name}
            fullWidth
            required
          />
        )}
        <Trails
          disabled={!editMode}
          items={trails}
          selectedIndex={selectedTrailIndex}
          onListChanged={handleTrailsListChanged}
          onSelectionChanged={handleTrailsSelectionChanged}
        />
        <Hikers
          disabled={!editMode}
          items={hikers}
          selectedIndex={selectedHikerIndex}
          onListChanged={handleHikersListChanged}
          onSelectionChanged={handleHikersSelectionChanged}
        />
      </Fragment>
    );
  };

  const renderContent = () => {
    if (activeTab === TABS.HIKE) {
      return (
        <Hike
          disabled={!editMode}
          hike={detailForm as IHike}
          onChange={handleHikeFieldChange}
        />
      );
    }

    if (activeTab === TABS.TRAIL) {
      return trail && (
        <Trail
          disabled={!editMode}
          trail={trail}
          onChange={handleTrailFieldChange}
        />
      );
    }

    return hiker && (
      <Hiker
        disabled={!editMode}
        hiker={hiker}
        onChange={handleHikerFieldChange}
      />
    );
  };

  if (simulationsLoading) {
    return null;
  }

  return (
    <Layout
      title='Simulation'
      contentLeft={renderSimulation()}
      contentRight={renderContent()}
      controls={renderTabs()}
    />
  );
};

export default View;
