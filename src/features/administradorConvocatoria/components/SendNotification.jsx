import React, { useEffect, useState } from "react";
import styles from "./styles/SendNotification.module.css";
import useNotiInconformidadStore from "../../../store/useNotiInconformidadStore";
import Loading from "../../../reutilizable/Loading";
import ConfirmationModal from "./ConfirmationModal";

function SendNotification() {
  const { isLoading, notiResponse, sendNotiInconformidad } =
    useNotiInconformidadStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(notiResponse);

  const handleConfirm = async () => {
    console.log("Confirmado");
    const response = await sendNotiInconformidad();
    if (response?.status === 204) {
      alert("Se envió la notificación correctamente.");
    } else {
      alert("Error: No se pudo enviar la notificación correctamente.");
    }
    setIsModalOpen(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={styles.spacing}>
        <h2 className={styles.title}>Notificar Inconformidad</h2>
      </div>
      <div className={styles.containerManagement}>
        <h2 className={styles.titleSecondary}>
          Realizar el envio de la Notificación
        </h2>
        <button className={styles.saveButton} onClick={handleOpenModal}>
          Enviar Notificación
        </button>
      </div>

      {isLoading && <Loading />}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        message={"¿Estas seguro de enviar la notificación?"}
      />
    </>
  );
}

export default SendNotification;
