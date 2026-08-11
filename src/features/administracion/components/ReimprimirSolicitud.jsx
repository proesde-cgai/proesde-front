import { useEffect, useState } from "react";
import styles from "./styles/ReimprimirSolicitud.module.css";
import axios from "axios";


// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Concatenar el contexto y el servicio/recurso 
const API_URL_SOLICITUD = `${API_BASE_URL}/api/v1/solicitud/`;
const API_URL_REIMPRIMIR_REPORTE = `${API_BASE_URL}/api/v1/reportes/reimprimir_reporte_solicitud/`;


export const ReimprimirSolicitud = () => {
    const [codigo, setCodigo] = useState("");
    const [fecha, setFecha] = useState("")
    const [academico, setAcademico] = useState({})
    const [error, setError] = useState("");

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => { setError(""); }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);


    const handleSubmitCodigo = (event) => {
        event.preventDefault();

        if (!codigo.trim()) {
            setError("Campo obligatorio");
            return;
        }

        const token = localStorage.getItem('accessToken');

        axios.get(`${API_URL_SOLICITUD}${codigo}`, {
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log("response ", response.data)
            setAcademico(response.data)
            setCodigo(codigo)
        })
            .catch(error => setError("No se encontro el código"))
    }



    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (!codigo.trim() || !fecha) {
            setError("Todos los campos son obligatorios.");
            return;
        }


        const token = localStorage.getItem('accessToken');

        const [year, month, day] = fecha.split('-');

        const fechaFormato = `${year}/${month}/${day}`

        axios.get(`${API_URL_REIMPRIMIR_REPORTE}${codigo}?fechaImpresion=${fechaFormato}`, {
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            responseType: 'blob'
        }
        ).then(response => {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);


            window.open(url, '_blank');
        })
            .catch(error => {
                console.error("Error fetching data: ", error.response?.data || error.message);
            });

    };

    const handleCancelar = () => {
        setCodigo("")
        setFecha("")
        setAcademico({})
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.containerAside}>
                <div className={styles.formContainer}>
                    <h2>Código:</h2>
                    <div style={{ padding: "6px" }}>
                        <input
                            type="text"
                            name="codigo"
                            id="codigo"
                            className={styles.inputField}
                            onChange={(e) => setCodigo(e.target.value)}
                        />
                    </div>
                    <div style={{ padding: "6px" }}>
                        <button
                            name="busca_solicitud"
                            id="busca_solicitud"
                            value="Buscar"
                            type="button"
                            onClick={handleSubmitCodigo}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
            {/* Form */}

            <div className={styles.form}>

                {Object.keys(academico).length !== 0 ? (
                    <>
                        <h3>
                            <strong>
                                Especifique la fecha con la que debe aparecer la solicitud y después
                                oprima el botón "Guardar".
                            </strong>
                        </h3>
                        <form className={styles.formContainer} onSubmit={handleFormSubmit}>
                            <div>
                                <span className={styles.subTiles}>Datos personales</span>
                                <div>
                                    <p className={styles.dataParticipante}>{academico?.nombre} {academico?.apellidoPaterno} {academico?.apellidoMaterno} {academico?.codigo}</p>
                                </div>
                            </div>

                            <div>
                                <span className={styles.subTiles}>Fecha de impresión</span>
                                <div className={styles.fechaInput}>
                                    <label htmlFor="fechaImpresion">Fecha: </label>
                                    <input
                                        type="date"
                                        name="fechaImpresion"
                                        id="fechaImpresion"
                                        className={styles.fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                    /> <span>AAAA-MM-DD</span>
                                </div>
                            </div>

                            <div className={styles.button}>
                                <button type="submit" className={styles.buttonSubmit}>Guardar</button>
                                <button type="button" onClick={handleCancelar} className={styles.buttonCancelar}>Cancelar</button>
                            </div>

                        </form>
                    </>
                ) : (<h3>
                    <strong>
                        Introduzca el código del académico y oprima el botón "Continuar".
                    </strong>
                </h3>)}


                <br></br>
                <br></br>
                {error && (
                    <p className={styles.error}>{error}</p>
                )
                }
            </div>



        </div>



    );
};
