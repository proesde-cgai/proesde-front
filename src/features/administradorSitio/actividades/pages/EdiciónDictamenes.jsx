import React, { useCallback, useEffect, useState } from 'react';
import Modal from '../../../../reutilizable/Modal';
import TinyMCEEditor from '../components/TinyMCEEditor';
import ViewerPDF from '../components/ViewerPDF';
import styles from './styles/EdicionDictamenes.module.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_GET_NAMES_DICTAMENES = `${API_BASE_URL}/api/v1/plantilla-editable/get-nombres`;
const API_URL_GET_DICTAMEN = `${API_BASE_URL}/api/v1/plantilla-editable/get-secciones`;
const API_URL_GET_PLANTILLA_VACIA = `${API_BASE_URL}/api/v1/plantilla-editable/get-plantilla-vacia/`;
const API_URL_PREVIEW_PDF = `${API_BASE_URL}/api/v1/plantilla-editable/preview`;
const API_URL_UPDATE_SECTIONS = `${API_BASE_URL}/api/v1/plantilla-editable/actualizar-secciones`;

const EdiciónDictamenes = () => {
    const [dictamenesNames, setDictamenes] = useState([]);
    const [dictamenSelected, setDictamenSelected] = useState(null);
    const [dictamen, setDictamen] = useState({
        resultando: "",
        considerando: "",
        resolutivos: ""
    });
    const [dictamenOriginal, setDictamenOriginal] = useState({
        resultando: "",
        considerando: "",
        resolutivos: ""
    });
    const [pdfBlob, setPdfBlob] = useState(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [editedContent, setEditedContent] = useState({});
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [pdfZoom, setPdfZoom] = useState(1);

    const handleZoomIn = () => {
        setPdfZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setPdfZoom(prev => Math.max(prev - 0.25, 0.5));
    };

    const fetchDictamenesNames = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${API_URL_GET_NAMES_DICTAMENES}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error('Error al consultar los nombres de dictámenes');
            }
            const data = await response.json();
            setDictamenes(data.sort((a, b) => a.id - b.id));
        } catch (error) {
            console.error('Error fetching dictamenes names:', error);
        }
    }

    useEffect(() => {
        fetchDictamenesNames();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectDictamen = (e) => {
        setDictamenSelected(e.target.value);
    }

    const fetchDictamen = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${API_URL_GET_DICTAMEN}/${dictamenSelected}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error('Error al consultar el dictamen');
            }
            const data = await response.json();
            const dictamenData = {
                resultando: data.resultando || "",
                considerando: data.considerando || "",
                resolutivos: data.resolutivos || ""
            };
            setDictamen(dictamenData);
            setDictamenOriginal(dictamenData);
            setEditedContent({});
        } catch (error) {
            console.error('Error fetching dictamen:', error);
        }
    }

    useEffect(() => {
        if (!dictamenSelected) {
            return;
        }
        fetchDictamen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dictamenSelected]);

    const generatePdfPreview = async () => {
        if (!dictamenSelected) {
            return;
        }

        setLoadingPdf(true);
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${API_URL_GET_PLANTILLA_VACIA}${dictamenSelected}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error('Error al generar el PDF');
            }
            const blob = await response.blob();
            setPdfBlob(blob);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setLoadingPdf(false);
        }
    }

    useEffect(() => {
        if (dictamenSelected) {
            generatePdfPreview();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dictamenSelected]);

    const handleSetEditedContent = useCallback((value) => {
        const entries = Object.entries(value);
        const [key, val] = entries.length > 0 ? entries[0] : [null, null];
        setEditedContent(prev => ({
            ...prev,
            [key]: val,
        }));
    }, []);

    const renderHtmlContent = useCallback((fieldName) => {
        return <TinyMCEEditor
            fieldName={fieldName}
            originalContent={dictamenOriginal[fieldName]}
            setEditedContent={handleSetEditedContent}
        />
    }, [handleSetEditedContent, dictamenOriginal]);


    const normalizeHtmlFont = (html) => {
        if (!html) return '';
        
        let normalized = html
            .replace(/font-family\s*:\s*[^;"}]+;?/gi, '')
            .replace(/font-size\s*:\s*[^;"}]+;?/gi, '');
        
        normalized = normalized.replace(/style\s*=\s*["']\s*["']/gi, '');
        
        normalized = normalized.replace(/style\s*=\s*["'][\s;]*["']/gi, '');
        
        return `<span style="font-family: Arial, sans-serif; font-size: 9px;"><p>${normalized}</span>`;
    };

    const mapValuesInContent = () => {
        const fields = ['resultando', 'considerando', 'resolutivos'];
        const mappedContent = {};

        fields.forEach(fieldName => {
            const content = editedContent[fieldName] || dictamenOriginal[fieldName] || '';
            mappedContent[fieldName] = normalizeHtmlFont(content);
        });
        
        return mappedContent;
    }
    
    const handlePrevisualizar = async () => {
        if (!dictamenSelected) {
            return;
        }

        setLoadingPdf(true);
        try {
            // Mapear los valores editados en el contenido
            const mappedContent = mapValuesInContent();

            const payload = {
                id: Number(dictamenSelected),
                resultando: mappedContent.resultando,
                considerando: mappedContent.considerando,
                resolutivos: mappedContent.resolutivos
            };

            const response = await fetch(`${API_URL_PREVIEW_PDF}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error('Error al previsualizar el PDF');
            }

            const blob = await response.blob();
            setPdfPreviewUrl(blob);
            setIsPreviewModalOpen(true);
        } catch (error) {
            console.error('Error al previsualizar el PDF:', error);
            alert('Error al previsualizar el PDF. Por favor, intenta nuevamente.');
        } finally {
            setLoadingPdf(false);
        }
    }

    const closePreviewModal = () => {
        setIsPreviewModalOpen(false);
        setPdfPreviewUrl(null);
    }

    const handleAplicarCambios = async () => {
        if (!dictamenSelected || !dictamenSelected) {
            setError(true);
            return;
        }

        setIsUpdating(true);
        setError(false);
        setSuccess(false);

        try {
            const mappedContent = mapValuesInContent();

            const payload = {
                id: Number(dictamenSelected),
                resultando: mappedContent.resultando,
                considerando: mappedContent.considerando,
                resolutivos: mappedContent.resolutivos
            };

            const token = localStorage.getItem("accessToken");
            const response = await fetch(API_URL_UPDATE_SECTIONS, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar las secciones');
            }

            setSuccess(true);
            setDictamenOriginal({
                resultando: mappedContent.resultando,
                considerando: mappedContent.considerando,
                resolutivos: mappedContent.resolutivos
            });
            setEditedContent({});
            
            await generatePdfPreview();
        } catch (err) {
            console.error('Error al aplicar cambios:', err);
            setError(true);
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.container_aside}>
                <div className={styles.aside}>
                    <h3 className={styles.instructionsTitle}>INSTRUCCIONES</h3>
                    <ul className={styles.instructionsList}>
                        <li>Puede editarse dos clases de dictamenes:
                            <ul>
                                <li>Dictamen de Comision Dictaminadora</li>
                                <li>Dictamen de inconformidad de Comision de Ingresos</li>
                            </ul>
                        </li>
                    </ul>
                    <div className={styles.instructionsText}>
                        <p>
                            Algunos campos de las formas ya contienen texto preestablecido, y en otras se podrá agregar texto Libremente.
                        </p>
                        <p>
                            Los Dictamenes incluyen los nombres de los integrantes de la comisión y la fecha, se generan en PDF y quedan almacenados en la computadora local. La edición solo está permitida antes de cerrar la convocatoria.
                        </p>
                    </div>
                </div>


                <div className={styles.mainContent}>
                    <div className={styles.headerViewer}>
                        <h3 className={styles.panelTitle}>Visualizador de archivo</h3>

                        <h3 className={styles.panelTitle}>Edicion</h3>
                    </div>

                    <div className={styles.viewerPanel}>
                        <div className={styles.buttonContainer}>
                            <select className={styles.selectDictamen} onChange={handleSelectDictamen} defaultValue="">
                                <option value="" disabled>Selecciona un dictamen</option>
                                {dictamenesNames && Array.isArray(dictamenesNames) && dictamenesNames.map((dictamen) => (
                                    <option key={dictamen.id} value={dictamen.id}>
                                        {dictamen.nombre}
                                    </option>
                                ))}
                            </select>
                            <div className={styles.zoomControls}>
                                <button
                                    type="button"
                                    className={styles.btnPurple}
                                    onClick={handleZoomIn}
                                    disabled={pdfZoom >= 3}
                                >
                                    Zoom +
                                </button>
                                <button
                                    type="button"
                                    className={styles.btnPink}
                                    onClick={handleZoomOut}
                                    disabled={pdfZoom <= 0.5}
                                >
                                    Zoom -
                                </button>
                            </div>
                        </div>
                        <div className={styles.viewerContent}>
                            {loadingPdf ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <p>Cargando documento...</p>
                                </div>
                            ) : pdfBlob ? (
                                <ViewerPDF urlPdf={pdfBlob} scale={pdfZoom} />
                            ) : dictamenSelected ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#666' }}>
                                    <p>No se pudo cargar el documento. Intenta nuevamente.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#666' }}>
                                    <p>Selecciona un dictamen para visualizar el documento</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {
                        !dictamen ? (
                            <div className={styles.editorPanel}>
                                <div className={styles.editorContent}>
                                    <p className={styles.emptyMessage}>Selecciona un dictamen para iniciar la edicion.</p>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.editorPanel}>
                                <div className={styles.editorContent}>
                                    <label className={styles.label} style={{ fontWeight: 500, marginBottom: 8, fontSize: "1rem" }}>
                                        Selecciona qué deseas modificar
                                    </label>
                                    <div
                                        className={styles.editorContent_inputs}
                                    >
                                        <div className={styles.editorContent_inputs_item}>
                                            <label
                                                htmlFor="resultando"
                                                className={styles.label_styles}
                                            >
                                                Resultando
                                            </label>
                                            <div
                                                className={styles.htmlEditorContainer}
                                            >
                                                {renderHtmlContent("resultando")}
                                            </div>
                                        </div>
                                        <div className={styles.editorContent_inputs_item}>
                                            <label
                                                htmlFor="considerando"
                                                className={styles.label_styles}
                                            >
                                                Considerando
                                            </label>
                                            <div
                                                className={styles.htmlEditorContainer}
                                            >
                                                {renderHtmlContent("considerando")}
                                            </div>
                                        </div>
                                        <div className={styles.editorContent_inputs_item}>
                                            <label
                                                htmlFor="resolutivos"
                                                className={styles.label_styles}
                                            >
                                                Resolutivos
                                            </label>
                                            <div
                                                className={styles.htmlEditorContainer}
                                            >
                                                {renderHtmlContent("resolutivos")}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.actionButtons}>
                                        <button
                                            type="button"
                                            className={styles.btnBlue}
                                            onClick={handlePrevisualizar}
                                            disabled={loadingPdf || !dictamenSelected || !dictamenSelected}
                                        >
                                            {loadingPdf ? 'Generando...' : 'Previsualizar'}
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.btnGray}
                                            onClick={handleAplicarCambios}
                                            disabled={isUpdating || !dictamenSelected || !dictamenSelected}
                                        >
                                            {isUpdating ? 'Guardando...' : 'Aplicar cambios'}
                                        </button>
                                    </div>

                                    {error && (
                                        <div style={{ color: "#d32f2f", fontSize: "0.95rem", marginBottom: 10 }}>
                                            Error al aplicar los cambios. Por favor, intenta nuevamente.
                                        </div>
                                    )}

                                    {success && (
                                        <div style={{ color: "#32ba7c", fontSize: "0.95rem", marginBottom: 10 }}>
                                            Cambios aplicados correctamente.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            <Modal
                isOpen={isPreviewModalOpen}
                onClose={closePreviewModal}
                title="Vista Previa del Dictamen"
                width="90%"
                withFooter={false}
            >
                {pdfPreviewUrl && <ViewerPDF urlPdf={pdfPreviewUrl} />}
            </Modal>
        </div>
    );
}

export default EdiciónDictamenes