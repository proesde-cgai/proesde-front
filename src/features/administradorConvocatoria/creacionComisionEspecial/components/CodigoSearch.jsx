import { useEffect, useState } from "react";
import styles from "../styles/CodigoSearch.module.css";
import AlertMessage from "../../IncumplimientosAcademico/components/AlertMessage/AlertMessage";
import AcademicosTabla from "../components/AcademicosTabla";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_COMISIONES = `${API_BASE_URL}/api/v1/dictaminador/comision`;
const API_URL_TABLA_ACADEMICOS = `${API_BASE_URL}/api/v1/dictaminador/comision/`;

export default function CodigoSearch() {
    const [comision, setComision] = useState("");
    const [comisiones, setComisiones] = useState([]);
    const [academicos, setAcademicos] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadComisiones();
    }, []);

    const loadComisiones = () => {
        try {
            const token = localStorage.getItem('accessToken');

            axios.get(`${API_URL_COMISIONES}`, {
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                console.log("Comisiones cargadas:", response.data);
                setComisiones(response.data);
            })
            .catch(error => {
                console.error("Error fetching comisiones:", error);
                setError(true);
                setMessage("No se pudieron cargar las comisiones.");
            });

        } catch (error) {
            console.error("Error:", error);
            setError(true);
            setMessage("Error al cargar las comisiones.");
        }
    };

    const handleComision = (e) => {
        const id = e.target.value;
        setComision(id);
        setShowTable(false);
        setAcademicos([]);
        setMessage("");
        setError(false);
    };

    const handleConfirmar = async () => {
        if (!comision) {
            setError(true);
            setMessage("Por favor selecciona una comisión.");
            return;
        }

        setLoading(true);
        setMessage("");
        setError(false);

        try {
            const token = localStorage.getItem("accessToken");

            const { data } = await axios.get(`${API_URL_TABLA_ACADEMICOS}${comision}`, {
                headers: {
                    Accept: "*/*",
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("Académicos cargados:", data);
            setAcademicos(data || []);
            setShowTable(true);
            setError(false);
            setMessage("");
        } catch (err) {
            console.error("Error fetching académicos:", err);
            setAcademicos([]);
            setShowTable(false);
            setError(true);
            setMessage("No se pudieron cargar los académicos de la comisión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <form className={styles.leftInfo} onSubmit={(e) => e.preventDefault()}>
                    <h3 className={styles.codeTitle}>Comisión:</h3>
                    <select
                        name="comision"
                        value={comision}
                        onChange={handleComision}
                        className={styles.inputCode}
                    >
                        <option value="">Seleccione una comisión</option>
                        {comisiones.map((c) => (
                            <option key={c.idComision} value={c.idComision}>
                                {c.nombreCompuesto}
                            </option>
                        ))}
                    </select>

                    <button 
                        type="button"
                        onClick={handleConfirmar}
                        className={styles.btnCode}
                        disabled={!comision || loading}
                    >
                        {loading ? "Cargando..." : "Continuar"}
                    </button>

                    {message && <AlertMessage error={error} message={message} />}
                </form>
            </div>

            {showTable && (
                <AcademicosTabla 
                    academicos={academicos} 
                    setAcademicos={setAcademicos}
                    idComision={comision}
                />
            )}
        </>
    );
}
