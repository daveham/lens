import E3 from 'eventemitter3';
import invariant from 'tiny-invariant';
import Point from '../../basic/point';
import Size from '../../basic/size';

import getDebugLog from './debugLog';
const debug = getDebugLog('trailState');

class TrailState {
  events;
  _initialLocation;
  _location;
  _movement;
  orientation;
  trail;
  hiker;

  constructor() {
    debug('ctor');
    this.events = new E3.EventEmitter();
  }

  toString() {
    return `{ initialLocation: ${this._initialLocation}, location: ${this._location}, movement: ${this._movement} }`;
  }

  assertIsValid() {
    invariant(this.trail, 'trail should be assigned to trail state');
    invariant(this.hiker, 'hiker should be assigned to trail state');
  }

  sendInitialLocationEvent() {
    this.events.emit('initialLocation', {
      initialLocation: this._initialLocation,
      hiker: this.hiker,
      trail: this.trail,
    });
  }

  sendLocationEvent() {
    this.events.emit('location', {
      location: this._location,
      hiker: this.hiker,
      trail: this.trail,
    });
  }

  sendMovementEvent() {
    this.events.emit('movement', {
      movement: this._movement,
      hiker: this.hiker,
      trail: this.trail,
    });
  }

  suspend(/* stateMap, state */) {
    debug('suspend');
    this.assertIsValid();

    return {
      _initialLocation: this._initialLocation,
      _location: this._location,
      _movement: this._movement,
      orientation: this.orientation,
    };
  }

  restore(objectFactory, stateMap, state) {
    debug('restore');
    this.assertIsValid();

    this._initialLocation = state._initialLocation;
    this._location = state._location;
    this._movement = state._movement;
    this.orientation = state.orientation;
  }

  get initialLocation() {
    debug('get initialLocation');
    return this._initialLocation;
  }

  set initialLocation(value) {
    debug('set initial location', value);
    this._initialLocation = new Point(value);
    this.sendInitialLocationEvent();
  }

  get location() {
    debug('get location');
    return this._location;
  }

  set location(value) {
    debug('set location', value);
    this._location = new Point(value);
    this.sendLocationEvent();
  }

  get movement() {
    debug('get movement');
    return this._movement;
  }

  set movement(value) {
    debug('set movement', value);
    this._movement = new Size(value);
    this.sendMovementEvent();
  }

  resetLocation() {
    debug('resetLocation');
    this._location = this._initialLocation;
    this.sendLocationEvent();
  }

  addMovement(movement) {
    debug('addMovement');
    const m = movement || this._movement;
    if (this.orientation === 'vertical') {
      this._location = this._location.add(0, m.height);
    } else if (this.orientation === 'horizontal') {
      this._location = this._location.add(m.width, 0);
    } else {
      this._location = this._location.add(m);
    }
    this.sendLocationEvent();
  }

  isInBounds(location) {
    this.assertIsValid();
    return location
      ? this.trail.hike.isLocationInBounds(location)
      : this.trail.hike.isLocationInBounds(this._location);
  }
}

export default TrailState;
