export const dataInformationAcademicAdapter = (data) => {
  return {
    id: data.id || "",
    nombre: data.nombre || "",
    apellidoPaterno: data.apellidoPaterno || "",
    apellidoMaterno: data.apellidoMaterno || "",
    codigo: data.condigo || "",
  };
};
