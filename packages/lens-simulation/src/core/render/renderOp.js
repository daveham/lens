export const RenderOpShapes = {
  rectangle: 'rectangle',
  line: 'line',
  circle: 'circle',
};

export class RenderOp {
  shape;
  bounds;

  constructor(options) {
    this.shape = options.shape || RenderOpShapes.rectangle;
    this.bounds = options.bounds;
  }

  toString() {
    return `shape: ${this.shape} bounds: ${this.bounds.x}, ${this.bounds.y}, ${this.bounds.width}, ${this.bounds.height}`;
  }
}
