import api from "../../../../hooks/api";

// Concatenar el contexto y el servicio/recurso
const API_URL_GRADO = "/api/v1/grado/all";
const API_URL_AREA = "/api/v1/area-conocimiento/all";
const API_URL_NIVEL = "/api/v1/nivel-educativo/all";
const API_URL_NOMBRAMIENTO = "/api/v1/nombramiento/activa";
const API_URL_DEPENDENCIA = "/api/v1/dependencia/activa";
const API_URL_PRELLENADO = "/api/v1/solicitud/activa";
const API_URL_SOLICITUD = "/api/v1/solicitud";
const API_URL_PROGRAMAS_EDUCATIVOS = "/api/v1/programa-educativo/all";
const API_URL_MUNICIPIOS = "/api/v1/municipio/all";

export const getMunicipiosService = async () => {
  try {
    const response = await api.get(API_URL_MUNICIPIOS);
    if (response.status !== 200) {
      throw new Error("Error al obtener los municipios");
    }

    return response.data;
  } catch (error) {
    throw new Error("Error del servidor al obtener los municipios");
  }
};

export const getGradoService = async () => {
  try {
    const response = await api.get(API_URL_GRADO);
    if (response.status !== 200) {
      throw new Error("Error al obtener el grados");
    }

    return response.data;
  } catch (error) {
    throw new Error("Error del servidor al obtener el grados");
  }
};

export const getPrefilledService = async () => {
  try {
    const response = await api.get(API_URL_PRELLENADO);
    if (response.status !== 200) {
      throw new Error("Error al obtener el prefilled");
    }

    return response.data;
  } catch (error) {
    const status = error.response.status;

    if (status === 401) {
      throw new Error("Usuario no autorizado");
    } else if (status === 403) {
      throw new Error("Convocatoria no valida");
    }

    throw new Error("Error del servidor al obtener el prefilled");
  }
};

export const getProgramasEducativosService = async () => {
  try {
    const response = await api.get(API_URL_PROGRAMAS_EDUCATIVOS);
    if (response.status !== 200) {
      throw new Error("Error al obtener los programas educativos");
    }

    return response.data;
  } catch (error) {
    throw new Error("Error del servidor al obtener los programas educativos");
  }
};

export const getAreaConocimientoService = async () => {
  try {
    const response = await api.get(API_URL_AREA);
    if (response.status !== 200) {
      throw new Error("Error al obtener las areas de conocimiento");
    }

    return response.data;
  } catch (error) {
    throw new Error("Error del servidor al obtener las areas de conocimiento");
  }
};

export const getNivelesEducativosService = async () => {
  try {
    const response = await api.get(API_URL_NIVEL);
    if (response.status !== 200) {
      throw new Error("Error al obtener los niveles educativos");
    }

    return response.data;
  } catch (error) {
    throw new Error("Error del servidor al obtener los niveles educativos");
  }
};

export const getNombramientosService = async () => {
  try {
    const response = await api.get(API_URL_NOMBRAMIENTO);
    if (response.status !== 200) {
      throw new Error("Error al obtener los nombramientos");
    }

    return response.data;
  } catch (error) {
    throw new Error("Error del servidor al obtener los nombramientos");
  }
};

export const getDependenciasService = async () => {
  try {
    const response = await api.get(API_URL_DEPENDENCIA);
    if (response.status !== 200) {
      throw new Error("Error al obtener las dependencias");
    }

    return response.data;
  } catch (error) {
    throw new Error("Error del servidor al obtener las dependencias");
  }
};
