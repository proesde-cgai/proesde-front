import api from "../../../../hooks/api";

const URL_GET_INFO_ACADEMICO = "/api/v1/incumplimiento";

export const getInfoAcademicoService = async (code) => {
  try {
    const response = await api.get(`${URL_GET_INFO_ACADEMICO}/${code}`);
    if (response.status !== 200) {
      throw new Error("Academico no encontrado");
    }

    return response.data;
  } catch (error) {
    throw new Error("Ocurrió un error al buscar el Academico");
  }
};
