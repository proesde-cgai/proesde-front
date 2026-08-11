const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${API_BASE_URL}/solicitud`;

const getAccessToken = () => {
  const token = localStorage.getItem("accessToken");
  console.log("Access Token:", token); 
  if (!token) {
    throw new Error("No se encontró el token de acceso. ¿El usuario está autenticado?");
  }
  return token;
};

export const buscarSolicitud = async (codigo) => {
  try {
    const token = getAccessToken(); 
    const response = await fetch(`${API_URL}/${codigo}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Solicitud no encontrada o autorización fallida");
    }
  } catch (error) {
    console.error("Error al buscar solicitud:", error);
    throw error;
  }
};


export const toggleSolicitud = async (idSolicitud, activar) => {
  try {
    const token = getAccessToken(); // Obtener el token del almacenamiento
    const response = await fetch(`${API_URL}/activar/${idSolicitud}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // Incluir el token en la cabecera
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ activar }), // Mandar el valor activar: true o false en el cuerpo
    });

    const responseData = await response.json(); // Obtener la respuesta del servidor
    console.log("Respuesta del servidor:", responseData); // Ver qué está devolviendo el servidor

    if (!response.ok) {
      throw new Error("Error al actualizar la solicitud");
    }
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    throw error;
  }
};
