import axios from 'axios';
import { getAccessToken } from './authService'; // Asumimos que tienes esta función para obtener el token

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_GENERAR_CARTA_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/alta-carta-desempeno-academico`;
const API_ELIMINAR_CARTA_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/eliminar-carta-desempeno-academico`;
const API_CONSULTAR_CARTA_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/consultar-carta-jefe-depto`;
const API_EDITAR_CARTA_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/editar-carta-desempeno-academico`;

// Servicio para generar la Carta de Desempeño Académico
export const generarCartaDesempeno = async (materia) => {
  try {
    const token = await getAccessToken();

    console.log("Enviando solicitud para generar la carta de desempeño con los datos:", {
      idQr: materia.idQr,
      programaEducativo: materia.programaEducativo,
      crn: materia.crn,
      clave: materia.clave,
      asignatura: materia.asignatura,
      nivelEducativo: materia.nivelEducativo,
      cargaHoraria: materia.cargaHoraria,
      nombreProfesor: materia.nombreProfesor || "EMPTY",
      codigoProfesor: materia.codigoProfesor,
      noOficio: materia.noOficio || "AUTOGENERADO", // Asegurar que no sea nulo
      cicloEscolar: materia.cicloEscolar,
      calificacion: materia.calificacion || "Bueno", // Asegurar que no sea nulo
      ubicacion: materia.ubicacion || "Desconocida", // Asegurar que no sea nulo
      nombreJefe: materia.nombreJefe || "Sin Nombre Jefe",
      cargoJefe: materia.cargoJefe || "Sin Cargo Jefe",
      codigoEmpleado: materia.codigoEmpleado || "SIN-CODIGO",
      correoProfesor:  materia.correoProfesor ||"samador@cucea.udg.mx",
      tipoCurso:  materia.tipoCurso || "TEÓRICA"
    });

    // Petición para generar la carta de desempeño académico
    await axios.post(
      API_GENERAR_CARTA_URL,
      {
        idQr: materia.idQr,
        programaEducativo: materia.programaEducativo,
        crn: materia.crn,
        clave: materia.clave,
        asignatura: materia.asignatura,
        nivelEducativo: materia.nivelEducativo,
        cargaHoraria: materia.cargaHoraria,
        nombreProfesor: materia.nombreProfesor || "EMPTY",
        codigoProfesor: materia.codigoProfesor,
        noOficio: materia.noOficio || "AUTOGENERADO",
        cicloEscolar: materia.cicloEscolar,
        calificacion: materia.calificacion || "Bueno",
        ubicacion: materia.ubicacion || "Desconocida",
        nombreJefe: materia.nombreJefe || "Sin Nombre Jefe",
        cargoJefe: materia.cargoJefe || "Sin Cargo Jefe",
        codigoEmpleado: materia.codigoEmpleado || "SIN-CODIGO",
        correoProfesor:  materia.correoProfesor ||"samador@cucea.udg.mx",
        tipoCurso:  materia.tipoCurso || "TEÓRICA"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Asegurarnos de que el token esté correctamente configurado
        },
      }
    );

    console.log("Carta de Desempeño generada exitosamente.");
  } catch (error) {
    console.error('Error al generar la Carta de Desempeño:', error.response?.data || error.message);
    throw new Error('No se pudo generar la Carta de Desempeño.');
  }
};

// Servicio para eliminar la Carta de Desempeño Académico
export const eliminarCartaDesempeno = async (materia) => {
  try {
    const token = await getAccessToken();

    console.log("Enviando solicitud para eliminar la carta de desempeño con el ID:", materia.idQr);

    // Petición para eliminar la carta de desempeño académico
    await axios.post(
      API_ELIMINAR_CARTA_URL,
      {
        idQr: materia.idQr,
        programaEducativo: materia.programaEducativo,
        crn: materia.crn,
        clave: materia.clave,
        asignatura: materia.asignatura,
        nivelEducativo: materia.nivelEducativo,
        cargaHoraria: materia.cargaHoraria,
        nombreProfesor: materia.nombreProfesor || "EMPTY",
        codigoProfesor: materia.codigoProfesor,
        noOficio: materia.noOficio || "AUTOGENERADO",
        cicloEscolar: materia.cicloEscolar,
        calificacion: materia.calificacion || "Bueno",
        ubicacion: materia.ubicacion || "Desconocida",
        nombreJefe: materia.nombreJefe || "Sin Nombre Jefe",
        cargoJefe: materia.cargoJefe || "Sin Cargo Jefe",
        codigoEmpleado: materia.codigoEmpleado || "SIN-CODIGO",
        correoProfesor:  materia.correoProfesor ||"samador@cucea.udg.mx",
        tipoCurso:  materia.tipoCurso || "TEÓRICA"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Asegurarnos de que el token esté correctamente configurado
        },
      }
    );
    console.log("Carta de Desempeño eliminada exitosamente.");
  } catch (error) {
    console.error('Error al eliminar la Carta de Desempeño:', error.response?.data || error.message);
    throw new Error('No se pudo eliminar la Carta de Desempeño.');
  }
};

