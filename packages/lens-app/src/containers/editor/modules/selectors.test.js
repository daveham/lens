import {
  simulationValid,
  allHikesValid,
  allTrailsValid,
  allHikersValid,
  simulationAndDataValid,
} from './selectors';

describe('editor selectors', () => {
  const testItems = {
    one: { name: 'one' },
    two: { name: 'two' },
    three: { name: 'three' },
  };

  describe('simulationValid selector', () => {
    it('indicates valid simulation', () => {
      const state = {
        editor: {
          simulation: {
            name: 'one',
          },
        },
      };
      expect(simulationValid(state)).toBeTruthy();
    });

    it('indicates invalid simulation', () => {
      const state = {
        editor: {
          simulation: {
            name: 'one',
            nameError: true,
          },
        },
      };
      expect(simulationValid(state)).toBeFalsy();
    });

    it('only recomputes on simulation change', () => {
      const state = {
        editor: {
          simulation: {
            name: 'one',
          },
        },
      };
      simulationValid.resetRecomputations();
      simulationValid(state);
      simulationValid(state);
      expect(simulationValid.recomputations()).toBe(1);
      const nextState = {
        ...state,
        editor: {
          ...state.editor,
          simulation: {
            ...state.editor.simulation,
            name: 'two',
          },
        },
      };
      simulationValid(nextState);
      expect(simulationValid.recomputations()).toBe(2);
    });
  });

  describe('allHikesValid selector', () => {
    it('indicates valid hikes', () => {
      const state = {
        editor: {
          hikesById: {
            ...testItems,
          },
        },
      };
      expect(allHikesValid(state)).toBeTruthy();
    });

    it('indicates invalid hikes', () => {
      const state = {
        editor: {
          hikesById: {
            ...testItems,
            four: { name: 'four', nameError: true },
          },
        },
      };
      expect(allHikesValid(state)).toBeFalsy();
    });
  });

  describe('allTrailsValid selector', () => {
    it('indicates valid trails', () => {
      const state = {
        editor: {
          trailsById: {
            ...testItems,
          },
        },
      };
      expect(allTrailsValid(state)).toBeTruthy();
    });

    it('indicates invalid trails', () => {
      const state = {
        editor: {
          trailsById: {
            ...testItems,
            four: { name: 'four', nameError: true },
          },
        },
      };
      expect(allTrailsValid(state)).toBeFalsy();
    });
  });

  describe('allHikersValid selector', () => {
    it('indicates valid hikers', () => {
      const state = {
        editor: {
          hikersById: {
            ...testItems,
          },
        },
      };
      expect(allHikersValid(state)).toBeTruthy();
    });

    it('indicates invalid hikers', () => {
      const state = {
        editor: {
          hikersById: {
            ...testItems,
            four: { name: 'four', nameError: true },
          },
        },
      };
      expect(allHikersValid(state)).toBeFalsy();
    });
  });

  describe('simulationAndDataValid selector', () => {
    it('detects valid', () => {
      const state = {
        editor: {
          simulation: { name: 'one' },
          hikesById: { ...testItems },
          trailsById: { ...testItems },
          hikersById: { ...testItems },
        }
      };
      expect(simulationAndDataValid(state)).toBeTruthy();
    });

    it('detects invalid', () => {
      const state = {
        editor: {
          simulation: { name: 'one' },
          hikesById: { ...testItems },
          trailsById: { ...testItems, four: { name: 'four', nameError: true } },
          hikersById: { ...testItems },
        }
      };
      expect(simulationAndDataValid(state)).toBeFalsy();
    });

    it('only recomputes on changes', () => {
      const state = {
        editor: {
          simulation: { name: 'one' },
          hikesById: { ...testItems },
          trailsById: { ...testItems },
          hikersById: { ...testItems },
        }
      };
      simulationValid.resetRecomputations();
      allHikesValid.resetRecomputations();
      allTrailsValid.resetRecomputations();
      allHikersValid.resetRecomputations();
      simulationAndDataValid.resetRecomputations();
      expect(simulationAndDataValid.recomputations()).toBe(0);

      expect(simulationAndDataValid(state)).toBeTruthy();

      expect(simulationValid.recomputations()).toBe(1);
      expect(allHikesValid.recomputations()).toBe(1);
      expect(allTrailsValid.recomputations()).toBe(1);
      expect(allHikersValid.recomputations()).toBe(1);
      expect(simulationAndDataValid.recomputations()).toBe(1);

      const newOuterState = {
        editor: {
          ...state.editor,
          simulation: { name: 'two' },
          trailsById: { ...state.trailsById },
        },
      };
      expect(simulationAndDataValid(newOuterState)).toBeTruthy();

      expect(simulationValid.recomputations()).toBe(2);
      expect(allHikesValid.recomputations()).toBe(1);
      expect(allTrailsValid.recomputations()).toBe(2);
      expect(allHikersValid.recomputations()).toBe(1);
      expect(simulationAndDataValid.recomputations()).toBe(1); // by val, not by ref
    });
  });
});
