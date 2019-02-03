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
      id: 1, name: 'simulation one',
      executions: [
        {
          id: 1, name: 'execution one',
          renderings: [
            { id: 1, name: 'rendering one' }
          ],
        }
      ],
    }, {
      id: 2, name: 'simulation two',
      executions: [
        {
          id: 2, name: 'execution two',
          renderings: [
            { id: 2, name: 'rendering two' }
          ],
        }
      ],
    }
  ]}
/>
```
