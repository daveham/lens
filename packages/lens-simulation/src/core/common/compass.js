import Rectangle from '../../basic/rectangle';
import { ImageCompassMode } from './imageCompass';

class Compass {
  imageCompass;

  numSlicesWide;
  numSlicesHigh;

  deltaX;
  deltaXHalf;
  deltaY;
  deltaYHalf;
  limitX;
  limitY;

  constructor(imageCompass) {
    this.imageCompass = imageCompass;
  }

  static CompassFor(imageCompass, mode) {
    let compass;
    switch (mode) {
      case ImageCompassMode.normal:
        compass = new NormalCompass(imageCompass);
        break;
      case ImageCompassMode.constrain:
        compass = new ConstrainedCompass(imageCompass);
        break;
      case ImageCompassMode.clip:
        compass = new ClippedCompass(imageCompass);
        break;
      default:
        throw new Error('unexpected image compass mode');
    }
    compass.calculate();
    return compass;
  }

  get slicesWide() {
    return this.numSlicesWide;
  }

  get slicesHigh() {
    return this.numSlicesHigh;
  }

  calculate() {
    this.onCalculate();
    if (this.imageCompass.lapped) {
      this.onCalculateLapped();
    }
    this.deltaXHalf = this.deltaX / 2;
    this.deltaYHalf = this.deltaY / 2;
  }

  onCalculate() {}

  onCalculateLapped() {
    this.numSlicesWide = this.numSlicesWide + this.numSlicesWide - 1;
    this.numSlicesHigh = this.numSlicesHigh + this.numSlicesHigh - 1;
    this.deltaX = this.deltaX / 2;
    this.deltaY = this.deltaY / 2;
  }

  *slices() {
    const {
      numSlicesWide,
      numSlicesHigh,
      deltaX,
      deltaY,
      imageCompass: { grainX, grainY },
    } = this;
    for (let yIndex = 0; yIndex < numSlicesHigh; yIndex++)
      for (let xIndex = 0; xIndex < numSlicesWide; xIndex++)
        yield new Rectangle(xIndex * deltaX, yIndex * deltaY, grainX, grainY);
  }

  isOutOfBounds({ x, y }, allowVirtual) {
    return !allowVirtual && (x < 0 || y < 0 || x >= this.limitX || y >= this.limitY);
  }

  unlappedBoundsFromLocation({ x, y }) {
    // +---- ----+---- ----+---- ----+---- ----+
    // |         |         |         |         |

    const { grainX, grainY } = this.imageCompass;
    let offsetX = (x / grainX) * grainX;
    if (x < 0) offsetX -= grainX;

    let offsetY = (y / grainY) * grainY;
    if (y < 0) offsetY -= grainY;

    return new Rectangle(offsetX, offsetY, grainX, grainY);
  }

  nearestMiddleBoundsFromLocation({ x, y }, first, second) {
    if (first.isEmpty()) {
      return second;
    }

    if (second.isEmpty()) {
      return first;
    }

    const distFirstCenter = first.center;
    const distFirstX = Math.abs(distFirstCenter.x - x);
    const distFirstY = Math.abs(distFirstCenter.y - y);

    const distSecondCenter = second.center;
    const distSecondX = Math.abs(distSecondCenter.x - x);
    const distSecondY = Math.abs(distSecondCenter.y - y);

    const bounds = first.clone();
    if (distSecondX < distFirstX) {
      bounds.left = second.left;
      bounds.width = second.width;
    }
    if (distSecondY < distFirstY) {
      bounds.top = second.top;
      bounds.height = second.height;
    }

    return first;
  }

  overlappedBoundsFromLocation({ x, y }) {
    // if (x < _deltaX || y < _deltaY ||
    //    x >= _imageCompass.Width - _deltaX || y >= _imageCompass.Height - _deltaY)
    //   return Rectangle.Empty;

    const { width, height, grainX, grainY } = this.imageCompass;
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return new Rectangle();
    }

    const { deltaX, deltaY } = this;
    const offsetX = ((x - deltaX) / grainX) * grainX + deltaX;
    const offsetY = ((y - deltaY) / grainY) * grainY + deltaY;

    return new Rectangle(offsetX, offsetY, grainX, grainY);
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

export class NormalCompass extends Compass {
  // eslint-disable-next-line no-useless-constructor
  constructor(imageCompass) {
    super(imageCompass);
  }

  onCalculate() {
    const {
      imageCompass: { grainX, grainY, width, height },
    } = this;
    this.deltaX = grainX;
    this.deltaY = grainY;
    this.numSlicesWide = Math.floor((width + this.deltaX - 1) / this.deltaX);
    this.numSlicesHigh = Math.floor((height + this.deltaY - 1) / this.deltaY);
    this.limitX = this.numSlicesWide * this.deltaX;
    this.limitY = this.numSlicesHigh * this.deltaY;
    console.log('NormalCompass.onCalculate', [
      this.deltaX,
      this.deltaY,
      this.numSlicesWide,
      this.numSlicesHigh,
      this.limitX,
      this.limitY,
    ]);
  }
}

export class ConstrainedCompass extends Compass {
  // eslint-disable-next-line no-useless-constructor
  constructor(imageCompass) {
    super(imageCompass);
  }

  onCalculate() {
    const {
      imageCompass: { grainX, grainY, width, height },
    } = this;
    this.deltaX = grainX;
    this.deltaY = grainY;
    this.numSlicesWide = width / this.deltaX;
    this.numSlicesHigh = height / this.deltaY;
    this.limitX = this.numSlicesWide * this.deltaX;
    this.limitY = this.numSlicesHigh * this.deltaY;
  }
}

export class ClippedCompass extends Compass {
  // eslint-disable-next-line no-useless-constructor
  constructor(imageCompass) {
    super(imageCompass);
  }

  onCalculate() {
    const {
      imageCompass: { grainX, grainY, width, height },
    } = this;
    this.deltaX = grainX;
    this.deltaY = grainY;
    this.numSlicesWide = (width + this.deltaX - 1) / this.deltaX;
    this.numSlicesHigh = (height + this.deltaY - 1) / this.deltaY;
    this.limitX = width;
    this.limitY = height;
  }

  *slices() {
    const {
      numSlicesWide,
      numSlicesHigh,
      deltaX,
      deltaY,
      imageCompass: { grainX, grainY, lapped },
    } = this;

    const { limitX, limitY } = this;

    for (let yIndex = 0; yIndex < numSlicesHigh; yIndex++)
      for (let xIndex = 0; xIndex < numSlicesWide; xIndex++) {
        const r = new Rectangle(xIndex * deltaX, yIndex * deltaY, grainX, grainY);

        if (lapped) {
          if (xIndex % 2 === 1 && r.right >= limitX) continue;

          if (yIndex % 2 === 1 && r.bottom >= limitY) continue;

          if (
            (xIndex % 2 === 0 && r.right >= limitX) ||
            (xIndex % 2 === 1 && r.right + r.width >= limitX)
          )
            r.Width = limitX - r.left;

          if (
            (yIndex % 2 === 0 && r.bottom >= limitY) ||
            (yIndex % 2 === 1 && r.bottom + r.height >= limitY)
          )
            r.height = limitY - r.top;
        } else {
          if (r.right >= limitX) r.width = limitX - r.left;

          if (r.bottom >= limitY) r.height = limitY - r.top;
        }

        yield r;
      }
  }
}

export default Compass;
