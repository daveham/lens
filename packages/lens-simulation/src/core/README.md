# Core
These are the primary elements of the simulation using an abstraction
based on hiking.

## Base Classes

Each of these classes should be considered abstract
base classes.

### Hike
The hike sets the area to explore (photo image).
It determines the start timing and finish timing.
The hike holds a collection of trails.

### Trail
The trail controls the course through the hike.
It determines the direction, the start location and
the finish location.
The trail holds a collection of hikers.

### Hiker
The hiker controls the behavior along a trail.
The hiker has two behaviors. The movement behavior
determines how a hiker a moves along a trail.
The action behavior determines what a hiker does
at each step along the trail.

#### Movement Behavior

#### Action Behavior

