import React from 'react'
import GestionComision from './components/gestionComision/GestionComision'
import Modal from './components/modal/Modal'
import { ActualizarIntProvider } from './context/actualizarIntProvider'
import styles from './styles/ActualizarIntegrantesComicion.module.css'
import { TitlePage } from '../components/TitlePage'

const ActualizarIntegranteComision = () => {
    return (
        <ActualizarIntProvider>
            <div className={styles.spacing}>
                <TitlePage title='Actualizar integrantes de comisión' />

                <Modal style={styles} />
                <GestionComision styles={styles} />
            </div>
        </ActualizarIntProvider>
    )
}

export default ActualizarIntegranteComision
