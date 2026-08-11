
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles/ReportesExcel.module.css";
import axios from "axios";
import { getAccessToken } from "../../authService";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const CONVOCATORIA_ACTUAL = `${API_BASE_URL}/api/v1/convocatoria/convocatoria_actual`;

const FIXED_REPORTS = [
    { id: "1", fileName: "Excel-1.xlsx", downloadUrl: `/api/v1/vaciados-excel/vaciado-no-group` },
    { id: "2", fileName: "Excel - Tipo de participación.xlsx", downloadUrl: `/api/v1/vaciados-excel/tipo-participacion` },
    { id: "3", fileName: "Excel - Publicación Gaceta.xlsx", downloadUrl: `/api/v1/gaceta/descargar` },
    { id: "4", fileName: "Excel - Por Rubro de evaluación.xlsx", downloadUrl: `/api/v1/vaciados-excel/rubro-evaluacion` },

];


const ReportesExcel = () => {

    const [convocatoriaActual, setConvocatoriaActual] = useState({});

    useEffect(() => {
        const fetchConvocatoriaActual = async () => {
            try {
                const token = await getAccessToken();
                const response = await axios.get(CONVOCATORIA_ACTUAL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setConvocatoriaActual(response.data[0]);
            } catch (error) {
                console.error("Error al obtener la convocatoria actual:", error);
            }
        };
        fetchConvocatoriaActual();
    }, []);

    const handleDownload = async (report) => {
        const token = await getAccessToken();
        axios({
            url: `${API_BASE_URL}${report.downloadUrl}`,
            method: "GET",
            responseType: "blob", // importante para manejar archivos binarios
            headers: {
                Authorization: `Bearer ${token}`, // aseguramos que el token esté configurado
            },
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", report.fileName); // nombre del archivo
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch((error) => {
                console.error("Error al descargar el archivo:", error);
            });
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Generación de Reportes en Excel</h1>
                <p className={styles.subtitle}>
                    Genere archivos personalizados en formato Excel a partir de los datos del sistema.
                </p>
            </header>

            <div className={styles.content}>
                <div className={styles.cicloEscolar}>
                    <span className={styles.cicloLabel}>Convocatoria:</span>
                    <span className={styles.cicloValue}>{convocatoriaActual.nombre}</span>
                </div>


                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.tableHeader}>Nombre del archivo</th>
                                <th className={styles.tableHeaderAction}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {FIXED_REPORTS.map((report) => (
                                <tr key={report.id} className={styles.tableRow}>
                                    <td className={styles.tableCell}>
                                        <div className={styles.fileInfo}>
                                            <svg
                                                className={styles.excelIcon}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden="true"
                                                focusable="false"
                                            >
                                                <path
                                                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                                    fill="#1D6F42"
                                                    stroke="#1D6F42"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M14 2V8H20"
                                                    fill="#1D6F42"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M10 13L12 16L10 19M14 13L12 16L14 19"
                                                    stroke="white"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span className={styles.fileName}>{report.fileName}</span>
                                        </div>
                                    </td>
                                    <td className={styles.tableCellAction}>
                                        <button
                                            type="button"
                                            className={styles.downloadButton}
                                            onClick={() => handleDownload(report)}
                                            title='Descargar'
                                        >
                                            Descargar
                                        </button>
                                    </td>
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportesExcel;
