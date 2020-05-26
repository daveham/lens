import Compass from './compass';

export const ImageCompassMode = {
  normal: 'normal',
  constrain: 'constrain',
  clip: 'clip',
};

function assertArgumentOutOfRangeError(param, predicate) {
  if (predicate) {
    throw new Error(`${param} argument out of range`);
  }
}

class ImageCompass {
  _compass;
  _calculated;
  _width;
  _height;
  _grainX;
  _grainY;
  _mode;
  _lapped;

  constructor(width, height, grainX, grainY, mode = ImageCompassMode.normal, lapped = false) {
    assertArgumentOutOfRangeError('width', width < 1);
    assertArgumentOutOfRangeError('height', height < 1);
    assertArgumentOutOfRangeError('grainX', grainX < 1);
    assertArgumentOutOfRangeError('grainY', grainY < 1);

    this._calculated = false;
    this._width = width;
    this._height = height;
    this._grainX = grainX;
    this._grainY = grainY;
    this._mode = mode;
    this._lapped = lapped;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    assertArgumentOutOfRangeError('width', value < 1);
    this._width = value;
    this._calculated = false;
  }

  set height(value) {
    assertArgumentOutOfRangeError('height', value < 1);
    this._height = value;
    this._calculated = false;
  }

  set grainX(value) {
    assertArgumentOutOfRangeError('grainX', value < 1);
    this._grainX = value;
    this._calculated = false;
  }

  set grainY(value) {
    assertArgumentOutOfRangeError('grainY', value < 1);
    this._grainY = value;
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
      this._compass = Compass.CompassFor(this._mode, this);
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
