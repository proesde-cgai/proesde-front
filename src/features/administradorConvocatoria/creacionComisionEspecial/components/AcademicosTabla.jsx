import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/AcademicosTabla.module.css";
import { desactivarAcademico, fetchAcademicoByCodigo, guardarAcademico } from "../helpers/helpers";
import ModalSubirLista from "./ModalSubirLista";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_TABLA_ACADEMICOS = `${API_BASE_URL}/api/v1/dictaminador/comision/`;




export default function AcademicosTabla({ academicos, setAcademicos, idComision }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newCodigo, setNewCodigo] = useState("");
    const [newStatus, setNewStatus] = useState({ loading: false, found: false, searched: false });
    const [newData, setNewData] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isModalSubirListaOpen, setIsModalSubirListaOpen] = useState(false);

    // Búsqueda automática al escribir código (con debounce)
    useEffect(() => {
        if (!newCodigo.trim() || !isAdding) {
            setNewStatus({ loading: false, found: false, searched: false });
            setNewData(null);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setNewStatus({ loading: true, found: false, searched: false });
            const { found, data } = await fetchAcademicoByCodigo(newCodigo);
            
            if (found) {
                setNewStatus({ loading: false, found: true, searched: true });
                setNewData(data);
            } else {
                setNewStatus({ loading: false, found: false, searched: true });
                setNewData(null);
            }
        }, 800); // Espera 800ms después de que el usuario deja de escribir

        return () => clearTimeout(timeoutId);
    }, [newCodigo, isAdding]);

    const handleAddAcademico = () => {
        setIsAdding(true);
        setNewCodigo("");
        setNewStatus({ loading: false, found: false, searched: false });
        setNewData(null);
    };

    const handleNewCodigoChange = (value) => {
        setNewCodigo(value);
    };

    const handleAcceptNew = async () => {
        if (!newStatus.found || !newData) return;

        // Guardar en la API
        setNewStatus({ ...newStatus, loading: true });
        const result = await guardarAcademico(newCodigo, idComision);
        
        if (result.success) {
            // Agregar a la lista local
            setAcademicos(prev => [...prev, result.data]);
            setIsAdding(false);
            setNewCodigo("");
            setNewStatus({ loading: false, found: false, searched: false });
            setNewData(null);
        } else {
            setNewStatus({ ...newStatus, loading: false });
            alert("Error al guardar el académico. Por favor intente nuevamente.");
        }
    };

    const handleCancelNew = () => {
        setIsAdding(false);
        setNewCodigo("");
        setNewStatus({ loading: false, found: false, searched: false });
        setNewData(null);
    };

    const handleDesactivar = (academico) => {
        setDeleteConfirm(academico);
    };

    const confirmDesactivar = async () => {
        if (!deleteConfirm) return;

        const result = await desactivarAcademico(deleteConfirm.idDictaminadorManual);
        
        if (result.success) {
            // Actualizar la lista local removiendo el académico desactivado
            setAcademicos(academicos.filter((a) => a.idDictaminadorManual !== deleteConfirm.idDictaminadorManual));
            setDeleteConfirm(null);
        } else {
            alert("Error al desactivar el académico. Por favor intente nuevamente.");
        }
    };

    const cancelDesactivar = () => setDeleteConfirm(null);

    // Función para recargar los académicos desde la API
    const reloadAcademicos = async () => {
        if (!idComision) return;

        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${API_URL_TABLA_ACADEMICOS}${idComision}`, {
                headers: {
                    Accept: "*/*",
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setAcademicos(data || []);
        } catch (err) {
            console.error("Error al recargar académicos:", err);
        }
    };

    // Filtrar solo académicos activos
    const academicosActivos = academicos.filter(a => a.activo !== false);

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Académicos</h2>

            {(academicosActivos.length > 0 || isAdding) && (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHeaderRow}>
                                <th className={styles.tableHeader}>Código</th>
                                <th className={styles.tableHeader}>Nombre</th>
                                <th className={styles.tableHeader}>Dependencia</th>
                                <th className={styles.tableHeader}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {academicosActivos.map((academico, index) => (
                                <tr
                                    key={academico.idDictaminadorManual || index}
                                    className={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
                                >
                                    <td className={styles.tableCell}>
                                        {academico.codigo}
                                    </td>
                                    <td className={styles.tableCell}>
                                        {academico.nombre}
                                    </td>
                                    <td className={styles.tableCell}>
                                        {academico.dependenciaAcademico || academico.dependencia}
                                    </td>
                                    <td className={styles.tableCell}>
                                        <div className={styles.buttonGroup}>
                                            <button 
                                                onClick={() => handleDesactivar(academico)} 
                                                className={styles.buttonDelete}
                                            >
                                                Desactivar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {isAdding && (
                                <tr className={newStatus.searched && !newStatus.found ? styles.tableRowAlert : styles.tableRowEven}>
                                    <td className={styles.tableCell}>
                                        <div className={styles.cellContent}>
                                            {newStatus.searched && !newStatus.found && (
                                                <svg
                                                    className={styles.alertIcon}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="12" y1="8" x2="12" y2="12" />
                                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                                </svg>
                                            )}
                                            <input
                                                type="text"
                                                value={newCodigo}
                                                onChange={(e) => handleNewCodigoChange(e.target.value)}
                                                className={styles.inputEdit}
                                                placeholder="Código"
                                                autoFocus
                                            />
                                        </div>
                                    </td>
                                    <td className={styles.tableCell}>
                                        {newStatus.loading ? (
                                            <span className={styles.loadingText}>Cargando...</span>
                                        ) : newStatus.searched && !newStatus.found ? (
                                            <span className={styles.errorText}>Usuario no encontrado</span>
                                        ) : newStatus.found && newData ? (
                                            <span>{newData.nombre}</span>
                                        ) : (
                                            <span>—</span>
                                        )}
                                    </td>
                                    <td className={styles.tableCell}>
                                        {newStatus.loading ? (
                                            <span className={styles.loadingText}>Cargando...</span>
                                        ) : newStatus.searched && !newStatus.found ? (
                                            <span className={styles.errorText}>Usuario no encontrado</span>
                                        ) : newStatus.found && newData ? (
                                            <span>{newData.dependencia}</span>
                                        ) : (
                                            <span>—</span>
                                        )}
                                    </td>
                                    <td className={styles.tableCell}>
                                        <div className={styles.buttonGroup}>
                                            <button
                                                onClick={handleAcceptNew}
                                                className={`${styles.buttonClose} ${(!newStatus.found || newStatus.loading) ? styles.buttonDisabled : ""}`}
                                                disabled={!newStatus.found || newStatus.loading}
                                            >
                                                Aceptar
                                            </button>
                                            <button 
                                                onClick={handleCancelNew} 
                                                className={styles.buttonCancel} 
                                                disabled={newStatus.loading}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <div className={styles.actionButtons}>
                <button 
                    className={styles.buttonPurple} 
                    onClick={handleAddAcademico}
                    disabled={isAdding}
                >
                    Añadir Académico
                </button>
                <button 
                    className={styles.buttonBlue}
                    onClick={() => setIsModalSubirListaOpen(true)}
                >
                    Subir lista
                </button>
            </div>

            <ModalSubirLista
                isOpen={isModalSubirListaOpen}
                onClose={() => setIsModalSubirListaOpen(false)}
                idComision={idComision}
                onSuccess={reloadAcademicos}
            />

            {deleteConfirm && (
                <>
                    <div className={styles.modalOverlay} onClick={cancelDesactivar} />
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <div className={styles.warningIconContainer} />
                            <h3 className={styles.modalTitle} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    width="1em"
                                    height="1em"
                                    style={{ fill: "#FFC107", flexShrink: 0 }}
                                >
                                    <path d="M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z" />
                                </svg>
                                Advertencia
                            </h3>

                            <p className={styles.modalMessage}>
                                ¿Estás seguro de que deseas desactivar este académico? 
                                El académico dejará de mostrarse en la lista de académicos activos.
                            </p>
                            <div className={styles.modalInfo}>
                                <table className={styles.modalInfoTable}>
                                    <thead>
                                        <tr>
                                            <th className={styles.modalInfoHeaderCell}>Código</th>
                                            <th className={styles.modalInfoHeaderCell}>Nombre</th>
                                            <th className={styles.modalInfoHeaderCell}>Dependencia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className={styles.modalInfoBodyRow}>
                                            <td className={styles.modalInfoValueCell}>{deleteConfirm.codigo}</td>
                                            <td className={styles.modalInfoValueCell}>{deleteConfirm.nombre}</td>
                                            <td className={styles.modalInfoValueCell}>
                                                {deleteConfirm.dependenciaAcademico || deleteConfirm.dependencia}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className={styles.modalButtons}>
                                <button onClick={cancelDesactivar} className={styles.modalButtonCancel}>
                                    Cancelar
                                </button>
                                <button onClick={confirmDesactivar} className={styles.modalButtonConfirm}>
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
