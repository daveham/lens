import EventEmitter from 'events';
// import Point from '../../basic/point';

import getDebugLog from './debugLog';
const debug = getDebugLog('trailState');

export const TrailStateChangeReason = {
  initialLocation: 'initialLocation',
  location: 'location',
  movement: 'movement',
};

export const TrailStateEvent = {
  change: 'change',
};

class TrailState extends EventEmitter {
  _initialLocation;
  _location;
  _movement;

  constructor() {
    super();
    debug('constructed location', this.location);
  }

  raiseChangeEvent(reason) {
    this.emit(TrailStateEvent.change, { state: this, reason });
  }

  get initialLocation() {
    return this._initialLocation;
  }

  set initialLocation(value) {
    this._initialLocation = value;
    this.raiseChangeEvent(TrailStateChangeReason.initialLocation);
  }

  get location() {
    return this._location;
  }

  set location(value) {
    this._location = value;
    this.raiseChangeEvent(TrailStateChangeReason.location);
  }

  get movement() {
    return this._movement;
  }

  set movement(value) {
    this._movement = value;
    this.raiseChangeEvent(TrailStateChangeReason.movement);
  }
}

export default TrailState;
