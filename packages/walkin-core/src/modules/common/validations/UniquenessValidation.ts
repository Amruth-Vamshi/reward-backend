export const validateUniqueness = (arr, searchKey, value) => {
  if (arr.some(obj => obj[searchKey] === value)) {
    return false;
  }
  return true;
};

export const validateIfExistsForOrg = async (
  entityManager,
  module,
  options
) => {
  const result = await entityManager.findOne(module, {
    where: {
      ...options
    }
  });
  if (result !== undefined) {
    return true;
  }
  return false;
}

export const validateIfExists = async (
  entityManager,
  module,
  searchKey,
  value
) => {
  const result = await entityManager.findOne(module, {
    where: {
      [searchKey]: value
    }
  });
  if (result !== undefined) {
    return true;
  }
  return false;
};
