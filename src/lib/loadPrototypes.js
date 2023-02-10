function groupBy(cb) {
  if (!cb) throw new Error('undefined is not a function');
  return this.reduce((group, currentValue, currentIndex, initialArray) => {
    const aggregationKey = cb(currentValue, currentIndex, initialArray);
    return Object.assign(group, {
      [aggregationKey]:
        aggregationKey in group
          ? [...group[aggregationKey], currentValue]
          : [currentValue],
    });
  }, {});
}

function loadPrototypes() {
  const prototypes = [groupBy];
  prototypes.forEach((prototype) => {
    if (!prototype) return;
    Array.prototype[prototype.name] = prototype;
  });
}

loadPrototypes();
