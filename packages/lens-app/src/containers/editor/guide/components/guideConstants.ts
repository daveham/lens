export const KEY_SIMULATION = 'simulation';
export const KEY_EXECUTION = 'execution';
export const KEY_RENDERING = 'rendering';

export const controlSegmentKeys = {
  simulation: KEY_SIMULATION,
  execution: KEY_EXECUTION,
  rendering: KEY_RENDERING,
};

export const controlSegmentActions = {
  view: 'view',
  new: 'new',
  edit: 'edit',
  delete: 'delete',
  run: 'run',
  render: 'render',
};

export const KEY_SIMULATION_ADD = 1000;

export const KEY_SIMULATION_VIEW = 1001;
export const KEY_SIMULATION_EDIT = 1002;
export const KEY_SIMULATION_ADD_EXE = 1003;
export const KEY_SIMULATION_DELETE = 1004;

export const KEY_EXECUTION_VIEW = 2001;
export const KEY_EXECUTION_EDIT = 2002;
export const KEY_EXECUTION_RUN = 2003;
export const KEY_EXECUTION_ADD_REN = 2004;
export const KEY_EXECUTION_DELETE = 2005;

export const KEY_RENDERING_VIEW = 3001;
export const KEY_RENDERING_EDIT = 3002;
export const KEY_RENDERING_RENDER = 3003;
export const KEY_RENDERING_DELETE = 3004;

// define the panels and structure of menu items to apply actions to data
export const panelDetails = {
  simulation: {
    title: 'Simulations',
    menuItems: [
      { label: 'View', value: KEY_SIMULATION_VIEW },
      { label: 'Edit', value: KEY_SIMULATION_EDIT, action: controlSegmentActions.edit },
      '-',
      {
        label: 'Add New Execution',
        value: KEY_SIMULATION_ADD_EXE,
        action: controlSegmentActions.new,
      },
      '-',
      { label: 'Delete', value: KEY_SIMULATION_DELETE, action: controlSegmentActions.delete },
    ],
  },
  execution: {
    title: 'Executions',
    menuItems: [
      { label: 'View', value: KEY_EXECUTION_VIEW },
      { label: 'Edit', value: KEY_EXECUTION_EDIT, action: controlSegmentActions.edit },
      { label: 'Run', value: KEY_EXECUTION_RUN, action: controlSegmentActions.run },
      '-',
      {
        label: 'Add New Rendering',
        value: KEY_EXECUTION_ADD_REN,
        action: controlSegmentActions.new,
      },
      '-',
      { label: 'Delete', value: KEY_EXECUTION_DELETE, action: controlSegmentActions.delete },
    ],
  },
  rendering: {
    title: 'Renderings',
    menuItems: [
      { label: 'View', value: KEY_RENDERING_VIEW },
      { label: 'Edit', value: KEY_RENDERING_EDIT, action: controlSegmentActions.edit },
      { label: 'Render', value: KEY_RENDERING_RENDER, action: controlSegmentActions.run },
      '-',
      { label: 'Delete', value: KEY_RENDERING_DELETE, action: controlSegmentActions.delete },
    ],
  },
};

// define which actions lock a panel open with dialog controls
export const lockingActions = [
  controlSegmentActions.new,
  controlSegmentActions.edit,
  controlSegmentActions.delete,
];
