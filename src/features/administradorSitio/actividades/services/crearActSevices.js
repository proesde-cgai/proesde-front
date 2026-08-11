import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const saveActividad = async (actividadData) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/actividad/save_actividad`,
      actividadData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error saving actividad:", error);
    throw error;
  }
};
