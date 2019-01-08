const hikeData = {
  id: 1,
  name: 'Simple',
  type: 'simple',
  size: 'full',
  logger: 'none',
  trackWriter: 'none',
};

const trailsData = [
  { id: 1, name: 'Simple' },
  { id: 2, name: 'One' },
  { id: 3, name: 'Two' },
  { id: 4, name: 'Three' },
];

const hikersData = [
  { id: 1, name: 'Simple' },
  { id: 2, name: 'One' },
  { id: 3, name: 'Two' },
  { id: 4, name: 'Three' },
  { id: 5, name: 'Four' },
  { id: 6, name: 'Five' },
  { id: 7, name: 'Six' },
  { id: 8, name: 'Seven' },
  { id: 9, name: 'Eight' },
];

export const initialHike: any = { ...hikeData };
initialHike.trails = trailsData.map((t) => ({ ...t }));
initialHike.trails.forEach((t) => {
  t.hikers = hikersData.map((k) => ({ ...k, id: k.id + t.id * 10, name: `${k.name}.${t.id}.${k.id}` }));
});

export function reduceItemWithChanges(item, changes) {
  return { ...item, ...changes };
}

export function reduceListItemWithChanges(list, itemIndex, itemChanges) {
  return list.map((item, index) => {
    return index === itemIndex
      ? reduceItemWithChanges(item, itemChanges)
      : item;
  });
}

export function reduceListWithItem(list, itemIndex, newItem) {
  return list.map((item, index) => {
    return index === itemIndex
      ? newItem
      : item;
  });
}