// Servicio para consultar una Carta de Desempeño Académico existente y descargar el PDF
export const consultarCartaDesempeno = async (idQr) => {
  try {
    const token = await getAccessToken();

    console.log("Enviando solicitud para consultar la carta de desempeño con el ID:", idQr);

    // Petición para consultar la carta de desempeño académico
    const response = await axios.post(
      API_CONSULTAR_CARTA_URL,
      {
        idQr,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Asegurarnos de que el token esté correctamente configurado
        },
        responseType: 'blob', // Esperamos el PDF como un blob
      }
    );

    // Crear un archivo descargable del blob
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CARTA_DESEMPEÑO_DOCENTE.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Carta de Desempeño descargada exitosamente.");
  } catch (error) {
    console.error('Error al consultar y descargar la Carta de Desempeño:', error.response?.data || error.message);
    throw new Error('No se pudo consultar y descargar la Carta de Desempeño.');
  }
};

export const consultarCartaEvaluacion = async (idQr) => {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
      API_CONSULTAR_CARTA_URL,
      { idQr },
      { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CARTA_EVALUACION_ESTUDIANTES.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error(
      "Error al consultar y descargar:",
      error.response?.data || error.message
    );
    throw new Error("No se pudo consultar y descargar.");
  }
};

// Servicio para editar una Carta de Desempeño Académico existente
export const editarCartaDesempeno = async (materia) => {
  try {
    const token = await getAccessToken();

    console.log("Enviando solicitud para editar la carta de desempeño con los datos:", {
      idQr: materia.idQr,
      programaEducativo: materia.programaEducativo,
      crn: materia.crn,
      clave: materia.clave,
      asignatura: materia.asignatura,
      nivelEducativo: materia.nivelEducativo,
      cargaHoraria: materia.cargaHoraria,
      nombreProfesor: materia.nombreProfesor,
      codigoProfesor: materia.codigoProfesor,
      noOficio: materia.noOficio,
      cicloEscolar: materia.cicloEscolar,
      calificacion: materia.calificacion,
      ubicacion: materia.ubicacion,
      nombreJefe: materia.nombreJefe,
      cargoJefe: materia.cargoJefe,
      codigoEmpleado: materia.codigoEmpleado,
    });

    // Petición para editar la carta de desempeño académico
    await axios.post(
      API_EDITAR_CARTA_URL,
      {
        idQr: materia.idQr,
        programaEducativo: materia.programaEducativo,
        crn: materia.crn,
        clave: materia.clave,
        asignatura: materia.asignatura,
        nivelEducativo: materia.nivelEducativo,
        cargaHoraria: materia.cargaHoraria,
        nombreProfesor: materia.nombreProfesor,
        codigoProfesor: materia.codigoProfesor,
        noOficio: materia.noOficio,
        cicloEscolar: materia.cicloEscolar,
        calificacion: materia.calificacion,
        ubicacion: materia.ubicacion,
        nombreJefe: materia.nombreJefe,
        cargoJefe: materia.cargoJefe,
        codigoEmpleado: materia.codigoEmpleado,
        correoProfesor:  materia.correoProfesor,
        tipoCurso:  materia.tipoCurso
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Asegurarnos de que el token esté correctamente configurado
        },
      }
    );

    console.log("Carta de Desempeño editada exitosamente.");
  } catch (error) {
    console.error('Error al editar la Carta de Desempeño:', error.response?.data || error.message);
    throw new Error('No se pudo editar la Carta de Desempeño.');
  }
};
