```jsx
<EditorGuideView
  title='Photo Title'
  history={{ push: () => {} }}
  match={{ params: {} }}
  ensureEditorTitle={() => {}}
  ensureImage={() => {}}
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
            { id: 102, name: 'rendering one hundred two' },
            { id: 103, name: 'rendering one hundred three' },
          ],
        }, {
          id: 30,
          name: 'execution thirty',
          renderings: [
            { id: 300, name: 'rendering three hundred' },
            { id: 301, name: 'rendering three hundred one' },
            { id: 302, name: 'rendering three hundred two' },
            { id: 303, name: 'rendering three hundred three' },
          ],
        },
        {
          id: 40,
          name: 'execution forty',
          renderings: [
            { id: 400, name: 'rendering four hundred' },
            { id: 401, name: 'rendering four hundred one' },
            { id: 402, name: 'rendering four hundred two' },
            { id: 403, name: 'rendering four hundred three' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'simulation two',
      executions: [
        {
          id: 20,
          name: 'execution twenty',
          renderings: [{ id: 200, name: 'rendering two hundred' }],
        },
      ],
    },
  ]}
/>
```
