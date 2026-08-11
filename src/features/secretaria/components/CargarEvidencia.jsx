import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faUpload, faWarning } from "@fortawesome/free-solid-svg-icons";

import styles from "./styles/CargarEvidencia.module.css";
import axios from "axios";
import { cambiarNombreArchivo } from "../../../utils";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const REMPLAZAR_INCONFOMRIDAD = `${API_BASE_URL}/api/v1/cotejo-documentos/reemplazar`;

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
const CargarEvidencia = ({ tipoUpload, idExpediente, idArchivo, idSolicitud, onUploadSuccess, setResponsePDF }) => {

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

  const validarArchivo = (archivo) => {
    if (!archivo) return true;

    // Validar tipo de archivo
    if (!archivo.type.includes("pdf")) {
      return "Solo se permiten archivos PDF";
    }

    // Validar tamaño (2MB máximo)
    const tamañoMaximo = 2 * 1024 * 1024;
    if (archivo.size > tamañoMaximo) {
      return "El archivo no debe superar los 2MB";
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
      

      const fileName = file.name;
      const uniqueName = Math.floor(Math.random() * 999999);
      const nombreArchivo = cambiarNombreArchivo(fileName, uniqueName);

      const formData = new FormData();
      formData.append("id", Number(idArchivo));
      formData.append("archivo", file, nombreArchivo);

      const token = localStorage.getItem('accessToken');
      const response = await axios.post(REMPLAZAR_INCONFOMRIDAD, formData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.status === 200) {
        setIsSuccess(true);
        onUploadSuccess();
        setResponsePDF(response)
      }
      reset();
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setIsSuccess(false);
    } 
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validacionResultado = validarArchivo(file);
      if (validacionResultado !== true) {
        setError("archivo", { type: "validation", message: validacionResultado });
        alert("Error al subir archivo, asegurate que sea un formato PDF");
      } else {
        clearErrors("archivo");
        handleCargarEvidencia(file);
      }
    }
  };

  return (
    <form className={styles.formCargarEvidencia}>
      <div className={styles.containerInput}>
        
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
            <FontAwesomeIcon icon={faUpload} color={"purple"} size="xl" cursor={"pointer"} />
          </>
        
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

export default CargarEvidencia;
