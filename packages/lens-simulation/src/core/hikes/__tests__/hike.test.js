import * as R from 'ramda';
import Size from '../../../basic/size';
import DicePlan from '../../common/dicePlan';
import Hike from '../hike';
import Trail from '../../trails/trail';
import Hiker from '../../hikers/hiker';

import getDebugLog from '../debugLog';
const debug = getDebugLog('hikerTests');

describe('hike', () => {
  test('null strategy merge', () => {
    class NullStrategy {
      label = 'nullStrategy';

      nullFunc() {
        return 'null';
      }

      replacedFunc() {
        return 'null replaced';
      }
    }

    const mixedStrategy = (...args) => R.compose(...args)(NullStrategy);

    const StrategyMixin = superclass =>
      class extends superclass {
        label = 'strategy';

        strategyFunc() {
          return 'strategy';
        }

        replacedFunc() {
          return 'strategy replaced';
        }
      };

    const StrategyClass = mixedStrategy(StrategyMixin);
    const strategy = new StrategyClass();

    const nullStrategy = new NullStrategy();

    expect(nullStrategy.label).toEqual('nullStrategy');
    expect(nullStrategy.nullFunc()).toEqual('null');
    expect(nullStrategy.replacedFunc()).toEqual('null replaced');

    expect(strategy.label).toEqual('strategy');
    expect(strategy.nullFunc()).toEqual('null');
    expect(strategy.strategyFunc()).toEqual('strategy');
    expect(strategy.replacedFunc()).toEqual('strategy replaced');
  });

  test('runs active hikers', () => {
    const testPlan = new DicePlan(new Size(8, 8), new Size(2, 2));
    const testHike = new Hike(1, 'mock-hike', new Size(200, 100));
    const testTrail = new Trail(2, 'mock-trail');
    testTrail.initialize(testPlan, testHike);
    testHike.addTrail(testTrail);
    const testHiker = new Hiker(3, 'mock-hiker', testTrail);
    testTrail.addHiker(testHiker);

    return testHike
      .run()
      .then(() => {
        expect(testHike.stepCount).toEqual(1);
      })
      .catch(err => {
        debug('runs active hikers test error', err);
      });
  });
});
