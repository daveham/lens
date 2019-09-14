export const simulationsLoadingSelector = (state) =>
  state.editor.loading;

export const simulationsSelector = (state) =>
  state.editor.simulations;

export const actionEnabledSelector = (state) =>
  state.editor.actionEnabled;

export const actionValidSelector = (state) =>
  state.editor.actionValid;
