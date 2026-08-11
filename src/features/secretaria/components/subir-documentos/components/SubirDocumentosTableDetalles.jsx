import React from "react";
import styles from "../styles/SubirDocumentosTableDetalles.module.css";
import { useSubirDocumentos } from "../hooks/useGenerateOficios";

const SubirDocumentosTableDetalles = ({
    currentItems,
    cicloDisponible,
    getSortIcon,
    handleSort,
}) => {
    const { guardarDocumento, eliminarArchivo, isLoading } = useSubirDocumentos();

    const handleGenerarOActualizarDocumento = async (documento) => {
        const formData = new FormData();
        formData.append("idSolicitud", currentItems?.id || "");
        formData.append("siglaDocumento", documento.siglaDocumento || "");
        formData.append("archivo", new Blob(["example file content"], { type: "text/plain" }));

        try {
            if (!documento.id) {
                await guardarDocumento(formData);
                alert("Documento generado exitosamente.");
            } else {
                await guardarDocumento(formData);
                alert("Documento actualizado exitosamente.");
            }
        } catch (error) {
            alert("Hubo un problema al procesar la solicitud.");
            console.error(error);
        }
    };

    const handleEliminarDocumento = async (documento) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            const payload = {
                idSolicitud: currentItems?.id || "",
                siglaDocumento: documento.siglaDocumento || "",
                idAsociado: documento.id || null,
            };
            await eliminarArchivo(payload);
            alert("Documento eliminado correctamente.");
        } catch (error) {
            console.error("Error al eliminar el documento:", error);
            alert("Hubo un problema al eliminar el documento. Por favor, inténtalo de nuevo.");
        }
    };

    if (!currentItems) {
        return (
            <div>
                <p className={styles.noDataMessage}>
                    Por favor, ingrese un código de docente para ver los documentos.
                </p>
            </div>
        );
    }

    if (!currentItems.documentos || currentItems.documentos.length === 0) {
        return (
            <div>
                <p className={styles.noDataMessage}>
                    No hay información disponible.
                </p>
            </div>
        );
    }

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th onClick={() => handleSort("codigo")}>CÓDIGO PROFESOR {getSortIcon("codigo")}</th>
                    <th onClick={() => handleSort("nombre")}>NOMBRE DOCENTE {getSortIcon("nombre")}</th>
                    <th>TIPO DE DOCUMENTO</th>
                    <th>CARGAR/ACTUALIZAR</th>
                    <th>ELIMINAR</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.documentos.map((doc, index) => (
                    <tr key={index}>
                        <td>{currentItems.codigo || ""}</td>
                        <td>{`${currentItems.nombre || ""} ${currentItems.apellido_paterno || ""} ${currentItems.apellido_materno || ""}`}</td>
                        <td>{doc.nombre || "Documento sin nombre"}</td>
                        <td>
                            <button
                                className={styles.button}
                                onClick={() => handleGenerarOActualizarDocumento(doc)}
                                disabled={isLoading}
                            >
                                {doc.id ? "Actualizar" : "Cargar"}
                            </button>
                        </td>
                        <td>
                            <button
                                className={styles.button}
                                onClick={() => handleEliminarDocumento(doc)}
                                disabled={isLoading || !cicloDisponible}
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SubirDocumentosTableDetalles;
