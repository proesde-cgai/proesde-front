import api from "../../../../hooks/api";

const API_URL_SUPERPASE = `/api/v1/superpase`;
export const getAcademico = async (codigo) => {
  try {
    const response = await api.get(`${API_URL_SUPERPASE}/${codigo}`);

    if (response.status !== 200) throw new Error("No se encontró el académico");

    const data = response.data;

    // Normalizar caso donde backend devuelve { requisitos: { requisitos: [ ... ] } }
    if (data.requisitos && Array.isArray(data.requisitos.requisitos)) {
      data.requisitos = data.requisitos.requisitos;
    }

    console.log(data);
    return data;
  } catch (error) {
    const message =
      error && error.message
        ? error.message
        : "Error al obtener los datos del académico";
    throw new Error(message);
  }
};

/**
 * Actualizar superpase para un académico.
 * PUT /api/v1/superpase/:codigo
 * Si activar === true es necesario enviar:
 *   - motivo: string
 *   - requisitosIds: array
 * Si activar === false solo se envía { activar: false }
 */
export const updateSuperPase = async (
  codigo,
  { activar, motivo, requisitosIds } = {}
) => {
  try {
    if (typeof activar !== "boolean") {
      throw new Error("El campo 'activar' debe ser booleano");
    }

    const body = { activar };

    if (activar) {
      if (!motivo || typeof motivo !== "string") {
        throw new Error(
          "Cuando 'activar' es true, se requiere el campo 'motivo' de tipo string"
        );
      }

      if (!Array.isArray(requisitosIds)) {
        throw new Error(
          "Cuando 'activar' es true, se requiere 'requisitosIds' como arreglo de ids"
        );
      }

      body.motivo = motivo;
      body.requisitosIds = requisitosIds;
    }

    const response = await api.put(`${API_URL_SUPERPASE}/${codigo}`, body);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Error al actualizar el superpase");
    }

    return response.data;
  } catch (error) {
    const message =
      error && error.message
        ? error.message
        : "Error al actualizar el superpase";
    throw new Error(message);
  }
};

/**
 * Obtener historial de superpase
 * GET /api/v1/superpase/historial/:codigo
 * Devuelve array de objetos: { codigo, requisitos: [{id,nombre}], motivo, activated, fecha, hora }
 */
export const getHistorialSuperPase = async (codigo) => {
  try {
    const response = await api.get(`${API_URL_SUPERPASE}/historial/${codigo}`);

    if (response.status !== 200)
      throw new Error("No se encontró historial para el académico");

    const data = response.data;

    if (!Array.isArray(data)) {
      throw new Error("Formato de historial inválido");
    }

    return data;
  } catch (error) {
    const message =
      error && error.message
        ? error.message
        : "Error al obtener el historial de superpase";
    throw new Error(message);
  }
};
