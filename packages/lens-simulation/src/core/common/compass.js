import Rectangle from '../../basic/rectangle';
import { ImageCompassMode } from './imageCompass';

class Compass {
  imageCompass;
  numSlices; // Size
  delta; // Size
  deltaHalf; // Size
  limit; // Rectangle

  constructor(imageCompass) {
    this.imageCompass = imageCompass;
  }

  static CompassFor(imageCompass, mode) {
    let CompassClass;
    switch (mode) {
      case ImageCompassMode.normal:
        CompassClass = MixNormalCompass(Compass);
        break;
      case ImageCompassMode.constrain:
        CompassClass = MixConstrainedCompass(Compass);
        break;
      case ImageCompassMode.clip:
        CompassClass = MixClippedCompass(Compass);
        break;
      default:
        throw new Error('unexpected image compass mode');
    }
    const compass = new CompassClass(imageCompass);
    compass.calculate();
    return compass;
  }

  get slicesSize() {
    return this.numSlices;
  }

  calculate() {
    this.onCalculate();
    if (this.imageCompass.lapped) {
      this.onCalculateLapped();
    }
    this.deltaHalf = this.delta.half();
  }

  onCalculate() {}

  onCalculateLapped() {
    this.numSlices = this.numSlices.double().dec();
    this.delta = this.delta.half().floor();
  }

  *slices() {
    const {
      numSlices,
      delta,
      imageCompass: { grain },
    } = this;
    for (let yIndex = 0; yIndex < numSlices.height; yIndex++)
      for (let xIndex = 0; xIndex < numSlices.width; xIndex++)
        yield new Rectangle(xIndex * delta.width, yIndex * delta.height, grain.width, grain.height);
  }

  isOutOfBounds(point, allowVirtual) {
    return !allowVirtual && !this.limit.containsPoint(point);
  }

  unlappedBoundsFromLocation({ x, y }) {
    // +---- ----+---- ----+---- ----+---- ----+
    // |         |         |         |         |

    const { width, height } = this.imageCompass.grain;
    let offsetX = Math.floor(x / width) * width;
    if (x < 0) offsetX -= width;

    let offsetY = Math.floor(y / height) * height;
    if (y < 0) offsetY -= height;

    return new Rectangle(offsetX, offsetY, width, height);
  }

  nearestMiddleBoundsFromLocation({ x, y }, first, second) {
    console.log('nearestMiddleBoundsFromLocation', {
      x,
      y,
      first: first.toString(),
      second: second.toString(),
    });
    if (first.isEmpty()) {
      return second;
    }

    if (second.isEmpty()) {
      return first;
    }

    const { x: cx1, y: cy1 } = first.center;
    const dx1 = Math.abs(cx1 - x);
    const dy1 = Math.abs(cy1 - y);

    const { x: cx2, y: cy2 } = second.center;
    const dx2 = Math.abs(cx2 - x);
    const dy2 = Math.abs(cy2 - y);

    const bounds = first.clone();
    if (dx2 < dx1) {
      bounds.left = second.left;
      bounds.setSize([second.width, bounds.height]);
      // bounds.width = second.width;
    }
    if (dy2 < dy1) {
      bounds.top = second.top;
      bounds.setSize([bounds.width, second.height]);
      // bounds.height = second.height;
    }

    return bounds;
  }

  overlappedBoundsFromLocation(point) {
    // This was commented out in C#.
    // if (x < _deltaX || y < _deltaY ||
    //    x >= _imageCompass.Width - _deltaX || y >= _imageCompass.Height - _deltaY)
    //   return Rectangle.Empty;

    if (!this.imageCompass.bounds.containsPoint(point)) {
      return Rectangle.Empty;
    }

    const { delta } = this;
    const { grain } = this.imageCompass;
    const offset = point
      .subtract(delta)
      .divide(grain)
      .floor()
      .multiply(grain)
      .add(delta);

    return new Rectangle(offset, grain);
  }

