const hikeData = {
  id: 1,
  order: 0,
  name: 'Simple',
  type: 'simple',
  size: 'full',
  logger: 'none',
  trackWriter: 'none',
};

const trailsData = [
  { id: 1, order: 0, name: 'Simple' },
  { id: 2, order: 1, name: 'One' },
  { id: 3, order: 2, name: 'Two' },
  { id: 4, order: 3, name: 'Three' },
];

const hikersData = [
  { id: 1, order: 0, name: 'Simple' },
  { id: 2, order: 1, name: 'One' },
  { id: 3, order: 2, name: 'Two' },
  { id: 4, order: 3, name: 'Three' },
  { id: 5, order: 4, name: 'Four' },
  { id: 6, order: 5, name: 'Five' },
  { id: 7, order: 6, name: 'Six' },
  { id: 8, order: 7, name: 'Seven' },
  { id: 9, order: 8, name: 'Eight' },
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
