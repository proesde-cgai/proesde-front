import { useModal } from "../../hooks/useModal";
import styles from "../../styles/ModalActionIncumplimiento.module.css";
import { Spin } from "../Spinner";

const ModalActionIncumplimiento = () => {
  const { textTitle, onSubmitAction, toggleModal, data } = useModal();
  if (!data.modal.isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <header className={styles.modalHeader}>
          <h3 className={styles.modalHeaderTitle}>{textTitle} registros</h3>
        </header>
        <div className={styles.modalBody}>
          <p className={styles.modalBodyText}>¿Deseas continuar?</p>

          <div className={styles.modalContainerActions}>
            <button
              className={`${styles.btnAction} ${styles.btnActionPrimaryCancel}`}
              onClick={() => toggleModal('')}
              disabled={data.serviceResponse.loading}
            >
              No
            </button>
            <button
              className={`${styles.btnAction} ${styles.btnActionPrimary}`}
              onClick={onSubmitAction}
              disabled={data.serviceResponse.loading}
            >
              {
                data.serviceResponse.loading ? (
                  <Spin />
                )
                  : "Si"
              }

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalActionIncumplimiento;
