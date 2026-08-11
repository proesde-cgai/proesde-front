import React from 'react'
import Spinn from './Spinn'
import InputRadio from './InputRadio';

const RightInformation = ({ styles, dataAcademic, handleGuardarSolicitud, estado, loading, onChangeCheckbox }) => {
    if (!dataAcademic) return null;

    const fullName = `${dataAcademic.nombre} ${dataAcademic.apellidoPaterno} ${dataAcademic.apellidoMaterno}`;

    return (
        <>
            <div className={styles.lista}>
                <span className={styles.titleSection}>Datos personales</span>
                <p>{fullName ?? "Nombre no disponible"}</p>
            </div>

            <form className={styles.form} onSubmit={handleGuardarSolicitud}>
                <span className={styles.titleSection}>Estado actual del académico</span>
                <div className={styles.estado}>
                    <InputRadio
                        checked={estado}
                        name={"block"}
                        value={"bloquear"}
                        onChange={onChangeCheckbox}
                        styles={styles}
                    />
                    <InputRadio
                        checked={!estado}
                        name={"unlock"}
                        value="desbloquear"
                        onChange={onChangeCheckbox}
                        styles={styles}
                    />
                </div>

                <button className={`${styles.btn} ${styles.btnSave}`} type="submit" disabled={loading}>
                    {loading ? <Spinn /> : "Guardar"}
                </button>
            </form>

        </>
    )
}

export default RightInformation;
