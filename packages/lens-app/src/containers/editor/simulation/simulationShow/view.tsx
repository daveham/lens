import React, { useState, useEffect } from 'react';
import {
  useSelector as useSelectorGeneric,
  useDispatch,
  shallowEqual,
  TypedUseSelectorHook,
} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import {
  ISimulation,
  // IHike,
  // ITrail,
  // IHiker,
} from 'editor/interfaces';

import ReadOnlyTextField from 'editor/components/readOnlyTextField';
import Layout from '../common/layout';
import Hike from '../common/hike';
import Trail from '../common/trail';
import Trails from '../common/trails';
import Hiker from '../common/hiker';
import Hikers from '../common/hikers';

import { RootEditorState } from 'editor/modules';
import {
  simulationsSelector,
  simulationsLoadingSelector,
  simulationSelector,
  hikeSelector,
  trailSelector,
  hikerSelector,
  orderedHikesSelector,
  orderedTrailsByHikeIdSelector,
  orderedHikersByTrailIdSelector,
} from 'editor/modules/selectors';
import {
  setSimulation,
  changeSimulation,
  changeHike,
  changeTrail,
  changeTrailList,
  changeHiker,
  changeHikerList,
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

const emptyArray = [];
const emptyObject = {};

const View = (props: IProps) => {
  const [activeTab, setActiveTab] = useState(TABS.HIKE);
  const [selectedHikeIndex, setSelectedHikeIndex] = useState(0);
  const [selectedTrailIndex, setSelectedTrailIndex] = useState(0);
  const [selectedHikerIndex, setSelectedHikerIndex] = useState(0);

  const useSelector: TypedUseSelectorHook<RootEditorState> = useSelectorGeneric;
  const simulations = useSelector<ReadonlyArray<ISimulation>>(simulationsSelector);
  const simulationsLoading = useSelector(simulationsLoadingSelector);

  const orderedHikes = useSelector(orderedHikesSelector, shallowEqual);

  const selectedHike = useSelector(state => {
    if (orderedHikes.length > 0) {
      return hikeSelector(state, orderedHikes[selectedHikeIndex].id);
    }
    return emptyObject;
  });

  const orderedTrails = useSelector(state => {
    if (selectedHike.id) {
      // @ts-ignore
      return orderedTrailsByHikeIdSelector(state, selectedHike.id);
    }
    return emptyArray;
  });

  const selectedTrail = useSelector(state => {
    if (orderedTrails.length > 0) {
      return trailSelector(state, orderedTrails[selectedTrailIndex].id);
    }
    return emptyObject;
  });

  const orderedHikers = useSelector(state => {
    if (selectedTrail.id) {
      // @ts-ignore
      return orderedHikersByTrailIdSelector(state, selectedTrail.id);
    }
    return emptyArray;
  });

  const selectedHiker = useSelector(state => {
    if (orderedHikers.length > 0) {
      return hikerSelector(state, orderedHikers[selectedHikerIndex].id);
    }
    return emptyObject;
  });

  const selectedSimulation = useSelector(simulationSelector);

  const { sourceId, simulationId, editMode } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  // new or changed simulations/simulationId
  useEffect(() => {
    if (!simulationId || !(simulations && simulations.length)) {
      debug('useEffect:simulations - simulation=undefined');
      dispatch(setSimulation());
    } else {
      const simulation = simulations.find(s => s.id === simulationId);
      debug('useEffect:simulations', { simulationId, simulation });
      dispatch(setSimulation(simulation));
      dispatch(requestHikes({ sourceId, simulationId }));
    }
  }, [simulations, simulationId, sourceId, dispatch]);

  const handleTabChange = (e, value) => setActiveTab(value);

  const handleSimulationFieldChange = ({ target: { name, value } }) =>
    dispatch(changeSimulation({ changes: { [name]: value } }));

  const handleHikeFieldChange = ({ target: { name, value } }) =>
    dispatch(changeHike({ id: selectedHike.id, changes: { [name]: value } }));

  const handleTrailFieldChange = ({ target: { name, value } }) =>
    dispatch(changeTrail({ id: selectedTrail.id, changes: { [name]: value } }));

  const handleHikerFieldChange = ({ target: { name, value } }) =>
    dispatch(changeHiker({ id: selectedHiker.id, changes: { [name]: value } }));

  const handleTrailsSelectionChanged = index => {
    debug('handleTrailsSelectionChanged', { index, selectedTrailIndex });
    if (index !== selectedTrailIndex) {
      setSelectedTrailIndex(index);
    }
    if (activeTab !== TABS.TRAIL) {
      setActiveTab(TABS.TRAIL);
      if (selectedHikerIndex > 0) {
        setSelectedHikerIndex(0);
      }
    }
  };

  const handleHikersSelectionChanged = index => {
    debug('handleHikersSelectionChanged', { index, selectedHikerIndex });
    if (index !== selectedHikerIndex) {
      setSelectedHikerIndex(index);
    }
    if (activeTab !== TABS.HIKER) {
      setActiveTab(TABS.HIKER);
    }
  };

  const handleTrailsListChanged = (items, removed) => {
    dispatch(changeTrailList({ items, removed }));
  };

  const handleHikersListChanged = (items, removed) => {
    dispatch(changeHikerList({ items, removed }));
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
    if (!(selectedSimulation && (selectedSimulation.name || selectedSimulation.nameError))) {
      return null;
    }
    return (
      <>
        {!editMode && (
          <ReadOnlyTextField
            label='Name'
            margin='dense'
            multiline
            value={selectedSimulation.name}
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
              id: 'simulation-name',
            }}
            value={selectedSimulation.name}
            helperText={selectedSimulation.nameError}
            error={Boolean(selectedSimulation.nameError)}
            fullWidth
            required
          />
        )}
        <Trails
          disabled={!editMode}
          items={orderedTrails}
          selectedIndex={selectedTrailIndex}
          onListChanged={handleTrailsListChanged}
          onSelectionChanged={handleTrailsSelectionChanged}
        />
        <Hikers
          disabled={!editMode}
          items={orderedHikers}
          selectedIndex={selectedHikerIndex}
          onListChanged={handleHikersListChanged}
          onSelectionChanged={handleHikersSelectionChanged}
        />
      </>
    );
  };

  const renderContent = () => {
    if (simulationsLoading) {
      return null;
    }

    if (activeTab === TABS.HIKE) {
      return (
        selectedHike.id && (
          <Hike disabled={!editMode} hike={selectedHike} onChange={handleHikeFieldChange} />
        )
      );
    }

    if (activeTab === TABS.TRAIL) {
      return (
        selectedTrail.id && (
          <Trail disabled={!editMode} trail={selectedTrail} onChange={handleTrailFieldChange} />
        )
      );
    }

    return (
      selectedHiker.id && (
        <Hiker disabled={!editMode} hiker={selectedHiker} onChange={handleHikerFieldChange} />
      )
    );
  };

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
