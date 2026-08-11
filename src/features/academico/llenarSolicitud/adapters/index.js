export const dataPrefilledAdapter = (data) => {
  const globalLoadSorted = (data.cargaGlobal || []).sort((a, b) => {
    const order = ["BACHILLERATO", "LICENCIATURA", "POSGRADO"];
    return order.indexOf(a.nivel) - order.indexOf(b.nivel);
  });

  return {
    codigo: data.codigo || null,
    nombre: data.nombre || "",
    apellidoPaterno: data.apellidoPaterno || "",
    apellidoMaterno: data.apellidoMaterno,
    rfc: data.datosSep.rfc || "",
    CURP: data.curp || "",
    ultimogrado: data.grado || null,
    nombreUltimoGradoEstudios: data.nombrePosgrado || "",
    institucionOtorgante: data.institucionOtorgante || "",
    correo: data.email || "",
    telefono: data.telefono || "",
    ext: data.ext || "",
    telefonoMovil: data.movil || "",
    nacionalidad: data.nacionalidad || "",
    entidadFederativa: "",
    municipio: data.municipio || null,
    fechaDeIngreso: data.fechaIngresoFormato || null,
    antiguedad: data.antiguedad || null,
    PuestoDirectivo: data.directivo || false,
    areaConocimiento: data.datosSep.idAreaConocimiento || null,
    cargaGlobal: globalLoadSorted,
    nivelEducativo: data.datosSep.nivelEducativo || {},
    fechaNacimientoFormato: data.fechaNacimientoFormato || "",
    nombramiento: "",
    todosCamposCorrectos: "",
  };
};
