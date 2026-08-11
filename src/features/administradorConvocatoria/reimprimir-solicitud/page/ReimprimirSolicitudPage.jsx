import React, { useState } from "react";
import ModalConfirmation from "../components/ModalConfirmation";
import styles from "../styles/ReimprimirSolicitudPage.module.css";

const ReimprimirSolicitudPage = () => {
    const [codigo, setCodigo] = useState("");
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState("");
    const [fecha, setFecha] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmitCodigo = () => {
        if (codigo === "2109379") {
            setDatos({
                nombre: "LEAL MOYA IRMA LETICIA",
                codigo: "2109379",
            });
            setError("");
        } else {
            setDatos(null);
            setError("Código no válido, por favor intente nuevamente.");
        }
    };

    const handleGuardar = () => {
        setShowModal(false);
        setSuccessMessage("La solicitud se guardó de forma exitosa.");
    };

    const handleCancelar = () => {
        setShowModal(false);
    };
    const cleanData = () => {
        setSuccessMessage("");
        setFecha("");

    }
    return (
        <div className={styles.mainContainer}>
            <div className={styles.containerAside}>
                <div className={styles.formContainer}>
                    <span className={styles.codigo}>Código:</span>
                    <div style={{ width: "100%" }}>
                        <input
                            type="text"
                            name="codigo"
                            id="codigo"
                            className={styles.inputField}
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.button}
                            type="button"
                            onClick={handleSubmitCodigo}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.form}>
                {successMessage && (
                    <p className={styles.successMessage}>{successMessage}</p>
                )}
                {datos ? (
                    <div className={styles.detailsContainer}>
                        <div>
                            <span className={styles.subTiles}>Datos personales</span>
                            <p className={styles.dataCursiva}>
                                {`${datos.nombre} ${datos.codigo}`}
                            </p>
                        </div>
                        <div>
                            <span className={styles.subTiles}>Fecha de impresión</span>
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className={styles.inputFieldDate}
                            />
                        </div>
                        <div className={styles.buttonGroup}>
                            <button className={styles.cancelButton} onClick={() => cleanData()}>Cancelar</button>
                            <button className={`${styles.saveButton} ${!fecha ? styles.saveButtonDisabled : ""
                                }`} disabled={!fecha} onClick={() => setShowModal(true)}>Guardar</button>

                        </div>
                    </div>
                ) : (
                    <div className={styles.rightText}>
                        <h3>
                            <strong>Introduzca el código del académico y oprima "Continuar".</strong>
                        </h3>
                    </div>
                )}

                {error && <p className={styles.error}>{error}</p>}
            </div>

            {showModal && (
                <ModalConfirmation
                    onConfirm={handleGuardar}
                    onCancel={handleCancelar}
                />
            )}
        </div>
    );
};

export default ReimprimirSolicitudPage;
