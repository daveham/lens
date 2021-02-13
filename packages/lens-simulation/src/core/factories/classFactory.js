import ColumnsFirstTrailStateModifier from '../trails/trailStateModifiers/columnsFirstTrailStateModifier';
import CoverTrailStrategyMixin from '../trails/coverTrailStrategy';
import LineTrailStateModifier from '../trails/trailStateModifiers/lineTrailStateModifier';
import LineTrailStrategyMixin from '../trails/lineTrailStrategy';
import RecordActionStrategyMixin from '../hikers/actionBehaviors/recordActionStrategy';
import RecordShapeActionStrategyMixin from '../hikers/actionBehaviors/recordShapeActionStrategy';
import RowsFirstTrailStateModifier from '../trails/trailStateModifiers/rowsFirstTrailStateModifier';
import TraceActionStrategyMixin from '../hikers/actionBehaviors/traceActionStrategy';
import TrailHikerStrategyMixin from '../hikers/trailHikerStrategy';
import TrailMovementStrategyMixin from '../hikers/movementBehaviors/trailMovementStrategy';
import getDebugLog from './debugLog';
import invariant from 'tiny-invariant';
import {
  BaseActionBehaviorStrategy,
  mixActionBehaviorStrategy,
} from '../hikers/actionBehaviors/actionBehavior';
import { BaseDataBehaviorStrategy } from '../hikers/dataBehaviors/dataBehavior';
import { BaseHikeStrategy } from '../hikes/hike';
import { BaseHikerStrategy, mixHikerStrategy } from '../hikers/hiker';
import {
  BaseMovementBehaviorStrategy,
  mixMovementBehaviorStrategy,
} from '../hikers/movementBehaviors/movementBehavior';
import { BaseTrailStrategy, mixTrailStrategy } from '../trails/trail';

const debug = getDebugLog('definitionFactory');

export function createMovementBehaviorStrategyClass(type, options) {
  debug('createMovementBehaviorStrategyClass', { type, options });
  if (type === 'Trail') {
    const TrailMovementBehaviorStrategy = mixMovementBehaviorStrategy(TrailMovementStrategyMixin);
    return new TrailMovementBehaviorStrategy(options);
  }
  return new BaseMovementBehaviorStrategy(options);
}

export function createActionBehaviorStrategyClass(type, options) {
  debug('createActionBehaviorStrategyClass', { type });
  let mixins;

  switch (type) {
    case 'Trace':
      mixins = [TraceActionStrategyMixin];
      break;
    case 'Record':
      mixins = [RecordActionStrategyMixin];
      break;
    case 'RecordShape':
      mixins = [RecordShapeActionStrategyMixin, RecordActionStrategyMixin];
      break;
    default:
      return new BaseActionBehaviorStrategy(options);
  }
  if (options.trace) {
    mixins.push(TraceActionStrategyMixin);
  }
  const StrategyClass = mixActionBehaviorStrategy(...mixins);
  return new StrategyClass(options);
}

export function createDataBehaviorStrategyClass(type, options) {
  debug('createDataBehaviorStrategyClass', { type, options });
  return new BaseDataBehaviorStrategy(options);
}

export function createHikeStrategyClass(type, options) {
  debug('createHikeStrategyClass', { type, options });
  return new BaseHikeStrategy(options);
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

export function createTrailStrategyClass(type, options) {
  debug('createTrailStrategyClass', { type, options });
  if (type === 'Line') {
    const LineTrailStrategy = mixTrailStrategy(LineTrailStrategyMixin);
    return new LineTrailStrategy(options);
  } else if (type === 'Cover') {
    const CoverTrailStrategy = mixTrailStrategy(CoverTrailStrategyMixin);
    return new CoverTrailStrategy(options);
  }
  return new BaseTrailStrategy(options);
}

export function createHikerStrategyClass(type, options) {
  debug('createHikerStrategyClass', { type, options });
  if (type === 'Trail') {
    const TrailHikerStrategy = mixHikerStrategy(TrailHikerStrategyMixin);
    return new TrailHikerStrategy(options);
  }
  return new BaseHikerStrategy(options);
}
