import { useState } from "react";
import styles from "../styles/CodigoSearch.module.css";
import AlertMessage from "../../IncumplimientosAcademico/components/AlertMessage/AlertMessage";
import axios from "axios";
import AcademicosTabla from "./AcademicosTabla";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_TABLA_JEFE = `${API_BASE_URL}/api/v1/asignacion-temporal-jefe-departamento/jefe-departamento/`;

export default function CodigoSearch() {
    const [codigo, setCodigo] = useState("");
    const [jefeDepartamento, setJefeDepartamento] = useState({});
    const [showTable, setShowTable] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [academicos, setAcademicos] = useState([]);


    

    const handleConfirmar = async () => {
        if (!codigo) {
            setError(true);
            setMessage("Por favor ingresa un código.");
            return;
        }

        setLoading(true);
        setMessage("");
        setError(false);

        try {
            const token = localStorage.getItem("accessToken");

            const { data } = await axios.get(`${API_URL_TABLA_JEFE}${codigo}`, {
                headers: {
                    Accept: "*/*",
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("Jefe departamento cargado:", data);
            setJefeDepartamento(data || {});
            setShowTable(true);
            setError(false);
            setMessage("");
            setAcademicos(data?.asignacionesTemporales || []);
        } catch (err) {
            console.error("Error fetching Jefe Departamento:", err);
            setJefeDepartamento({});
            setShowTable(false);
            setError(true);
            setMessage("No se pudo cargar la información del jefe de departamento.");
        } finally {
            setLoading(false);
        }
    };

    const hasJefeData = jefeDepartamento && Object.keys(jefeDepartamento).length > 0;

    return (
        <>
            <div className={styles.container}>
                <form className={styles.leftInfo} onSubmit={(e) => e.preventDefault()}>
                    <h3 className={styles.codeTitle}>Código:</h3>
                    <input
                        name="codigo"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        className={styles.inputCode}
                    />

                    <button 
                        type="button"
                        onClick={handleConfirmar}
                        className={styles.btnCode}
                        disabled={ loading}
                    >
                        {loading ? "Cargando..." : "Continuar"}
                    </button>

                    {message && <AlertMessage error={error} message={message} />}
                </form>

                {hasJefeData && (
                    <div className={styles.jefeInfo}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Nombre: {jefeDepartamento.nombreCompleto || "N/A"}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>CURP: {jefeDepartamento.curp || "N/A"}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Correo Electronico: {jefeDepartamento.email || "N/A"}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Dependencia: {jefeDepartamento.dependencia || "N/A"}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Departamento:{jefeDepartamento.departamento || "N/A"}</span>
                        </div>
                    </div>
                )}
            </div>

            {showTable && (
                <AcademicosTabla 
                    academicos={academicos} 
                    setAcademicos={setAcademicos}
                    codigoAutoridad={jefeDepartamento.codigoAutoridad}
                />
            )}
        </>
    );
}
