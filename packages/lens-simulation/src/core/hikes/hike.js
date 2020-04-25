class Hike {
  trails = [];

  addTrail(trail) {
    this.trails.push(trail);
  }

  run() {}

  open() {
    this.trails.forEach(trail => trail.open());
  }

  close() {
    this.trails.forEach(trail => trail.close());
  }

  onRun() {}
}

export default Hike;
