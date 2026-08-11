import api from "../../../../hooks/api";

const URL_SAVE_BREACHES = "/api/v1/incumplimiento/actualizar";

export const updateBreaches = async (body) => {
  try {
    const response = await api.post(URL_SAVE_BREACHES, body);
    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Error al actualizar los incumplimientos");
  } catch (error) {
    throw new Error("Error de servidor al actualizar los incumplimientos");
  }
};
