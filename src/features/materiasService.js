import axios from "axios";
import { getAccessToken } from "./authService";  // Asumimos que tienes el servicio de autenticación separado

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Concatenar el contexto y el recurso para las materias y ciclos escolares
const API_MATERIAS_URL = `${API_BASE_URL}/api/v1/jefe_depto/lista-materias-carta-desemeno-academico`; 
const API_CICLOS_ESCOLARES_URL = `${API_BASE_URL}/api/v1/jefe_depto/lista-ciclos-escolares`;
const API_SIZE_LIST_PROFESOR_URL = `${API_BASE_URL}/api/v1/jefe_depto/size-list-profesores`;
const API_SIZE_LIST_MAT_URL = `${API_BASE_URL}/api/v1/jefe_depto/size-list-profesores`;
const API_PROFESOR_URL = `${API_BASE_URL}/api/v1/jefe_depto/lista-profesor-carta-desemeno-académico`;

// Servicio para obtener la lista de materias
export const obtenerMaterias = async (codigoEmpleado, cicloEscolar,page, app) => {
  try {
    // Obtener o renovar el access token
    const token = await getAccessToken(); 

    const response = await axios.post(
      API_MATERIAS_URL,
      {
        codigoEmpleado,
        cicloEscolar,
        page,
        app,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Añadimos el token a los headers
        },
      }
    );
    console.log("Request Payload:", { codigoEmpleado, cicloEscolar, page, app });
    return response.data;  // Devolvemos los datos de la respuesta
  } catch (error) {
    console.error("Backend error response:", error.response.data);
    throw new Error("No se pudo obtener la lista de materias.");
  }
};

// Servicio para filtrar materias por ciclo escolar
export const filtrarMateriasPorCiclo = async (cicloEscolar, codigoEmpleado) => {
  try {
    // Aquí podrías obtener el código del empleado desde algún estado si lo necesitas
    const materias = await obtenerMaterias(codigoEmpleado, cicloEscolar, 1, "Prueba");
    return materias.filter((materia) => materia.cicloEscolar === cicloEscolar);
  } catch (error) {
    console.error("Error al filtrar materias:", error);
    throw new Error("No se pudo filtrar la lista de materias.");
  }
};

// Servicio para obtener la lista de ciclos escolares
export const obtenerCiclosEscolares = async () => {
  try {
    const token = await getAccessToken(); // Obtener o renovar el access token
    const response = await axios.get(API_CICLOS_ESCOLARES_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Se añade el token para autenticación
      },
    });
    return response.data; // Devolvemos los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener los ciclos escolares:", error);
    throw new Error("No se pudo obtener la lista de ciclos escolares.");
  }
};

//servicio para obtener tamaño de la lista
export const obtenerSizeList = async () => {
  try {
    const token = await getAccessToken(); // Obtener o renovar el access token
    const response = await axios.get(API_SIZE_LIST_PROFESOR_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Se añade el token para autenticación
      },
    });
    console.log("Size list", response.data);
    return response.data; // Devolvemos los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener el tamaño de la lista de profesor:", error);
    throw new Error("No se pudo obtener el tamaño del listado de profesor.");
  }
};

export const obtenerSizeListMat = async () => {
  try {
    const token = await getAccessToken(); // Obtener o renovar el access token
    const response = await axios.get(API_SIZE_LIST_MAT_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Se añade el token para autenticación
      },
    });
    return response.data; // Devolvemos los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener el tamaño de la lista de materias:", error);
    throw new Error("No se pudo obtener el tamaño del listado de materias.");
  }
};