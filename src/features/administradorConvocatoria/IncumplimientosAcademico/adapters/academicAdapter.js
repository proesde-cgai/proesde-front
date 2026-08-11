export const infoAcademicResponseAdapter = (infoAcademicResponse) => {
  return {
    name: infoAcademicResponse.nombre,
    code: infoAcademicResponse.codigo,
    lastName: `${infoAcademicResponse.apellidoPaterno} ${infoAcademicResponse.apellidoMaterno}`,
  };
};

export const breachesResponseAdapter = (response) => {
  if (!response.condicionados || response.condicionados.length <= 0) {
    return [];
  }

  return response.condicionados.map((breach) => {
    return {
      id: breach.id || 0,
      description: breach.descripcion || "",
      idCondition: breach.tipoId || 0,
    };
  });
};
