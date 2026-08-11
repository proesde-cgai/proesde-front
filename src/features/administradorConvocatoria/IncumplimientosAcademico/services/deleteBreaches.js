import api from "../../../../hooks/api";

const URL_DELETE_CONDITIONS = "/api/v1/incumplimiento/eliminar";

export const deleteBreaches = async (data) => {
  try {
    const response = await api.delete(URL_DELETE_CONDITIONS, {
      data,
    });
    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Error al eliminar los incumplimientos");
  } catch (error) {
    throw new Error("Ocurrió un eliminar los incumplimientos");
  }
};
