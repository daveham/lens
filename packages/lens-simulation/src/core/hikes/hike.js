import getDebugLog from './debugLog';
const debug = getDebugLog('hike');

class Hike {
  trails = [];
  stepCount = 0;

  addTrail(trail) {
    this.trails.push(trail);
  }

  run() {
    debug('run');
    this.open();
    this.trails.forEach(trail => trail.open());
    this.onRun();
    this.trails.forEach(trail => trail.close());
    this.close();
  }

  open() {
    this.stepCount = 0;
    this.onOpen();
  }

  close() {
    this.onClose();
  }

  onOpen() {
    debug('onOpen');
  }

  onClose() {
    debug('close', { stepCount: this.stepCount });
  }

  onRun() {
    debug('onRun');
    let activeHikers = this.trails
      .reduce((acc, t) => [...acc, ...t.hikers], [])
      .filter(k => k.isActive());
    debug('onRun initial active hiker count', { activeHikerCount: activeHikers.length });

    const passLimit = 5;
    let pass = 0;
    while (activeHikers.length && pass < passLimit) {
      activeHikers.forEach(k => k.step());
      this.stepCount += activeHikers.length;
      activeHikers = activeHikers.filter(k => k.isActive());
      debug('onRun initial active hiker count', { activeHikerCount: activeHikers.length });
      pass += 1;
    }
  }
}

export default Hike;
