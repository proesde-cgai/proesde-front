
import React, { useEffect, useState } from "react";
import styles from "./styles/ReportesExcel.module.css";
import axios from "axios";
import { getAccessToken } from "../../authService";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const CONVOCATORIAS_ALL = `${API_BASE_URL}/api/v1/convocatoria/all`;
const CONSULTA_STATUS_EXCEL = `${API_BASE_URL}/api/v1/vaciados-excel/consulta-status-excel-historico`;
const GENERACION_VACIADO_EXCEL = `${API_BASE_URL}/api/v1/vaciados-excel/generacion-vaciado-excel-historico`;
const CONSULTA_VACIADO_EXCEL = `${API_BASE_URL}/api/v1/vaciados-excel/consulta-vaciado-excel-historico`;

const FIXED_REPORTS = [
    { id: "1", fileName: "Excel-1.xlsx", downloadUrl: `/api/v1/vaciados-excel/vaciado-no-group` },
    { id: "2", fileName: "Excel - Tipo de participación.xlsx", downloadUrl: `/api/v1/vaciados-excel/tipo-participacion` },
    { id: "3", fileName: "Excel - Publicación Gaceta.xlsx", downloadUrl: `/api/v1/gaceta/descargar` },
    { id: "4", fileName: "Excel - Por Rubro de evaluación.xlsx", downloadUrl: `/api/v1/vaciados-excel/rubro-evaluacion` },

];


