import api from "../../../../hooks/api";

const GET_STATE_ACADEMIC = "/api/v1/user/estado-usuario?codigo=";
const CHANGE_STATE_ACADEMIC = "/api/v1/user/cambiar-estado";

export const buscar_academic_service = async (codigo) => {
  try {
    const response = await api.get(`${GET_STATE_ACADEMIC}${codigo}`);

    if (!response.status === 200) {
      throw new Error("Academico no encontrado");
    }

    return await response.data;
  } catch (error) {
    throw new Error("Error del servidor al buscar el academico");
  }
};

export const toggle_state_academic = async (code, state) => {
  try {
    const response = await api.put(
      `${CHANGE_STATE_ACADEMIC}?codigo=${code}&estado=${state}`
    );

    if (!response.status === 200) {
      throw new Error("Error al cambiar el estado del Academico");
    }
    return response.data;
  } catch (error) {
    throw new Error("Error del servidor al cambiar el estado del Academico");
  }
};