  lappedBoundsFromLocation(point) {
    // +---- ----+---- ----+---- ----+---- ----+
    // |         |         |         |         |
    // |    +---- ----+---- ----+---- ----+    |
    // |    |         |         |         |    |

    const r1 = this.unlappedBoundsFromLocation(point);
    const r2 = this.overlappedBoundsFromLocation(point);
    return this.nearestMiddleBoundsFromLocation(point, r1, r2);
  }

  boundsFromLocation(point, allowVirtual = false) {
    if (this.isOutOfBounds(point, allowVirtual)) {
      return new Rectangle();
    }

    return this.imageCompass.lapped
      ? this.lappedBoundsFromLocation(point)
      : this.unlappedBoundsFromLocation(point);
  }
}

const MixNormalCompass = superclass =>
  class extends superclass {
    onCalculate() {
      const {
        imageCompass: { grain, bounds },
      } = this;
      this.delta = grain.clone();
      // derive slices from bounds and grain, round up on partial slices
      this.numSlices = bounds.size
        .add(grain)
        .dec()
        .divide(grain)
        .floor();
      // limit based on number of (possibly rounded up) slices
      this.limit = new Rectangle([0, 0], this.numSlices.multiply(grain));
      // console.log('NormalCompass.onCalculate', {
      //   bounds: bounds.toString(),
      //   grain: grain.toString(),
      //   delta: this.delta.toString(),
      //   numSlices: this.numSlices.toString(),
      //   limit: this.limit.toString(),
      // });
    }
  };

const MixConstrainedCompass = superclass =>
  class extends superclass {
    onCalculate() {
      const {
        imageCompass: { grain, bounds },
      } = this;
      this.delta = grain.clone();
      // derive slices from bounds and grain, floor any partial slices
      this.numSlices = bounds.size.divide(grain).floor();
      // limit based on number of (possibly floored) slices
      this.limit = new Rectangle([0, 0], this.numSlices.multiply(grain));
      // console.log('ConstrainedCompass.onCalculate', {
      //   bounds: bounds.toString(),
      //   grain: grain.toString(),
      //   delta: this.delta.toString(),
      //   numSlices: this.numSlices.toString(),
      //   limit: this.limit.toString(),
      // });
    }
  };

