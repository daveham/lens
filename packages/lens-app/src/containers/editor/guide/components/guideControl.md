Default

```jsx
<GuideControl
  title='Photo Title'
  sourceId='1001'
  onPathChanged={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={[
    {
      id: 1,
      name: 'simulation one',
      executions: [
        {
          id: 10,
          name: 'execution ten',
          renderings: [
            { id: 100, name: 'rendering one hundred' },
            { id: 101, name: 'rendering one hundred one' },
          ],
        },
        {
          id: 20,
          name: 'execution twenty',
          renderings: [
            { id: 200, name: 'rendering two hundred' },
            { id: 201, name: 'rendering two hundred one' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'simulation two',
      executions: [
        {
          id: 30,
          name: 'execution thirty',
          renderings: [{ id: 300, name: 'rendering three hundred' }],
        },
      ],
    },
  ]}
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
  onPathChanged={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={[
    {
      id: 1,
      name: 'simulation one',
      executions: [
        {
          id: 10,
          name: 'execution ten',
          renderings: [
            { id: 100, name: 'rendering one hundred' },
            { id: 101, name: 'rendering one hundred one' },
          ],
        },
        {
          id: 20,
          name: 'execution twenty',
          renderings: [
            { id: 200, name: 'rendering two hundred' },
            { id: 201, name: 'rendering two hundred one' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'simulation two',
      executions: [
        {
          id: 30,
          name: 'execution thirty',
          renderings: [{ id: 300, name: 'rendering three hundred' }],
        },
      ],
    },
  ]}
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
  onPathChanged={() => {}}
  thumbnailUrl='https://via.placeholder.com/400x267.png/F0F0E0/D0D0C0?text=photo%20thumbnail'
  simulations={[
    {
      id: 1,
      name: 'simulation one',
      executions: [
        {
          id: 10,
          name: 'execution ten',
          renderings: [
            { id: 100, name: 'rendering one hundred' },
            { id: 101, name: 'rendering one hundred one' },
          ],
        },
        {
          id: 20,
          name: 'execution twenty',
          renderings: [
            { id: 200, name: 'rendering two hundred' },
            { id: 201, name: 'rendering two hundred one' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'simulation two',
      executions: [
        {
          id: 30,
          name: 'execution thirty',
          renderings: [{ id: 300, name: 'rendering three hundred' }],
        },
      ],
    },
  ]}
/>
```
