import api from "../../../../hooks/api";

const URL_CONDITIONS = "/api/v1/condicionado/tipo-condiciones";

export const getConditionsService = async () => {
  try {
    const response = await api.get(`${URL_CONDITIONS}`);
    if (response.status !== 200) {
      throw new Error("Lista de condiciones no encontrada");
    }

    return response.data;
  } catch (error) {
    throw new Error("Error al buscar las condiciones");
  }
};
