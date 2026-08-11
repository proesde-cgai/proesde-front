import React from 'react'
import Spinn from './Spinn'
import InputRadio from './InputRadio';
import TextStatus from './TextStatus';
import TextSuggestion from './TextSuggestion';

const RightInformation = ({ styles, dataAcademic, handleGuardarSolicitud, estado, onChange, loading, message, error }) => {
    if (!dataAcademic) return null;

    return (
        <div className={styles.listaContainer}>
            <TextStatus message={message} styles={styles} error={error} />
            <div className={styles.lista}>
                <span className={styles.titleSection}>Datos personales</span>
                <p>{dataAcademic?.nombre || "Nombre no disponible"} {dataAcademic?.apellidoPaterno || ""} {dataAcademic?.apellidoMaterno || ""} {dataAcademic?.codigo || ""}</p>
            </div>

            <form className={styles.form} onSubmit={handleGuardarSolicitud}>
                <span className={styles.titleSection}>Estado actual de solicitud</span>
                <div className={styles.estado}>
                    <InputRadio
                        checked={estado === "activo"}
                        name={"estado"}
                        value={"activo"}
                        text={"Activo"}
                        onChange={onChange}
                        styles={styles}
                    />
                    <InputRadio
                        checked={estado === "inactivo"}
                        name={"estado"}
                        value={"inactivo"}
                        onChange={onChange}
                        styles={styles}
                    />
                </div>

                <button className={`${styles.btn} ${styles.btnSave}`} type="submit" disabled={loading}>
                    {loading ? <Spinn /> : "Guardar"}
                </button>
            </form>

            <TextSuggestion styles={styles} dataAcademic={dataAcademic} />
        </div>
    )
}

export default RightInformation;
