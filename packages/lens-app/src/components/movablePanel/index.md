```jsx
;<div style={{ position: 'relative', width: 240, height: 120 }}>
  <div style={{ backgroundColor: '#f0f0e0'}}>
    background<br/>content<br/>
    background<br/>content<br/>
    background<br/>content
  </div>
  <MovablePanel
    initialTop={15}
    initialLeft={15}
    minWidth={100}
    minHeight={80}
    constrainRect={{
      width: 240,
      height: 120,
      top: 0,
      left: 0,
      right: 120,
      bottom: 120,
    }}
  >
    <div>content</div>
  </MovablePanel>
</div>
```
