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
          histogram: [3, 4, 5, 6, 8, 7, 4, 2, 1, 2],
        },
        blue: {
          histogram: [3, 4, 5, 6, 8, 7, 4, 2, 1, 2],
        },
        hue: {
          histogram: [3, 4, 5, 6, 8, 7, 4, 2, 1, 2],
        },
        saturation: {
          histogram: [3, 4, 5, 6, 8, 7, 4, 2, 1, 2],
        },
        luminance: {
          histogram: [3, 4, 5, 6, 8, 7, 4, 2, 1, 2],
        },
      }
    }}
  />
</div>
```