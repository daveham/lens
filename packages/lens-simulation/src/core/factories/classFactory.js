import RecordActionStrategyMixin from '../hikers/actionBehaviors/recordActionStrategy';
import RecordShapeActionStrategyMixin from '../hikers/actionBehaviors/recordShapeActionStrategy';
import TraceActionStrategyMixin from '../hikers/actionBehaviors/traceActionStrategy';
import TrailMovementStrategyMixin from '../hikers/movementBehaviors/trailMovementStrategy';
import getDebugLog from './debugLog';
import {
  BaseActionBehaviorStrategy,
  mixActionBehaviorStrategy,
} from '../hikers/actionBehaviors/actionBehavior';
import {
  BaseMovementBehaviorStrategy,
  mixMovementBehaviorStrategy,
} from '../hikers/movementBehaviors/movementBehavior';

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