const ReportesExcel = () => {

    const [convocatorias, setConvocatorias] = useState([]);
    const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [menusHabilitados, setMenusHabilitados] = useState([]);
    const [isLoadingStatus, setIsLoadingStatus] = useState(false);

    const fetchStatusExcel = async (selectedConvocatoria) => {
        if (!selectedConvocatoria) {
            setMenusHabilitados([]);
            return;
        }

        try {
            setIsLoadingStatus(true);
            const token = await getAccessToken();
            const response = await axios.get(CONSULTA_STATUS_EXCEL, {
                params: {
                    idConvocatoria: selectedConvocatoria.id,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const menus = response.data?.menus || [];
            setMenusHabilitados(menus);
        } catch (error) {
            console.error("Error al obtener el estado de los reportes:", error);
            setMenusHabilitados([]);
        } finally {
            setIsLoadingStatus(false);
        }
    };

    useEffect(() => {
        const fetchConvocatorias = async () => {
            try {
                setIsLoading(true);
                const token = await getAccessToken();
                const response = await axios.get(CONVOCATORIAS_ALL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const convocatoriasData = response.data || [];
                const ordenadasRecientePrimero = [...convocatoriasData].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
                setConvocatorias(ordenadasRecientePrimero);

                // Si hay convocatorias, seleccionar la primera por defecto (la más reciente)
                if (ordenadasRecientePrimero.length > 0) {
                    setConvocatoriaSeleccionada(ordenadasRecientePrimero[0]);
                }
            } catch (error) {
                console.error("Error al obtener las convocatorias:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConvocatorias();
    }, []);

    useEffect(() => {
        fetchStatusExcel(convocatoriaSeleccionada);
    }, [convocatoriaSeleccionada]);

    const handleConvocatoriaChange = (e) => {
        const convocatoriaId = parseInt(e.target.value);
        const convocatoria = convocatorias.find(c => c.id === convocatoriaId);
        setConvocatoriaSeleccionada(convocatoria || null);
    };

    // Función helper para generar el nombreCorto del botón
    const getButtonNombreCorto = (actionType, vuelta, index) => {
        const accion = actionType === 'generar' ? 'Generar' : 'Descargar';
        const vueltaTexto = vuelta === 'primera' ? 'primera' : 'segunda';
        return `${accion}_${vueltaTexto}_vuelta_${index}`;
    };

    // Función helper para verificar si un botón está habilitado
    const isButtonEnabled = (actionType, vuelta, index) => {
        if (!convocatoriaSeleccionada || isLoading || isLoadingStatus) {
            return false;
        }
        
        const nombreCorto = getButtonNombreCorto(actionType, vuelta, index);
        return menusHabilitados.some(menu => menu.nombreCorto === nombreCorto);
    };

    const handleAction = async (report, reportIndex, actionType, vuelta) => {
        if (!convocatoriaSeleccionada) {
            alert("Por favor, seleccione una convocatoria antes de realizar la acción.");
            return;
        }

        // Buscar el menú correspondiente para obtener tipo y etapa
        const nombreCorto = getButtonNombreCorto(actionType, vuelta, reportIndex);
        const menuHabilitado = menusHabilitados.find(menu => menu.nombreCorto === nombreCorto);
        
        if (!menuHabilitado) {
            alert("El botón seleccionado no está disponible.");
            return;
        }

        const token = await getAccessToken();
        const { tipo, etapa } = menuHabilitado;
        
        // Determinar la acción: 'generar' o 'descargar'
        const isGenerar = actionType === 'generar';
        const isPrimeraVuelta = vuelta === 'primera';
        
        // Construir la URL según el tipo de acción
        let url;
        if (isGenerar) {
            url = `${GENERACION_VACIADO_EXCEL}?idConvocatoria=${convocatoriaSeleccionada.id}&tipo=${tipo}&etapa=${etapa}`;
        } else {
            url = `${CONSULTA_VACIADO_EXCEL}?idConvocatoria=${convocatoriaSeleccionada.id}&tipo=${tipo}&etapa=${etapa}`;
        }
        
        // Tanto para generar como para descargar, esperamos un archivo Excel en la respuesta
        axios({
            url: url,
            method: "GET",
            responseType: "blob",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
                const link = document.createElement("a");
                link.href = blobUrl;
                const contentDisposition = response.headers['content-disposition'] || '';
                const headerFileName = contentDisposition.match(/filename="?([^"]+)"?/)?.[1];
                const ext = headerFileName ? headerFileName.split('.').pop() : 'xlsx';
                const fileName = `${report.fileName.replace(/\.[^.]+$/, '')}_${isPrimeraVuelta ? 'primera' : 'segunda'}_vuelta_${reportIndex}.${ext}`;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();

                // Si se generó un archivo, volvemos a consultar el estado para refrescar los botones
                if (isGenerar) {
                    fetchStatusExcel(convocatoriaSeleccionada);
                }
            })
            .catch((error) => {
                console.error("Error al procesar el archivo:", error);
                const errorMessage = error.response?.data?.mensaje || error.response?.data?.message || "Error al procesar el archivo. Por favor, intente nuevamente.";
                alert(errorMessage);
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
                    {isLoading ? (
                        <span className={styles.cicloValue}>Cargando...</span>
                    ) : (
                        <select 
                            className={styles.selectConvocatoria}
                            value={convocatoriaSeleccionada?.id || ""}
                            onChange={handleConvocatoriaChange}
                        >
                            {convocatorias.length === 0 ? (
                                <option value="">No hay convocatorias disponibles</option>
                            ) : (
                                convocatorias.map((convocatoria) => (
                                    <option key={convocatoria.id} value={convocatoria.id}>
                                        {convocatoria.nombre}
                                    </option>
                                ))
                            )}
                        </select>
                    )}
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
                            {FIXED_REPORTS.map((report, index) => (
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
                                        <div className={styles.buttonsContainer}>
                                            <div className={styles.buttonsGroupLeft}>
                                                {isButtonEnabled('generar', 'primera', index) && (
                                                    <button
                                                        type="button"
                                                        className={styles.downloadButton}
                                                        onClick={() => handleAction(report, index, 'generar', 'primera')}
                                                        title="Generar Primera Vuelta"
                                                    >
                                                        Generar Primera Vuelta
                                                    </button>
                                                )}
                                                {isButtonEnabled('descargar', 'primera', index) && (
                                                    <button
                                                        type="button"
                                                        className={styles.downloadButton}
                                                        onClick={() => handleAction(report, index, 'descargar', 'primera')}
                                                        title="Descargar Primera Vuelta"
                                                    >
                                                        Descargar Primera Vuelta
                                                    </button>
                                                )}
                                            </div>
                                            <div className={styles.buttonsGroupRight}>
                                                {isButtonEnabled('generar', 'segunda', index) && (
                                                    <button
                                                        type="button"
                                                        className={styles.downloadButton}
                                                        onClick={() => handleAction(report, index, 'generar', 'segunda')}
                                                        title="Generar Segunda Vuelta"
                                                    >
                                                        Generar Segunda Vuelta
                                                    </button>
                                                )}
                                                {isButtonEnabled('descargar', 'segunda', index) && (
                                                    <button
                                                        type="button"
                                                        className={styles.downloadButton}
                                                        onClick={() => handleAction(report, index, 'descargar', 'segunda')}
                                                        title="Descargar Segunda Vuelta"
                                                    >
                                                        Descargar Segunda Vuelta
                                                    </button>
                                                )}
                                            </div>
                                        </div>
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
