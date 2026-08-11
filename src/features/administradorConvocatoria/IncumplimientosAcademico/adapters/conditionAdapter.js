export const conditionResponseAdapter = (response) => {
  if (!response || response.length <= 0) {
    return [];
  }

  return response.map((condition) => {
    return {
      id: condition.id,
      alias: condition.alias,
      description: condition.descripcion,
    };
  });
};
