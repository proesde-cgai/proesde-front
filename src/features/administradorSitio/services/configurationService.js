import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/v1`;

export const fetchAllParametros = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axios.get(`${BASE_URL}/parametro/all`, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return null;

  }
};

export const updateParametro = async (parametro) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axios.post(
      encodeURI(`${BASE_URL}/parametro/actualizar`),
      parametro,
      {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    return null;
  }
};
