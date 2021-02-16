import ActionBehavior, { mixActionBehavior } from '../hikers/actionBehaviors/actionBehavior';
import ColumnsFirstTrailStateModifier from '../trails/trailStateModifiers/columnsFirstTrailStateModifier';
import CoverTrailMixin from '../trails/coverTrailMixin';
import DataBehavior /*, { mixDataBehavior } */ from '../hikers/dataBehaviors/dataBehavior';
import Hike, { mixHike } from '../hikes/hike';
import Hiker, { mixHiker } from '../hikers/hiker';
import LineTrailMixin from '../trails/lineTrailMixin';
import LineTrailStateModifier from '../trails/trailStateModifiers/lineTrailStateModifier';
import MovementBehavior, {
  mixMovementBehavior,
} from '../hikers/movementBehaviors/movementBehavior';
import RecordActionMixin from '../hikers/actionBehaviors/recordActionMixin';
import RecordHikeMixin from '../hikes/recordHikeMixin';
import RecordShapeActionMixin from '../hikers/actionBehaviors/recordShapeActionMixin';
import RowsFirstTrailStateModifier from '../trails/trailStateModifiers/rowsFirstTrailStateModifier';
import TraceActionMixin from '../hikers/actionBehaviors/traceActionMixin';
import Trail, { mixTrail } from '../trails/trail';
import TrailHikerMixin from '../hikers/trailHikerMixin';
import TrailMovementMixin from '../hikers/movementBehaviors/trailMovementMixin';
import getDebugLog from './debugLog';
import invariant from 'tiny-invariant';

const debug = getDebugLog('classFactory');

export function createMovementBehaviorClass(id, name, type, options) {
  debug('createMovementBehaviorClass', { id, name, type, options });
  if (type === 'Trail') {
    const TrailMovementBehaviorClass = mixMovementBehavior(TrailMovementMixin);
    return new TrailMovementBehaviorClass(id, name, options);
  }
  return new MovementBehavior(id, name, options);
}

export function createActionBehaviorClass(id, name, type, options) {
  debug('createActionBehaviorClass', { id, name, type, options });
  let mixins;

  switch (type) {
    case 'Trace':
      mixins = [TraceActionMixin];
      break;
    case 'Record':
      mixins = [RecordActionMixin];
      break;
    case 'RecordShape':
      mixins = [RecordShapeActionMixin, RecordActionMixin];
      break;
    default:
      return new ActionBehavior(id, name, options);
  }
  if (options.trace) {
    mixins.push(TraceActionMixin);
  }
  const ActionBehaviorClass = mixActionBehavior(...mixins);
  return new ActionBehaviorClass(id, name, options);
}

export function createDataBehaviorClass(id, name, type, options) {
  debug('createDataBehaviorClass', { id, name, type, options });
  return new DataBehavior(id, name, options);
}

export function createHikeClass(id, name, type, options) {
  debug('createHikeClass', { id, name, type, options });
  if (type === 'Record') {
    const RecordHikeClass = mixHike(RecordHikeMixin);
    return new RecordHikeClass(id, name, options);
  }
  return new Hike(id, name, options);
}

export function createTrailModifierClass(type, id, name, options) {
  debug('createTrailModifierClass', { type, options });
  switch (type) {
    case 'Line':
      return new LineTrailStateModifier(id, name, options);
    case 'RowsFirst':
      return new RowsFirstTrailStateModifier(id, name, options);
    case 'ColumnsFirst':
      return new ColumnsFirstTrailStateModifier(id, name, options);
    default:
      invariant(true, `Unsupported trail state modifier type '${type};`);
  }
}

export function createTrailClass(id, name, type, options) {
  debug('createTrailClass', { id, name, type, options });
  if (type === 'Line') {
    const LineTrailClass = mixTrail(LineTrailMixin);
    return new LineTrailClass(id, name, options);
  } else if (type === 'Cover') {
    const CoverTrailClass = mixTrail(CoverTrailMixin);
    return new CoverTrailClass(id, name, options);
  }
  return new Trail(id, name, options);
}

export function createHikerClass(id, name, type, options) {
  debug('createHikerClass', { id, name, type, options });
  if (type === 'Trail') {
    const TrailHikerClass = mixHiker(TrailHikerMixin);
    return new TrailHikerClass(id, name, options);
  }
  return new Hiker(id, name, options);
}
