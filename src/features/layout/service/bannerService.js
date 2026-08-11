import { getAccessToken } from "../../authService"; // Asumimos que tienes el servicio de autenticación separado
import axios from "axios";

import { instanceAxios } from "./instanceAxios";

const BASEURL_PT = "/api/v1";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const getBannerLogo = async () => {
  try {
    const token = await getAccessToken(); 
    const response = await instanceAxios.get(
      `${BASEURL_PT}/banner/logo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al recuperar banner");
  }
};

// parámetro

export const getFechas = async () => {
  try {
    const token = await getAccessToken(); 
    const response = await instanceAxios.get(
      `${BASEURL_PT}/parametro`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al recuperar banner");
  }
};

export const getFechasPublic = async () => {
  try {

    const response = await axios.get(`${API_BASE_URL}/public/params`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        data: {},
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al recuperar banner");
  }
};

export const getBannerPublic = async () => {
  try {

    const response = await axios.get(`${API_BASE_URL}/public/banner`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        data: {},
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al recuperar banner");
  }
};


