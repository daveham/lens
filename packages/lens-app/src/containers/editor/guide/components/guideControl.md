No Panel Selections, No Action

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  onControlParametersChanged={() => {}}
  onControlActionSubmit={() => {}}
  onControlActionCancel={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={styleguideData.simulations}
/>
```

Simulation, Execution, and Rendering Selected, No Action

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  simulationId={1}
  executionId={30}
  renderingId={302}
  onControlParametersChanged={() => {}}
  onControlActionSubmit={() => {}}
  onControlActionCancel={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={styleguideData.simulations}
/>
```

Edit Simulation

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  simulationId={1}
  action='edit'
  onControlParametersChanged={() => {}}
  onControlActionSubmit={() => {}}
  onControlActionCancel={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={styleguideData.simulations}
/>
```

Edit Execution

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  simulationId={1}
  executionId={20}
  action='edit'
  onControlParametersChanged={() => {}}
  onControlActionSubmit={() => {}}
  onControlActionCancel={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={styleguideData.simulations}
/>
```

Edit Rendering

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  simulationId={1}
  executionId={20}
  renderingId={201}
  action='edit'
  onControlParametersChanged={() => {}}
  onControlActionSubmit={() => {}}
  onControlActionCancel={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={styleguideData.simulations}
/>
```

New Simulation

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  action='new'
  onControlParametersChanged={() => {}}
  onControlActionSubmit={() => {}}
  onControlActionCancel={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={styleguideData.simulations}
/>
```

New Execution

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  simulationId={1}
  action='new'
  onControlParametersChanged={() => {}}
  onControlActionSubmit={() => {}}
  onControlActionCancel={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={styleguideData.simulations}
/>
```

New Rendering

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  simulationId={1}
  executionId={20}
  action='new'
  onControlParametersChanged={() => {}}
  onControlActionSubmit={() => {}}
  onControlActionCancel={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={styleguideData.simulations}
/>
```

Run Execution

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  simulationId={1}
  executionId={20}
  action='run'
  onControlParametersChanged={() => {}}
  onControlActionSubmit={() => {}}
  onControlActionCancel={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={styleguideData.simulations}
/>
```
