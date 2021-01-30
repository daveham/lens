class BuildContext {
  idCounter;

  constructor() {
    this.idCounter = 0;
  }

  getNextId() {
    this.idCounter += 1;
    return this.idCounter;
  }

  resolveIdAndName(label, id, name) {
    const resolvedId = id || this.getNextId();
    const resolvedName = name || `${label}-${resolvedId}`;
    return [resolvedId, resolvedName];
  }
}

const buildContext = new BuildContext();

export default buildContext;
