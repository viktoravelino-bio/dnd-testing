export function findContainer(id, dataObj) {
  if (id in dataObj) {
    return id;
  }
  return Object.keys(dataObj).find((key) =>
    dataObj[key].items.some((item) => item.id === id)
  );
}

export function getIndex(id, dataObj) {
  const containerId = findContainer(id, dataObj);

  if (!containerId) return -1;

  const index = dataObj[containerId].items.findIndex((item) => item.id === id);

  return index;
}
