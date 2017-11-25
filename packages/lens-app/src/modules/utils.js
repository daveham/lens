export const itemLoadedWithUrlReducer = (state = {}, url) => {
  // add the url to the object and reset the loading flag
  return {
    ...state,
    url,
    loading: false
  };
};

export const itemLoadedWithDataReducer = (state = {}, data) => {
  // add the data to the object and reset the loading flag
  return {
    ...state,
    data,
    loading: false
  };
};

export const itemLoadingReducer = (state = {}, loading) => {
  // set or reset the loading flag
  return {
    ...state,
    loading
  };
};

export const itemKeysReducer = (state = [], key) => {
  // add a key to the list of keys
  return [
    ...state,
    key
  ];
};

export const itemByKeysReducer = (state = {}, key, item) => {
  // add the item
  return {
    ...state,
    [key]: item
  };
};

export const addOrUpdateItem = (state, listKey, key, reducerFn) => {
  const existingKeys = state.keys[listKey] || [];
  const existingByKeys = state.byKeys[listKey] || {};
  const existingItem = existingByKeys[key];

  const keys = existingItem ? state.keys : {
    ...state.keys,
    [listKey]: itemKeysReducer(existingKeys, key)
  };
  const byKeys = {
    ...state.byKeys,
    [listKey]: itemByKeysReducer(existingByKeys, key, reducerFn(existingItem))
  };

  return {
    ...state,
    keys,
    byKeys
  };
};
