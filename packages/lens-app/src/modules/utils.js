export const itemLoadedWithUrlReducer = (state = {}, url) => {
  // add the url to the object and reset the loading flag
  return {
    ...state,
    url,
    loading: false
  };
};

export const itemsLoadedWithUrlReducer = (items, itemsUrls) => {
  // add the url to each object and reset the loading flag
  return items.map((item = {}, index) => {
    return {
      ...item,
      data: itemsUrls[index],
      loading: false
    };
  });
};

export const itemLoadedWithDataReducer = (state = {}, data) => {
  // add the data to the object and reset the loading flag
  return {
    ...state,
    data,
    loading: false
  };
};

export const itemsLoadedWithDataReducer = (items, itemsData) => {
  // add each data to each object and reset the loading flag
  return items.map((item = {}, index) => {
    return {
      ...item,
      data: itemsData[index],
      loading: false
    };
  });
};

export const itemLoadingReducer = (state = {}, loading) => {
  // set or reset the loading flag
  return {
    ...state,
    loading
  };
};

export const itemsLoadingReducer = (items, loading) => {
  // set or reset the loading flag on all items
  return items.map((item = {}) => {
    return {
      ...item,
      loading
    };
  });
};

export const itemKeysReducer = (state = [], key) => {
  // add a key to the list of keys
  return [
    ...state,
    key
  ];
};

export const itemsKeysReducer = (state = [], keys) => {
  // add a list of keys to the list of keys
  return [
    ...state,
    ...keys
  ];
};

export const itemByKeysReducer = (state = {}, key, item) => {
  // add the item
  return {
    ...state,
    [key]: item
  };
};

export const itemsByKeysReducer = (state = {}, keys, items) => {
  // add the items
  const newState = { ...state };
  keys.forEach((key, index) => {
    newState[key] = items[index];
  });
  return newState;
};

export const addOrUpdateItem = (state, listKey, key, reducerFn) => {
  const currentListKeys = state.keys[listKey] || [];
  const currentListItems = state.byKeys[listKey] || {};
  const currentOrNewItem = currentListItems[key];

  const newListsOfKeys = currentOrNewItem ? state.keys : {
    ...state.keys,
    [listKey]: itemKeysReducer(currentListKeys, key)
  };

  const newListsOfItems = {
    ...state.byKeys,
    [listKey]: itemByKeysReducer(currentListItems, key, reducerFn(currentOrNewItem))
  };

  return {
    ...state,
    keys: newListsOfKeys,
    byKeys: newListsOfItems
  };
};

export const addOrUpdateItems = (state, listKey, itemKeys, reducerFn) => {
  const currentListKeys = state.keys[listKey] || [];
  const currentListItems = state.byKeys[listKey] || {};

  const newKeys = itemKeys.filter((key) => !currentListItems[key]);
  const newListsOfKeys = newKeys.length ?
    {
      ...state.keys,
      [listKey]: itemsKeysReducer(currentListKeys, newKeys)
    } :
    state.keys;

  const currentOrNewItems = itemKeys.map((key) => currentListItems[key]);
  const newListsOfItems = {
    ...state.byKeys,
    [listKey]: itemsByKeysReducer(currentListItems, itemKeys, reducerFn(currentOrNewItems))
  };

  return {
    ...state,
    keys: newListsOfKeys,
    byKeys: newListsOfItems
  };
};
