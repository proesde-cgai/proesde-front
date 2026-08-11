export const responseAllIntegrantesComisionAdapter = (dataResponse) => {
  return {
    rol: dataResponse.nombreRol,
    roleAbbreviation: dataResponse.siglas,
    positions: dataResponse.cargos || [],
    members: dataResponse.miembros || [],
  };
};

export const memberDataAdapter = (member) => {
  return {
    id: null,
    nombre: member.nombre,
    departamento: member.departamento,
    idCargo: Number(member.cargo),
    tratamiento: member.trato,
    codigo: member.codigo,
    activo: true
  };
};
