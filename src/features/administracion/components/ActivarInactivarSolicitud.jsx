import { useState, useEffect } from "react";
import { buscarSolicitud, toggleSolicitud } from "../../solicitudService";
import styles from "./styles/ActivarInactivarSolicitud.module.css";

export const ActivarInactivarSolicitud = () => {
  const [codigo, setCodigo] = useState("");
  const [datosSolicitud, setDatosSolicitud] = useState(null);
  const [estado, setEstado] = useState("");
  const [idSolicitud, setIdSolicitud] = useState(null); // ID de la solicitud
  const [error, setError] = useState(""); // Estado para el manejo de errores

  const handleCodigoChange = (e) => {
    const value = e.target.value;
    if (value.length <= 7) {
      setCodigo(value);
    }
  };

  // Buscar solicitud al enviar el formulario
  const handleBuscarSolicitud = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar error previo
    try {
      const solicitud = await buscarSolicitud(codigo); // Buscar la solicitud
      setDatosSolicitud(solicitud);
      setIdSolicitud(solicitud.id); // Asegúrate de asignar correctamente el ID
      setEstado(solicitud.activo ? "activo" : "inactivo"); // Asigna el estado actual de la solicitud
    } catch (error) {
      console.error("Error al buscar la solicitud:", error.message);
      setError("No se encontró la solicitud."); // Mostrar error si no se encuentra
    }
  };

  // Guardar la solicitud al hacer clic en "Guardar"
  const handleGuardarSolicitud = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar error previo

    if (!idSolicitud) {
      setError("No se encontró un ID válido para la solicitud.");
      return;
    }

    try {
      const activar = estado === "activo"; // Si el estado es "activo", activar será true; si es "inactivo", será false
      await toggleSolicitud(idSolicitud, activar); // Llamar al servicio con activar: true o false
      alert(`Solicitud ${activar ? "activada" : "inactivada"} correctamente.`);
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error.message);
      setError("Error al actualizar la solicitud."); // Mostrar error si falla la actualización
    }
  };

  // Efecto para limpiar el mensaje de error después de 3 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Limpiar el error después de 3 segundos
      }, 3000);
      return () => clearTimeout(timer); // Limpiar el timeout si el componente se desmonta
    }
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleBuscarSolicitud}>
          <label htmlFor="codigo">Código</label>
          <input
          className={styles.input}
            type="number"
            placeholder="Ingrese código de académico"
            value={codigo}
            onChange={handleCodigoChange}
          />
          <button className={styles.btn} type="submit">
            Buscar
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      {datosSolicitud && (
        <div className={styles.lista}>
          <div className={styles.lista}>
            <strong>Datos personales</strong>
            <p>{datosSolicitud.nombre || "Nombre no disponible"}</p>
          </div>

          <form className={styles.form} onSubmit={handleGuardarSolicitud}>
            <strong>Estado actual de solicitud</strong>
            <div className={styles.estado}>
              <label>
                <input
                  type="radio"
                  name="estado"
                  value="activo"
                  checked={estado === "activo"}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                />
                Activo
              </label>
              <label>
                <input
                  type="radio"
                  name="estado"
                  value="inactivo"
                  checked={estado === "inactivo"}
                  onChange={(e) => setEstado(e.target.value)}
                />
                Inactivo
              </label>
            </div>

            <button className={styles.btn} type="submit">
              Guardar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};