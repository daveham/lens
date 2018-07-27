export const STORE_INJECT = Symbol('@@STORE_INJECT');

export default (registry) =>
  (/* store */) => next => action => {
    if (action.hasOwnProperty(STORE_INJECT)) {
      const { reducers, sagas, commands } = action[STORE_INJECT];
      if (reducers || sagas || commands) {
        registry.inject({ reducers, sagas, commands });
      }
      return;
    }
    return next(action);
  };
