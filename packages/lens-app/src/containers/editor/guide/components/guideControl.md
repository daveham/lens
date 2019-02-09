Default

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  onPathChanged={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={styleguideData.simulations}
/>
```

Simulation, Execution, Rendering Selected

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  simulationId={1}
  executionId={20}
  renderingId={201}
  onControlParametersChanged={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={styleguideData.simulations}
/>
```

Edit Mode

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  simulationId={1}
  executionId={20}
  renderingId={201}
  action='edit'
  onControlParametersChanged={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={styleguideData.simulations}
/>
```
