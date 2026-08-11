import React from 'react'
import Spinn from './Spinn'

const LeftInformation = ({ styles, handleBuscarSolicitud, onChange, codigo, loading }) => {
    return (
        <div className={styles.formContainer}>
            <form className={styles.formLeftInfo} onSubmit={handleBuscarSolicitud}>
                <label htmlFor="code">Código</label>
                <input
                    type="text"
                    placeholder="Ingrese código de académico"
                    value={codigo}
                    name="code"
                    onChange={onChange}
                />
                <button className={styles.btn} type="submit" disabled={loading}>
                    {loading ? <Spinn /> : "Buscar"}
                </button>
            </form>
        </div>
    )
}

export default LeftInformation
