const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Función para obtener el token de acceso del almacenamiento local
const getAccessToken = () => {
  return localStorage.getItem("accessToken"); // O de donde almacenes el token
};

// Trae una lista de tipos de comisiones
export const solicitudComisiones = async () => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/comision/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Error al buscar las comisiones");
    }
  } catch (error) {
    console.error("Error al buscar las comisiones:", error);
    throw error;
  }
};

// Trae una lista de tipos de cargos
export const solicitudCargo = async () => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/cargo/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Error al buscar los cargos");
    }
  } catch (error) {
    console.error("Error al buscar los cargos:", error);
    throw error;
  }
};

// Trae una lista de miembros y cargos disponibles
export const solicitudMiembros = async (idComision) => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/miembro/all/${idComision}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Error al buscar los miembros");
    }
  } catch (error) {
    console.error("Error al buscar los miembros:", error);
    throw error;
  }
};

// Envía los datos de la tabla a guardado
export const guardarComision = async (idComision, miembros) => {
  const dataToSend = {
    idComision: idComision,
    miembros: miembros.map((miembro) => ({
      idCargo: miembro.idCargo,
      tratamiento: miembro.tratamiento,
      nombre: miembro.nombre,
      codigo: miembro.codigo,
      departamento: miembro.departamento,
    })),
  };

  try {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/miembro/guardar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      throw new Error(`Error al guardar la comisión: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Miembros guardados con éxito:", result);

    return result;
  } catch (error) {
    console.error("Error durante el guardado:", error);
    throw error;
  }
};
