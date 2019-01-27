```jsx
<div style={{ minWidth: '180px', minHeight: '80px' }}>
  <TileAnalysis
    row={1}
    col={1}
    offsetX={0}
    offsetY={0}
    stats={{
      data: {
        filename: 'filename',
        red: {
          histogram: [3, 4, 5, 6, 8, 7, 4, 2, 1, 2],
        },
        green: {
          histogram: [6, 8, 2, 1, 7, 3, 4, 5, 4, 2],
        },
        blue: {
          histogram: [5, 6, 8, 7, 4, 3, 4, 2, 1, 2],
        },
        hue: {
          histogram: [3, 4, 5, 1, 2, 6, 8, 7, 4, 2],
        },
        saturation: {
          histogram: [1, 3, 5, 6, 2, 8, 4, 2, 1, 2],
        },
        luminance: {
          histogram: [4, 2, 1, 3, 4, 5, 1, 9, 7, 2],
        },
      }
    }}
  />
</div>
```