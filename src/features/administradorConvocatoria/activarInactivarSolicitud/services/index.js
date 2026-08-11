import api from "../../../../hooks/api";

const API_URL = "/api/v1/solicitud";

export const buscarSolicitud = async (codigo) => {
  try {
    const response = await api.get(`${API_URL}/${codigo}`);

    if (!response.status === 200) {
      throw new Error("Solicitud no encontrada o autorización fallida");
    }

    if (Object.keys(response.data).length === 0) {
      throw new Error("No se encontró información del Academico");
    }

    return await response.data;
  } catch (error) {
    console.error("Error del servidor al buscar solicitud:", error);
    throw new Error("No se encontró la solicitud");
  }
};

export const toggleSolicitud = async (idSolicitud, activar) => {
  try {
    const response = await api.put(`${API_URL}/activar/${idSolicitud}`, {
      activar,
    });

    if (!response.status === 200) {
      throw new Error("Error al actualizar la solicitud");
    }
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    throw new Error("Error al actualizar la solicitud");
  }
};
