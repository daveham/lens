let globalId = 1001;
export function uuid() {
  globalId += 1;
  return `a-${globalId}`;
}

function generateMockRendering(simulationId, executionId) {
  const created = Date.now();
  const id = uuid();
  return {
    id,
    created,
    modified: created,
    simulationId,
    executionId,
    name: `sim${simulationId}-ex${executionId}-ren${id}`,
  };
}

function generateMockExecution(simulationId, renderingCount) {
  const created = Date.now();
  const id = uuid();
  const execution = {
    id,
    created,
    modified: created,
    simulationId,
    renderings: [],
    name: `sim${simulationId}-ex${id}`,
  };

  for (let i = 0; i < renderingCount; i++) {
    execution.renderings.push(generateMockRendering(simulationId, id));
  }
  return execution;
}

function generateMockSimulation(sourceId, renderingCounts) {
  const created = Date.now();
  const id = uuid();
  return {
    id,
    created,
    modified: created,
    sourceId,
    executions: renderingCounts.map(n => generateMockExecution(id, n)),
    name: `sim${id}`,
  };
}

export function generateMockSimulationsData(sourceId) {
  const sims = [];
  sims.push(generateMockSimulation(sourceId, [4, 3, 7]));
  sims.push(generateMockSimulation(sourceId, [3, 2, 9, 6, 4]));
  return sims;
}

const hikeData = {
  name: 'Simple Hike',
  type: 'simple',
  size: 'full',
  logger: 'none',
  trackWriter: 'none',
};

const trailsData = [
  { name: 'Simple Trail', type: 'simple' },
  { name: 'One Trail', type: 'simple' },
  { name: 'Two Trail', type: 'simple' },
  { name: 'Three Trail', type: 'simple' },
];

const hikersData = [
  { name: 'Simple Hiker', type: 'simple' },
  { name: 'One Hiker', type: 'simple' },
  { name: 'Two Hiker', type: 'simple' },
  { name: 'Three Hiker', type: 'simple' },
  { name: 'Four Hiker', type: 'simple' },
  { name: 'Five Hiker', type: 'simple' },
  { name: 'Six Hiker', type: 'simple' },
  { name: 'Seven Hiker', type: 'simple' },
  { name: 'Eight Hiker', type: 'simple' },
];

function generateMockHike() {
  const hike = { ...hikeData, id: uuid(), order: 0 };
  hike.trails = trailsData.map((t, index) => ({ ...t, id: uuid(), hikeId: hike.id, order: index }));
  hike.trails.forEach((t) => {
    t.hikers = hikersData.map((k, index) => ({ ...k, id: uuid(), trailId: t.id, order: index }));
  });
  return hike;
}

export function generateMockHikesData(simulationId) {
  return [generateMockHike(uuid())];
}

