import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import api from "../../../hooks/api";
import Alert from "../../../reutilizable/Alert";
import Loading from "../../../reutilizable/Loading";
import { useInconformidadStore } from "../../../store/useInconformidadStore";
import styles from "./styles/Inconformarse.module.css";
import Modal from "../../../reutilizable/Modal";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useFileStore } from "../../../store/useFileStore";
import { useImpugnacionStore } from "../../../store/useImpugnacionStore";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_DATOS_INCONFORMARSE = `${API_BASE_URL}/api/v1/evaluacion/datos-inconformarse`;
const API_URL_POST_INCONFORMARSE = `${API_BASE_URL}/api/v1/evaluacion/inconformarse`;

function parseDate(dateString) {
  if (!dateString) return null;
  const isYearFirst = /^\d{4}-\d{2}-\d{2}$/.test(dateString); // yyyy-MM-dd
  let year, month, day;
  if (isYearFirst) {
    [year, month, day] = dateString.split('-');
  } else {
    [day, month, year] = dateString.split('-');
  }
  return { year, month, day };
}

export const Inconformarse = ({ idSolicitud }) => {
  const { datosInconformidad, fetchDatosInconformidad, isLoading } = useInconformidadStore();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    recibida: "",
    fecha: "",
    area: "",
    documento: null,
    nombreDocumento: ""
  });
  const [isLoadingAcademico, setIsLoadingAcademico] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
    const { impugnados } = useImpugnacionStore();

  const [incoformarse, setInconformarse] = useState(true);
  const [message, setMesage] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0); // Key para forzar la recreación del input file

  useEffect(() => {
    const timer = setTimeout(() => { setIsVisible(false); }, 2000);
    return () => clearTimeout(timer);
  }, [isVisible]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => { setError(""); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const timer = setTimeout(() => { setInconformarse(true); }, 5000);
    return () => clearTimeout(timer);
  }, [incoformarse]);

  useEffect(() => {
    fetchDatosInconformidad();
    api.get(`${API_URL_DATOS_INCONFORMARSE}?codigo=${localStorage.getItem('userName' || '')}`)
      .then(response => {
        if (response.data.fechaRecibido && response.data.fechaInconformidad) {
          const recibidaParsed = parseDate(response.data.fechaRecibido);
          const inconformidadParsed = parseDate(response.data.fechaInconformidad);

          setFormData({
            recibida: `${recibidaParsed.year}-${recibidaParsed.month}-${recibidaParsed.day}` || "",
            fecha: `${inconformidadParsed.year}-${inconformidadParsed.month}-${inconformidadParsed.day}` || "",
            area: response.data.razones || "",
            documento: null,
            nombreDocumento: response.data.nombreArchivo,
          });
          if (response.data.nodo) {
            setPdfUrl(response.data.nodo);
          }
          setIsLoadingAcademico(false);
        } else {
          setFormData({
            recibida: "",
            fecha: "",
            area: response.data.razones || "",
            documento: null,
            nombreDocumento: "",
          });
        }
      })
      .catch(error => {
        setFormData({
          recibida: "",
          fecha: "",
          area: "",
          documento: null,
          nombreDocumento: ""
        });
        console.error("Error fetching data: ", error);
      });
    // eslint-disable-next-line
  }, [isVisible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const { validateFileSize, fetchMaxUploadSize } = useFileStore.getState();
    const file = e.target.files[0];
    if (!file) return;
    await fetchMaxUploadSize();
    const isFileSizeValid = validateFileSize(file);
    if (!isFileSizeValid) {
      alert(`El archivo excede el tamaño máximo permitido de ${useFileStore.getState().maxUploadSizeMB.toFixed(2)} MB.`);
      e.target.value = "";
      return;
    }
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    if (!allowedTypes.includes(file.type)) {
      alert("Solo se permiten archivos en formato PDF o DOCX.");
      e.target.value = "";
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      documento: e.target.files[0],
      nombreDocumento: e.target.files[0]?.name || ""
    }));
  };

  const validateFields = () => {
    let hasError = false;
    Object.keys(formData).forEach((key) => {
      if (key === "documento") return; // Skip validation for "documento"
      if (formData[key] === "" || formData[key] === null) {
        console.log("error en ", key);
        hasError = true;
      }
    });
    return hasError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.documento) {
      setError("Debes seleccionar un documento antes de enviar.");
      return;
    }

    const hasError = validateFields();
    if (hasError) {
      setError("Todos los campos son obligatorios.");
    } else {
      setError("");
      const [year, month, day] = formData.recibida.split('-');
      const [yearInc, monthInc, dayInc] = formData.fecha.split('-');

      const formDataPayload = new FormData();
      formDataPayload.append("idSolicitud", idSolicitud);
      formDataPayload.append("filedata", formData.documento);
      formDataPayload.append("fechaRecibido", `${day}-${month}-${year}`);
      formDataPayload.append("fechaInconformidad", `${dayInc}-${monthInc}-${yearInc}`);
      formDataPayload.append("razones", formData.area);
      formDataPayload.append("rubrosIDs", impugnados);

      const token = localStorage.getItem('accessToken');
      axios.post(API_URL_POST_INCONFORMARSE, formDataPayload, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response) => {
          setIsVisible(true);
        })
        .catch((error) => {
          setMesage(error.response.data)
          setInconformarse(false)
          console.error("Error uploading form ", error);
        });
    }
  };

  const handleReset = () => {
    setFormData((prevData) => ({
      ...prevData,
      area: "",
      documento: null,
      nombreDocumento: ""
    }));
    // Forzar la recreación del input file cambiando su key
    // Esto asegura que el input se resetee completamente y permita seleccionar el mismo archivo
    setFileInputKey((prev) => prev + 1);
  };

  useEffect(() => {
    console.log("IDs impugnados:", impugnados);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoadingAcademico) return <Loading />;
  if (isLoading) return <Loading />;

  const isReadOnly = datosInconformidad && datosInconformidad.razones;

  return (
    <>
      {datosInconformidad ? (
        <div className={styles.main}>
          <div>
            <p>{datosInconformidad.nombreAcademico}</p>
          </div>

          <div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.dateContainer}>
                <div className={styles.dateInput}>
                  <div className={styles.fecha_ley}>
                    <p htmlFor="recibida">Solicitud recibida en</p>
                  </div>
                  <input
                    id="recibida"
                    name="recibida"
                    type="date"
                    placeholder="Seleccione una fecha"
                    value={formData.recibida}
                    onChange={handleChange}
                    readOnly={true} // Solo lectura si ya hay razones
                  />
                </div>

                <div className={styles.dateInput}>
                  <div className={styles.fecha_ley}>
                    <p htmlFor="fecha">Fecha inconformidad</p>
                  </div>
                  <input
                    id="fecha"
                    name="fecha"
                    type="date"
                    placeholder="Seleccione una fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    readOnly={true} // Solo lectura si ya hay razones
                  />
                </div>
              </div>

              <br />
              <p htmlFor="razones">Razones de la inconformidad</p>
              <textarea
                title="Maximo 3927 caracteres"
                id="area"
                name="area"
                className={styles.txtArea}
                value={formData.area}
                onChange={handleChange}
                readOnly={isReadOnly} // Solo lectura si ya hay razones
                maxLength={3927}
              />

              <div className={styles.dateInput}>
                <p className={styles.info}>Documento que sustenta la inconformidad</p>
                <div className={styles.fileContainer}>
                  {!isReadOnly && (
                    <label 
                      className={styles.labelFile} 
                      htmlFor="documento"
                      onClick={() => {
                        // Resetear el input cuando el usuario hace clic en el label
                        // Esto permite seleccionar el mismo archivo nuevamente
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      Examinar
                    </label>
                  )}
                  <input
                    key={fileInputKey}
                    id="documento"
                    ref={fileInputRef}
                    className={styles.file}
                    type="file"
                    onChange={handleFileChange}
                    onClick={() => {
                      // Resetear el input cuando el usuario hace clic directamente en el input
                      // Esto permite seleccionar el mismo archivo nuevamente
                      if (fileInputRef.current && formData.documento) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    disabled={isReadOnly} // Deshabilitar si ya hay razones
                  />
                  <input
                    id="nombreDocumento"
                    name="nombreDocumento"
                    type="text"
                    value={formData.nombreDocumento}
                    readOnly
                  />

                  {datosInconformidad.nodo && (
                    <button
                      type="button"
                      className={styles.buttonPdf}
                      title="Ver PDF"
                      onClick={openModal}
                    >
                      <FontAwesomeIcon icon={faFilePdf} color="green" size="2xl" />
                    </button>
                  )}
                </div>
              </div>

              {/* Si no hay razones, se muestran los botones */}
              {!isReadOnly && (
                <div className={styles.agregar}>
                  <button type="button" className={styles.btn} onClick={handleReset}>
                    Limpiar solicitud
                  </button>
                  <button type="submit" className={styles.btn}>
                    Registrar inconformidad
                  </button>
                </div>
              )}
            </form>

            {!incoformarse && (
              <Alert typeAlert={"warning"}>
                <p>{message}</p>
              </Alert>
            )}

            {isReadOnly && (
              <Alert typeAlert={"success"}>
                <p>Tu inconformidad ha sido generada. No se pueden hacer más cambios.</p>
              </Alert>
            )}

            {isVisible && (
              <Alert typeAlert={"success"}>
                <p>Se ha guardado con éxito</p>
              </Alert>
            )}

            {error && <p className={styles.error}>{error}</p>}
          </div>
          <Modal isOpen={isModalOpen} onClose={closeModal} width="850px">
            <ViewerPDF urlPdf={pdfUrl} />
          </Modal>
        </div>
      ) : (
        <p>No hay información para mostrar</p>
      )}
    </>
  );
};
