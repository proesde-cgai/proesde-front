import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faPlus, faWarning } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../reutilizable/Loading";
import { cambiarNombreArchivo } from "../../../../utils/index";
import { subirRequisitosExpediente } from "../services/requisitosExpedienteService";
import { subirDocCriterioExpediente } from "../services/criteriosExpedienteService";
import styles from "./styles/CargarEvidencia.module.css";
import { useFileStore } from "../../../../store/useFileStore";

/**
 * Componente CargarEvidencia para subir un documento ya sea de requisitos o criterios.
 *
 * @param {Object} props - Props del componente.
 * @param {'criterio' | 'requisito'} props.tipoUpload - Tipo de accion (subir) que hara el componente
 * @param {Number} props.idExpediente - Id del criterio || requisito que se subira su respectivo documento
 * @param {Number} props.idSolicitud - Id de la solicitud del academico
 *
 * @returns {JSX.Element} Formulario para subir un documento.
 */
const AgregaEvidencia = ({ tipoUpload, idExpediente, idSolicitud, onUploadSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        reset,
        clearErrors,
        setError,
        control,
        formState: { errors },
    } = useForm();
    const archivo = useWatch({ control, name: "archivo" });

    useEffect(() => {
        const timer = setTimeout(() => { setIsSuccess(false); }, 3000);
        return () => clearTimeout(timer);
    }, [isSuccess]);

    const validarArchivo = async (archivo) => {
        const { validateFileSize, fetchMaxUploadSize } = useFileStore.getState();

        if (!archivo) return true;

        // Validar tipo de archivo
        if (!archivo.type.includes("pdf")) {
            return "Solo se permiten archivos PDF";
        }
        await fetchMaxUploadSize();
        const isFileSizeValid = validateFileSize(archivo);
        if (!isFileSizeValid) {
            alert(`El archivo excede el tamaño máximo permitido de ${useFileStore.getState().maxUploadSizeMB.toFixed(2)} MB`)
            return `El archivo excede el tamaño máximo permitido de ${useFileStore.getState().maxUploadSizeMB} MB`;
        }

        return true;
    };


    const handleCargarEvidencia = async (file) => {
        clearErrors();
        setIsSuccess(false);

        if (!file) {
            setError("archivo", {
                type: "required",
                message: "Debes seleccionar un archivo",
            });
            return;
        }

        try {
            setLoading(true);

            const fileName = file.name;
            const uniqueName = Math.floor(Math.random() * 999999);
            const nombreArchivo = cambiarNombreArchivo(fileName, uniqueName);

            const formData = new FormData();
            formData.append("idSolicitud", Number(idSolicitud));
            formData.append("idExpediente", Number(idExpediente));
            formData.append("archivo", file, nombreArchivo);

            const uploadPromise =
                tipoUpload === "requisito" ? subirRequisitosExpediente(formData) : subirDocCriterioExpediente(formData);

            const response = await uploadPromise;
            if (response.status === 200) {
                setIsSuccess(true);
                onUploadSuccess();
            }
            reset();
        } catch (error) {
            console.error("Error al subir el archivo:", error);
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const validacionResultado = await validarArchivo(file);
            if (validacionResultado !== true) {
                setError("archivo", { type: "validation", message: validacionResultado });
            } else {
                clearErrors("archivo");
                handleCargarEvidencia(file);
            }
        }
    };

    return (
        <form className={styles.formCargarEvidencia}>
            <div className={styles.containerInput}>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <input
                            type="file"
                            accept="application/pdf"
                            className={styles.inputFile}
                            {...register("archivo", {
                                onChange: handleFileChange,
                                validate: {
                                    required: (value) => value?.length > 0 || "Seleccione un archivo",
                                    validarTipo: (value) => (value?.[0] ? validarArchivo(value[0]) : true),
                                },
                            })}
                        />
                        <FontAwesomeIcon icon={faPlus} color="green" size="xl" cursor={"pointer"} />
                    </>
                )}
            </div>

            {errors.archivo && (
                <FontAwesomeIcon icon={faWarning} color={"red"} size="2x" cursor={"pointer"} title={errors.archivo.message} />
            )}

            {isSuccess && (
                <FontAwesomeIcon icon={faCheckCircle} color="green" size="2x" title="Documento guardado exitosamente" />
            )}
        </form>
    );
};

export default AgregaEvidencia;
