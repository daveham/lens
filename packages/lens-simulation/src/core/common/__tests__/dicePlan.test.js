import Size from '../../../basic/size';
import DicePlan from '../dicePlan';

describe('DicePlan', () => {
  describe('construct', () => {
    test('from grain, step, depth', () => {
      const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);

      expect(plan.depth).toEqual(0);
      expect(plan.step.equals([2, 2])).toBeTruthy();
      expect(plan.grain.equals([16, 16])).toBeTruthy();
    });

    test('from other plan at 0, depth at 0', () => {
      const otherPlan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);
      const plan = new DicePlan(otherPlan, 0);

      expect(plan.depth).toEqual(0);
      expect(plan.step.equals([2, 2])).toBeTruthy();
      expect(plan.grain.equals([16, 16])).toBeTruthy();
    });

    test('from other plan at 1, depth at 0', () => {
      const otherPlan = new DicePlan(new Size(32, 32), new Size(2, 2), 1);
      const plan = new DicePlan(otherPlan, 0);

      expect(plan.depth).toEqual(0);
      expect(plan.step.toString()).toEqual('{ width: 2, height: 2 }');
      expect(plan.grain.toString()).toEqual('{ width: 16, height: 16 }');
    });

    test('from other plan at 1, depth at 2', () => {
      const otherPlan = new DicePlan(new Size(32, 32), new Size(2, 2), 1);
      const plan = new DicePlan(otherPlan, 2);

      expect(plan.depth).toEqual(2);
      expect(plan.step.toString()).toEqual('{ width: 2, height: 2 }');
      expect(plan.grain.toString()).toEqual('{ width: 64, height: 64 }');
    });
  });

  test('calculatePlanAtDepth', () => {
    const plan = new DicePlan(new Size(16, 16), new Size(2, 2), 0);
    const planOne = plan.calculatePlanAtDepth(1);
    expect(planOne.depth).toEqual(1);
    expect(planOne.step.toString()).toEqual('{ width: 2, height: 2 }');
    expect(planOne.grain.toString()).toEqual('{ width: 32, height: 32 }');

    const planThree = plan.calculatePlanAtDepth(3);
    expect(planThree.depth).toEqual(3);
    expect(planThree.step.toString()).toEqual('{ width: 2, height: 2 }');
    expect(planThree.grain.toString()).toEqual('{ width: 128, height: 128 }');
  });
});
