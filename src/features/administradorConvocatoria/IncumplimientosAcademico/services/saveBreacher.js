import api from "../../../../hooks/api";

const URL_SAVE_BREACHES = "/api/v1/incumplimiento/guardar";

export const saveBreaches = async (body) => {
  try {
    const response = await api.post(URL_SAVE_BREACHES, body);
    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Error al guardar los incumplimientos");
  } catch (error) {
    throw new Error("Error al guardar los incumplimientos");
  }
};
