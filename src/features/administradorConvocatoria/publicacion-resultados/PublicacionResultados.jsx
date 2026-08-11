import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "../../../hooks/api";
import Loading from "../../../reutilizable/Loading";
import ConfirmationModal from "../components/ConfirmationModal";
import { usePublicacionFinal } from "./publicacion-final/hooks/usePublicacionFinal";
import styles from "./styles/styles.module.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_STATUS_PUBLICACION = `${API_BASE_URL}/api/v1/gaceta/status`;
const API_URL_SEND_MAILS = `${API_BASE_URL}/api/v1/gaceta/nofica`;
function PublicacionResultados() {
  const { fetchPublicacionFinal, isLoading, error, fetchComisiones, setError } = usePublicacionFinal();
  const [comisiones, setComisiones] = useState([]);
  const [tipoComision, setTipoComision] = useState("comisionEspecial");
  const [selectedComision, setSelectedComision] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSendMails, setActiveSendMails] = useState(true);
  const [emailsEnviados, setEmailsEnviados] = useState(false);
  const [sendMailsMessage, setSendMailsMessage] = useState(null);
  const [loadingSendMails, setLoadingSendMails] = useState(false);


  useEffect(() => {
    fetchComisiones().then((data) => {
      console.log(data);
      setComisiones(data);
    });
  }, [fetchComisiones]);

  const handleChangeComision = (e) => {
    console.log(e.target.value);
    setSelectedComision(e.target.value);
    setError(null);
  };

  // const handleSelectTypeComision = (e) => {
  //   console.log(e.target.checked);
  //   setTipoComision(e.target.checked ? "comisionIngreso" : "comisionEspecial");
  // };

  const handleSave = async () => {
    console.log("Guardar");
    await fetchPublicacionFinal(selectedComision);
  };

  const handleConfirm = async () => {
    setLoading(true);
    console.log("confirmar");
    const fecha = new Date();
    const fechaFormateada = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(
      fecha.getDate()
    ).padStart(2, "0")}`;
    try {
      const response = await api.get("/api/v1/gaceta/descargar?validar=true", {
        responseType: "blob",
      });

      console.log(response);

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/vnd.ms-excel",
        })
      );
      getIsActiveSendMails();
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Publicacion_Final_${fechaFormateada}.xls`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      let errorMessage = "Surgió un error al intentar Generar la Publicación Final";
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          if (text) errorMessage = text;
        } catch (_) {}
      } else if (error.response?.data) {
        errorMessage = error.response.data;
      }
      alert(errorMessage);
      return;
    } finally {
      setIsModalOpen(false);
      setLoading(false);
    }
  };

  const getIsActiveSendMails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(API_URL_STATUS_PUBLICACION, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(response.data);

      setActiveSendMails(response.data);
    } catch (error) {
      console.error("Error al verificar el estado de la publicación:", error);
      return false;
    }
  };

  const getEmailStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/api/v1/gaceta/email-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setEmailsEnviados(!!response.data);
    } catch (error) {
      console.error("Error al verificar el estado de envío de correos:", error);
    }
  };

  useEffect(() => {
    getIsActiveSendMails();
    getEmailStatus();
  }, [selectedComision]);

  const handleSendMails = async () => {
    setSendMailsMessage(null);
    setLoadingSendMails(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(API_URL_SEND_MAILS, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSendMailsMessage({ type: "success", message: "Notificacion enviada correctamente" });
      getEmailStatus();
    } catch (error) {
      console.error("Error al enviar correos:", error);
      const errorMessage = error.response?.data || "Error al enviar la notificacion";
      setSendMailsMessage({ type: "error", message: errorMessage });

    } finally {
      setLoadingSendMails(false);
      setTimeout(() => {
        setSendMailsMessage(null);
      }, 5000);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) return <Loading />;

  return (
    <div className={styles.spacing}>
      <h2 className={styles.title}>Asignación de Nivel</h2>
      {comisiones ? (
        <>
          <div className={styles.containerMain}>
            <div className={styles.containerSelectComision}>
              <div className={styles.deIngreso}>
                <h2>Vista Previa de la Gaceta</h2>
              </div>

              <select name="comisiones" id="comisiones" value={selectedComision} onChange={handleChangeComision}>
                <option value="" disabled>
                  Seleccione una comisión
                </option>
                {tipoComision === "comisionEspecial" && comisiones.comisionEspecial?.length > 0 ? (
                  comisiones.comisionEspecial.map((comision) => (
                    <option key={comision.id} value={comision.id}>
                      {comision.siglas}
                    </option>
                  ))
                ) : tipoComision === "comisionIngreso" && comisiones.comisionIngreso?.length > 0 ? (
                  comisiones.comisionIngreso.map((comision) => (
                    <option key={comision.id} value={comision.id}>
                      {comision.siglas}
                    </option>
                  ))
                ) : (
                  <option value="">No hay comisiones</option>
                )}
              </select>

              {/* Contenedor para el botón */}
              <div className={styles.buttonContainer}>
                <button className={styles.saveButton} onClick={handleSave}>
                  Generar comision final
                </button>
              </div>

              {error && <p className={styles.error}>No hay informaci&oacute;n disponible.</p>}
            </div>

            <div className={styles.containerSelectComision}>
              <h2>Envíar Publicación Final</h2>
              <button className={styles.saveButton} onClick={handleOpenModal}>
                Generar Publicación Final
              </button>
            </div>

            <div className={styles.containerSendMails}>
              <h2>Envio de Correos Electrónicos</h2>
              {activeSendMails ? (
                <>
                  <button
                    className={styles.sendButtonMails}
                    onClick={handleSendMails}
                    disabled={loadingSendMails || emailsEnviados}
                  >
                    {loadingSendMails ? "Enviando..." : "Enviar Correos a los Participantes"}
                  </button>
                  {sendMailsMessage && (
                    <p className={sendMailsMessage.type === "success" ? styles.successMessage : styles.errorMessage}>
                      {sendMailsMessage.message}
                    </p>
                  )}
                </>
              ) : (
                <p>Este paso solo se habilita despues de confirmar la publicacion oficial de la gaceta</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>No hay comisiones</p>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        loading={loading}
        message={"¿Estas seguro de que desea generar la Publicación Final?"}
      />
    </div>
  );
}

export default PublicacionResultados;
