import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const getActividadesSinConvocatoria = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/actividad/sin_convocatoria`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.menus;
  } catch (error) {
    console.error("Error fetching actividades:", error);
    throw error;
  }
};
export const deleteAsociacionActividades = async (idPrincipal, idSecundarias) => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/actividad//delete_asociacion`, {
      menus: [
        {
          id: idPrincipal,
          submenus: idSecundarias.map(id => ({ id }))
        }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Error eliminando la asociación de actividades:", error);
    throw error;
  }
};
export const saveAsociacionActividades = async (data) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/actividad/save_asociacion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error saving asociacion actividades:", error);
    throw error;
  }
};


export const getActividadesNuevaConvocatoria = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/actividad/nueva-convocatoria`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.menus;
  } catch (error) {
    console.error("Error fetching actividades:", error);
    throw error;
  }
};
export const updateActividad = async (data) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(`${API_BASE_URL}/api/v1/actividad`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};