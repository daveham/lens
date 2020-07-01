import E3 from 'eventemitter3';

import getDebugLog from './debugLog';
const debug = getDebugLog('trailState');

class TrailState {
  _initialLocation;
  _location;
  _movement;

  constructor() {
    this.events = new E3.EventEmitter();
  }

  get initialLocation() {
    return this._initialLocation;
  }

  set initialLocation(value) {
    debug('set initial location', value);
    this._initialLocation = value;
    // noinspection JSCheckFunctionSignatures
    this.events.emit('initialLocation', { initialLocation: this._initialLocation });
  }

  get location() {
    return this._location;
  }

  set location(value) {
    debug('set location', value);
    this._location = value;
    // noinspection JSCheckFunctionSignatures
    this.events.emit('location', { location: this._location });
  }

  get movement() {
    return this._movement;
  }

  set movement(value) {
    this._movement = value;
    debug('set movement', value);
    // noinspection JSCheckFunctionSignatures
    this.events.emit('movement', { movement: this._movement });
  }
}

export default TrailState;
