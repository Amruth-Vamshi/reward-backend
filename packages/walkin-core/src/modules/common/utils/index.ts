export const stitchEntities = entitiesArray => {
  const stitchedEntities = [];
  entitiesArray.forEach(entityMapObj => {
    const entityArray = Object.values(entityMapObj);
    if (entityArray) {
      entityArray.forEach(entity => {
        if (entity) {
          stitchedEntities.push(entity);
        }
      });
    }
  });
  return stitchedEntities;
};

export const findCommonElements = (array1: string[], array2: string[]) => {
  return array1.some(item => array2.includes(item));
};
