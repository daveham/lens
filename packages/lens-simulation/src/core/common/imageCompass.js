import Compass from './compass';

export const ImageCompassMode = {
  normal: 'normal',
  constrain: 'constrain',
  clip: 'clip',
};

class ImageCompass {
  _compass;
  _calculated;
  _bounds; // rectangle
  _grain;
  _mode;
  _lapped;

  constructor(bounds, grain, mode = ImageCompassMode.normal, lapped = false) {
    this._calculated = false;
    this._bounds = bounds;
    this._grain = grain;
    this._mode = mode;
    this._lapped = lapped;
  }

  get bounds() {
    return this._bounds;
  }

  set bounds(value) {
    this._bounds = value;
    this._calculated = false;
  }

  set grain(value) {
    this._grain = value;
    this._calculated = false;
  }

  set mode(value) {
    this._mode = value;
    this._calculated = false;
  }

  set lapped(value) {
    this._lapped = value;
    this._calculated = false;
  }

  ensureCalculated() {
    if (!this._calculated) {
      this._compass = Compass.CompassFor(this, this._mode);
      this._calculated = true;
    }
  }

  get slicesWide() {
    this.ensureCalculated();
    return this._compass.slicesWide;
  }

  get slicesHigh() {
    this.ensureCalculated();
    return this._compass.slicesHigh;
  }

  boundsFromLocation(point, allowVirtual = false) {
    this.ensureCalculated();
    return this._compass.boundsFromLocation(point, allowVirtual);
  }

  boundsFromRect(rect, fromCenter = false) {
    return fromCenter
      ? this.boundsFromLocation(rect.center, true)
      : this.boundsFromLocation(rect.topLeft, true);
  }

  *slices() {
    this.ensureCalculated();
    yield* this._compass.slices();
  }
}

export default ImageCompass;
