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
import { defaultNewHike, defaultNewTrail, defaultNewHiker } from 'editor/interfaces';

import ReadOnlyTextField from 'editor/components/readOnlyTextField';
import SplitLayout from '../common/splitLayout';
import Hike from '../common/hike';
import Hikes from '../common/hikes';
import Trail from '../common/trail';
import Trails from '../common/trails';
import Hiker from '../common/hiker';
import Hikers from '../common/hikers';

import { RootEditorState } from 'editor/modules';
import {
  simulationsLoadingSelector,
  selectedSimulationSelector,
  hikesLoadingSelector,
  hikeSelector,
  trailSelector,
  hikerSelector,
  orderedHikesSelector,
  orderedTrailsByHikeIdSelector,
  orderedHikersByTrailIdSelector,
} from 'editor/modules/selectors';
import {
  changeSimulation,
  changeHike,
  changeHikeList,
  changeTrail,
  changeTrailList,
  changeHiker,
  changeHikerList,
} from 'editor/modules/actions/sagas';

import _debug from 'debug';
const debug = _debug('lens:editor:simulation:simulationShow:view');

interface IProps {
  editMode?: boolean;
  newMode?: boolean;
  sourceId: string;
  simulationId?: string;
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
  const simulationsLoading = useSelector(simulationsLoadingSelector);
  const hikesLoading = useSelector(hikesLoadingSelector);

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

  const selectedSimulation = useSelector(selectedSimulationSelector);

  const { editMode, newMode } = props;
  const editable = editMode || newMode;
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!hikesLoading) {
      setSelectedHikeIndex(0);
      setSelectedTrailIndex(0);
      setSelectedHikerIndex(0);
      setActiveTab(TABS.HIKE);
    }
  }, [dispatch, hikesLoading]);

  const handleTabChange = (e, value) => setActiveTab(value);

  const handleSimulationFieldChange = ({ target: { name, value } }) =>
    dispatch(changeSimulation({ changes: { [name]: value } }));

  const handleHikeFieldChange = ({ target: { name, value } }) =>
    dispatch(changeHike({ id: selectedHike.id, changes: { [name]: value } }));

  const handleTrailFieldChange = ({ target: { name, value } }) =>
    dispatch(changeTrail({ id: selectedTrail.id, changes: { [name]: value } }));

  const handleHikerFieldChange = ({ target: { name, value } }) =>
    dispatch(changeHiker({ id: selectedHiker.id, changes: { [name]: value } }));

  const handleHikesSelectionChanged = index => {
    debug('handleHikesSelectionChanged', { index, selectedHikeIndex });
    if (index !== selectedHikeIndex) {
      setSelectedHikeIndex(index);
    }
    if (activeTab !== TABS.HIKE) {
      setActiveTab(TABS.HIKE);
      if (selectedTrailIndex > 0) {
        setSelectedTrailIndex(0);
        setSelectedHikerIndex(0);
      }
    }
  };

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

  const handleHikesListChanged = (items, removed, addNew) => {
    const newHike = addNew
      ? defaultNewHike({
          order: orderedHikes ? orderedHikes.length : 0,
          trails: [],
          isNew: true,
        })
      : undefined;
    dispatch(changeHikeList({ items, removed, newHike }));
  };

  const handleTrailsListChanged = (items, removed, addNew) => {
    const newTrail = addNew
      ? defaultNewTrail({
          order: orderedTrails ? orderedTrails.length : 0,
          hikers: [],
          hikeId: selectedHike.id,
          isNew: true,
        })
      : undefined;
    dispatch(changeTrailList({ hikeId: selectedHike.id, items, removed, newTrail }));
  };

  const handleHikersListChanged = (items, removed, addNew) => {
    const newHiker = addNew
      ? defaultNewHiker({
          order: orderedHikers ? orderedHikers.length : 0,
          trailId: selectedTrail.id,
          isNew: true,
        })
      : undefined;
    dispatch(
      changeHikerList({
        hikeId: selectedHike.id,
        trailId: selectedTrail.id,
        items,
        removed,
        newHiker,
      }),
    );
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
        {!editable && (
          <ReadOnlyTextField
            label='Name'
            margin='dense'
            multiline
            value={selectedSimulation.name}
            fullWidth
            disabled
          />
        )}
        {editable && (
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
        <Hikes
          disabled={!editable}
          items={orderedHikes}
          selectedIndex={selectedHikeIndex}
          onListChanged={handleHikesListChanged}
          onSelectionChanged={handleHikesSelectionChanged}
        />
        <Trails
          disabled={!editable}
          items={orderedTrails}
          selectedIndex={selectedTrailIndex}
          onListChanged={handleTrailsListChanged}
          onSelectionChanged={handleTrailsSelectionChanged}
        />
        <Hikers
          disabled={!editable}
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
          <Hike disabled={!editable} hike={selectedHike} onChange={handleHikeFieldChange} />
        )
      );
    }

    if (activeTab === TABS.TRAIL) {
      return (
        selectedTrail.id && (
          <Trail disabled={!editable} trail={selectedTrail} onChange={handleTrailFieldChange} />
        )
      );
    }

    return (
      selectedHiker.id && (
        <Hiker disabled={!editable} hiker={selectedHiker} onChange={handleHikerFieldChange} />
      )
    );
  };

  return (
    <SplitLayout
      title='Simulation'
      contentLeft={renderSimulation()}
      contentRight={renderContent()}
      controls={renderTabs()}
    />
  );
};

export default View;
