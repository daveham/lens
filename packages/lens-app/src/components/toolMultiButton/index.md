```jsx
const MoreVert = require('@material-ui/icons/MoreVert').default;
const MoreHoriz = require('@material-ui/icons/MoreHoriz').default;
const UnfoldLess = require('@material-ui/icons/UnfoldLess').default;
const UnfoldMore = require('@material-ui/icons/UnfoldMore').default;
;<ToolMultiButton>
  <MoreVert key='vert'/>
  <MoreHoriz key='horiz'/>
  <UnfoldLess key='less'/>
  <UnfoldMore key='more'/>
</ToolMultiButton>
```

```jsx
const MoreVert = require('@material-ui/icons/MoreVert').default;
const MoreHoriz = require('@material-ui/icons/MoreHoriz').default;
const UnfoldLess = require('@material-ui/icons/UnfoldLess').default;
const UnfoldMore = require('@material-ui/icons/UnfoldMore').default;
;<ToolMultiButton selectedIndex={1}>
  <MoreVert key='vert'/>
  <MoreHoriz key='horiz'/>
  <UnfoldLess key='less'/>
  <UnfoldMore key='more'/>
</ToolMultiButton>
```