const MixClippedCompass = superclass =>
  class extends superclass {
    onCalculate() {
      const {
        imageCompass: { grain, bounds },
      } = this;
      this.delta = grain.clone();
      // derive slices from bounds and grain, round up on partial slices
      this.numSlices = bounds.size
        .add(grain)
        .dec()
        .divide(grain)
        .floor();
      // limit set directly from requested bounds
      this.limit = new Rectangle([0, 0], bounds);
      // console.log('ClippedCompass.onCalculate', {
      //   bounds: bounds.toString(),
      //   grain: grain.toString(),
      //   delta: this.delta.toString(),
      //   numSlices: this.numSlices.toString(),
      //   limit: this.limit.toString(),
      // });
    }

    *slices() {
      const {
        numSlices: { width: sw, height: sh },
        delta: { width: dw, height: dh },
        imageCompass: { grain, lapped },
      } = this;

      const { right, bottom } = this.limit;

      for (let yIndex = 0; yIndex < sh; yIndex++)
        for (let xIndex = 0; xIndex < sw; xIndex++) {
          const r = new Rectangle([xIndex * dw, yIndex * dh], grain);

          if (lapped) {
            if (
              // lapped slice exceeds right bounds
              (xIndex % 2 === 1 && r.right >= right) ||
              // lapped slice exceeds bottom bounds
              (yIndex % 2 === 1 && r.bottom >= bottom)
            ) {
              continue;
            }

            if (
              // non-lapped slice exceeds right bounds
              (xIndex % 2 === 0 && r.right >= right) ||
              // next lapped slice to the right would exceed right bounds
              (xIndex % 2 === 1 && r.right + r.width >= right)
            ) {
              // adjust this slice to cover this width and the partial width of next slice over
              r.size = [right - r.left, r.height];
            }

            if (
              // non-lapped slice exceeds bottom bounds
              (yIndex % 2 === 0 && r.bottom >= bottom) ||
              // next lapped slice to the right would exceed bottom bounds
              (yIndex % 2 === 1 && r.bottom + r.height >= bottom)
            ) {
              // adjust this slice to cover this height and the partial height of next slice down
              r.size = [r.width, bottom - r.top];
            }
          } else {
            if (r.right >= right) {
              r.size = [right - r.left, r.height];
            }

            if (r.bottom >= bottom) {
              r.size = [r.width, bottom - r.top];
            }
          }

          yield r;
        }
    }

    unlappedBoundsFromLocation(location) {
      const r = super.unlappedBoundsFromLocation(location);
      // console.log('unlappedBoundsFromLocation - r', r.toString());
      // console.log('unlappedBoundsFromLocation - r', r.right, r.bottom);

      const { right, bottom } = this.limit;
      // console.log('unlappedBoundsFromLocation - limit', this.limit.toString());
      // console.log('unlappedBoundsFromLocation - limit', right, bottom);

      if (r.right > right) {
        r.size = [right - r.left, r.height];
        // r.width = right - r.left;
        // console.log('unlappedBoundsFromLocation - adjusting width', r.toString());
      }
      if (r.bottom > bottom) {
        r.size = [r.width, bottom - r.top];
        // r.height = bottom - r.top;
        // console.log('unlappedBoundsFromLocation - adjusting height', r.toString());
      }

      console.log('unlappedBoundsFromLocation', r.toString());
      return r;
    }

    overlappedBoundsFromLocation(location) {
      // +----- -----+----- -----+----- -----+----- -----+--+
      // |           |           |           |           |  |
      // |     +----- -----+----- -----+----- -----+----- --|
      // |     |           |           |                    |

      // This was commented out in C#.
      // if (x < _deltaX || y < _deltaY ||
      //   x >= _limitX || y >= _limitY)
      // return Rectangle.Empty;

      if (!this.limit.containsPoint(location)) {
        return Rectangle.Empty;
      }

      const { delta } = this;
      const { grain } = this.imageCompass;
      // find location at nearest grain boundary
      const offsetLocation = location
        .subtract(delta)
        .divide(grain)
        .floor()
        .multiply(grain)
        .add(delta);

      const r = new Rectangle([0, 0], grain).offset(offsetLocation);
      // console.log('overlappedBoundsFromLocation - r', r.toString());

      const { right, bottom } = this.limit;
      // console.log('overlappedBoundsFromLocation - limit', this.limit.toString());

      if (r.right >= right) {
        r.left = r.left - grain.width;
        // r.x -= grain.width;
        r.setSize([right - r.left, r.height]);
        // r.width = right - r.left;
        // console.log('overlappedBoundsFromLocation - adjusting left, width', r.toString());
      } else if (r.right + grain.width >= right) {
        r.setSize([right - r.left, r.height]);
        // r.width = right - r.left;
        // console.log('overlappedBoundsFromLocation - adjusting width', r.toString());
      }

      if (r.bottom >= bottom) {
        r.top = r.top - grain.height;
        // r.Y -= grain.height;
        r.setSize([r.width, bottom - r.top]);
        // r.height = bottom - r.top;
        // console.log('overlappedBoundsFromLocation - adjusting top, height', r.toString());
      } else if (r.bottom + grain.height >= bottom) {
        r.setSize([r.width, bottom - r.top]);
        // r.height = bottom - r.top;
        // console.log('overlappedBoundsFromLocation - adjusting height', r.toString());
      }

      console.log('overlappedBoundsFromLocation', r.toString());
      return r;
    }
  };

export default Compass;
