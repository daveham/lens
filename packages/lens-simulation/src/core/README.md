# Core
These are the primary elements of the simulation using an abstraction
based on hiking.

## Hike
The hike sets the area to explore (photo image).
It determines the start timing and finish timing.
The hike holds a collection of trails.
Different types of hikes are created by assigning a hike strategy.

Hike API
- addTrail
- open
- run
- close

Hike Strategy API
- onOpen
- onRun
- onClose

## Trail
The trail controls the course through the hike.
It determines the direction, the start location and the finish location.
The trail holds a collection of hikers.
Different types of trails are created by assigning a trail strategy.

Trail API
- addHiker
- open
- close
- createTrailState
- initializeTrailState
- updateTrailState

Trail Strategy API
- onOpen
- onClose
- onCreateTrailState
- onInitializeTrailState
- onUpdateTrailState

## Hiker
The hiker controls the behavior along a trail.
The hiker has two behaviors.
- The movement behavior determines how a hiker moves along a trail.
- The action behavior determines what a hiker does at each step along the trail.
Different types of hikers are created by assigning a hiker strategy.

Hiker API
- isActive
- step
- abort

Hiker Strategy API
- onStart
- onStep
- onEnd
- onCreateMovementBehavior
- onCreateActionBehavior

### Movement Behavior
The movement behavior provides the implementation of initializing and updating the hiker's location on the trail.
The behavior owns the values because they are per-hiker.
The trail owns the method of assigning and changing the values.
Different types of movement behaviors are created by assigning a movement strategy.
A hiker's movement behavior owns trail state which represents the hiker's current location and movement.
The hiker's movement behavior uses the trail to initialize and update the trail state.

Movement Behavior API
- start
- move
- end

Movement Strategy API
- onStart
- onMove
- onEnd

#### Trail Movement Strategy
The trail movement strategy specializes the movement behavior to manage TrailState on the trial for a hiker.

Trail Movement Strategy API
- onStart - use trail to create trail state, set initial location and movement, use trail to initialize trail state
- onMove - use trail to update trail state
- onEnd - N/A

### Action Behavior
The action behavior provides the implementation of actions performed by the hiker along the trail.
Different types of action behaviors are created by assigning an action strategy.

Action Behavior API
- start
- act
- end

Action Strategy API
- onStart
- onAct
- onObserve
- onInfer
- onEnd

