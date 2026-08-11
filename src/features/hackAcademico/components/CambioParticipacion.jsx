import axios from "axios";
import React, { useEffect, useState } from "react";
import Alert from "../../../reutilizable/Alert";
import { useDatosAcademico } from "../../academico/store/useDatosAcademico";
import modalStyles from "../../administradorConvocatoria/AprobaciónJefeDepartamento/styles/AcademicosTabla.module.css";
import styles from "./styles/CambioParticipacion.module.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_TIPO_PARTICIPACION = `${API_BASE_URL}/api/v1/tipo-participacion/all`;
const API_URL_SOLICITUD_ACTIVA = `${API_BASE_URL}/api/v1/solicitud/activa`;
const API_URL_ACTUALIZAR_TIPO_PARTICIPACION = `${API_BASE_URL}/api/v1/solicitud/actualizar-tipo-participacion`;

export const CambioParticipacion = () => {
  const { refreshDataAcademico } = useDatosAcademico();
  const [tiposParticipacion, setTiposParticipacion] = useState([]);
  const [tipoActual, setTipoActual] = useState(null);
  const [tipoActualNombre, setTipoActualNombre] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [idSolicitud, setIdSolicitud] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // Obtener datos de la solicitud activa para conocer el tipo de participación actual
        const responseSolicitud = await axios.get(API_URL_SOLICITUD_ACTIVA, {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        let idTipoActual = null;
        if (responseSolicitud.data) {
          console.log("responseSolicitud", responseSolicitud.data);
          setIdSolicitud(responseSolicitud.data.id);
          idTipoActual = responseSolicitud.data.idTipoParticipacion;
          setTipoActual(idTipoActual);
        }

        // Obtener tipos de participación disponibles desde /api/v1/tipo-participacion/all
        const responseParticipaciones = await axios.get(API_URL_TIPO_PARTICIPACION, {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (responseParticipaciones.status === 200 && responseParticipaciones.data) {
          console.log("participaciones", responseParticipaciones.data);
          // Asegurar que sea un array
          const participacionesArray = Array.isArray(responseParticipaciones.data)
            ? responseParticipaciones.data
            : [];
          setTiposParticipacion(participacionesArray);

          // Obtener el nombre del tipo actual
          if (idTipoActual) {
            const tipoEncontrado = participacionesArray.find(
              (tipo) => Number(tipo.id) === Number(idTipoActual)
            );
            if (tipoEncontrado) {
              setTipoActualNombre(tipoEncontrado.nombre || tipoEncontrado.descripcion || tipoEncontrado.desciptcion || "No disponible");
            } else {
              setTipoActualNombre("No disponible");
            }
          }
        }

      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("Error al cargar los datos. Por favor, intente nuevamente.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setNuevoTipo(e.target.value);
    setError("");
  };

  const validateSelection = () => {
    if (!nuevoTipo || nuevoTipo === "0") {
      setError("Por favor, seleccione un nuevo tipo de participación.");
      return false;
    }

    if (Number(nuevoTipo) === Number(tipoActual)) {
      setError("El nuevo tipo de participación debe ser diferente al actual.");
      return false;
    }

    return true;
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!validateSelection()) return;
    setError("");
    setShowConfirm(true);
  };

  const handleConfirmChange = async () => {
    if (!validateSelection()) return;

    // Cerrar el modal inmediatamente al confirmar
    setShowConfirm(false);


    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("accessToken");

      // Llamar al endpoint PUT /solicitud/actualizar-tipo-participacion
      console.log("nuevoTipo", nuevoTipo);
      await axios.put(API_URL_ACTUALIZAR_TIPO_PARTICIPACION, { idTipoParticipacion: Number(nuevoTipo) },
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Actualizar estado local
      setSuccess(true);
      setTipoActual(Number(nuevoTipo));
      const tipoEncontrado = tiposParticipacion.find(
        (tipo) => Number(tipo.id) === Number(nuevoTipo)
      );
      if (tipoEncontrado) {
        setTipoActualNombre(
          tipoEncontrado.nombre ||
          tipoEncontrado.descripcion ||
          tipoEncontrado.desciptcion ||
          "No disponible"
        );
      }
      setNuevoTipo("");

      // Actualizar el store para que el header se actualice automáticamente
      const username = localStorage.getItem('userName');
      if (username) {
        await refreshDataAcademico(username);
      }

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error al cambiar tipo de participación: ", error);
      setError(
        error.response?.data?.mensaje ||
        "Error al guardar el cambio. Por favor, intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNuevoTipo("");
    setError("");
    setSuccess(false);
  };


  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Sección de Instrucciones */}
        <div className={styles.instruccionesSection}>
          <h3 className={styles.instruccionesTitle}>NOTAS:</h3>
          <ol className={styles.instruccionesList}>
            <li>
              Los cambios están permitidos únicamente <b>antes de realizar el envío</b>.
            </li>
            <li>
              El tipo de participación seleccionado determina los rubros de evaluación;{" "}
              <b>verifique su selección</b>.
            </li>
            <li>
              Al cambiar el tipo de participación,<b>se eliminarán todos los documentos previamente subidos en los rubros.</b>
            </li>
          </ol>
        </div>

        {/* Sección del Formulario */}
        <div className={styles.formSection}>
          <h2 className={styles.title}>Cambio de tipo de participación</h2>

          <p className={styles.description}>
            Aquí puedes modificar el tipo de participación mientras no hayas enviado la solicitud.
          </p>

          <form onSubmit={handleOpenConfirm} className={styles.form}>
            <div className={styles.formFields}>
              <div className={styles.inputContainer}>
                <label htmlFor="tipoActual">Tipo de participación actual:</label>
                <input
                  id="tipoActual"
                  type="text"
                  value={tipoActualNombre}
                  readOnly
                  className={styles.inputReadOnly}
                />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="nuevoTipo">Nuevo tipo de participación:</label>
                <select
                  id="nuevoTipo"
                  value={nuevoTipo}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={loading}
                >
                  <option value="0">Seleccione</option>
                  {Array.isArray(tiposParticipacion) && tiposParticipacion
                    .map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.desciptcion}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {error && (
              <Alert typeAlert="error">
                <p>No es posible actualizar el tipo de participación, dado que la solicitud ya fue enviada o no existe un rechazo previo por parte del Secretario.</p>
              </Alert>
            )}

            {success && (
              <Alert typeAlert="success">
                <p>El cambio de tipo de participación se ha guardado correctamente.</p>
              </Alert>
            )}

            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.buttonCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.buttonSave}
                disabled={loading || !nuevoTipo || nuevoTipo === "0"}
              >
                Guardar cambio
              </button>
            </div>
          </form>
        </div>
      </div>

      {showConfirm && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modal}>
            <div className={modalStyles.modalContent}>
              <div className={modalStyles.warningIconContainer}>
                <svg
                  className={modalStyles.warningIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.29 3.86a1.5 1.5 0 0 1 2.42 0l8.25 12A1.5 1.5 0 0 1 19.75 18H4.25a1.5 1.5 0 0 1-1.21-2.39l8.25-12Zm1.71 4.14a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75Zm0 8.25a.88.88 0 1 0 0 1.75.88.88 0 0 0 0-1.75Z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className={modalStyles.modalTitle}>Advertencia</h2>
              </div>
              <p className={modalStyles.modalMessage}>
              Al cambiar el tipo de participación, se eliminarán todos los documentos previamente subidos en los rubros.
              </p>
              <p className={modalStyles.modalMessage}>
                ¿Desea continuar con el cambio?
              </p>
              <div className={modalStyles.modalButtons}>
                <button
                  type="button"
                  className={modalStyles.modalButtonCancel}
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={modalStyles.modalButtonConfirm}
                  onClick={handleConfirmChange}
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

