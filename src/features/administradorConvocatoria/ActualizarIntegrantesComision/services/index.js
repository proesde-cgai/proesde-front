import api from "../../../../hooks/api";

const URL_ALL_INTEGRANTES_COMISION = `api/v1/miembro/all`;
const URL_ALL_COMMISSIONS = `api/v1/comision/all`;
const URL_GET_NAME_BY_CODE = `api/v1/user/datos?codigo=`;
const URL_CREATE_AND_UPDATE_COMMISSIONS = `api/v1/miembro/guardar`;
const URL_COPY_INTEGRANTES_COMISION = `/api/v1/miembro/clonar`;

export const getAllIntegrantesComision = async (idCommission) => {
  try {
    const response = await api.get(
      `${URL_ALL_INTEGRANTES_COMISION}/${idCommission}`
    );

    if (response.status !== 200) {
      throw new Error("Error al obtener los integrantes de la comisión");
    }

    return response.data;
  } catch (error) {
    throw new Error("Error al obtener los integrantes de la comisión");
  }
};

export const getAllCommissions = async () => {
  try {
    const response = await api.get(`${URL_ALL_COMMISSIONS}`);

    if (response.status !== 200) {
      throw new Error("Error al obtener las comisiones");
    }

    return response.data;
  } catch (error) {
    throw new Error("Error del servidor al obtener las comisiones");
  }
};

export const getNameByCode = async (code) => {
  try {
    const response = await api.get(`${URL_GET_NAME_BY_CODE}${code}`);

    if (response.status !== 200) {
      throw new Error("Error al obtener el nombre");
    }

    return response.data;
  } catch (error) {
    throw new Error("Error del servidor al obtener el nombre");
  }
};

export const createAndUpdateCommissions = async (
  dataCOmmissions,
  commission
) => {
  const body = {
    miembros: dataCOmmissions,
    idComision: commission,
  };

  try {
    const response = await api.post(URL_CREATE_AND_UPDATE_COMMISSIONS, body);

    if (response.status !== 200) {
      throw new Error("Error al crear o actualizar la comisión");
    }

    return response.data;
  } catch (error) {
    throw new Error("Error del servidor al crear o actualizar la comisión");
  }
};

export const getCopyIntegrantesComision = async (idCommission) => {
  try {
    const response = await api.get(
      `${URL_COPY_INTEGRANTES_COMISION}/${idCommission}`
    );

    if (response.status !== 200) {
      throw new Error("Error al crear o actualizar la comisión");
    }

    if (response.data.miembros.length === 0) {
      throw new Error("No se encontró la camisón");
    }

    return response.data;
  } catch (error) {
    throw new Error("No se encontró la camisón anterior");
  }
};
