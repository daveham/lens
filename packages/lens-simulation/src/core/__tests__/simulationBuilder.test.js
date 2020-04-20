import build from '../simulationBuilder';

test('build', () => {
  const simulation = build();
  expect(simulation).toBeTruthy();
});
