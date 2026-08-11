import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/CotejoInconformidad.module.css";
import Modal from "../../../../../reutilizable/Modal";
import ViewerPDF from "../../../../../reutilizable/ViewerPDF";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useEvaluationStore } from "../../../../../store/useEvaluationStore";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ERROR_MESSAGES_GENERICS_API } from "../../../../../utils/messagesFromAPI";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import { useInconformidadStore } from "../../../../../store/useInconformidadStore";
import Table from "../../../../../reutilizable/Table";
import CargarEvidencia from "../../../components/CargarEvidencia";
import Alert from "../../../../../reutilizable/Alert";
import { fetchStatus } from "../hooks/useFetchStatus";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Concatenar el contexto y el servicio/recurso
const API_URL_CRITERIOS = `${API_BASE_URL}/api/v1/cotejo-documentos/inconformidad?idSolicitud=`;
const API_SEND_COMENTARIO = `${API_BASE_URL}/api/v1/cotejo-documentos/agregar-comentario-inc`;
const API_GET_COMENTARIOS = `${API_BASE_URL}/api/v1/cotejo-documentos/comentarios-cotejo-inc?idSolicitud=`;
const API_POST_check_INCONFORMIDAD = `${API_BASE_URL}/api/v1/cotejo-documentos/change-cotejado`;
const API_POST_ENVIAR_COTEJO = `${API_BASE_URL}/api/v1/cotejo-documentos/enviar-cotejo-inc`;
const GET_STATUS = `${API_BASE_URL}/api/v1/cotejo-documentos/status?idSolicitud=`;
const REMPLAZAR_INCONFOMRIDAD = `${API_BASE_URL}/api/v1/cotejo-documentos/reemplazar-inconformidad`;

const CotejosInconformidad = () => {
  const { datosInconformidad, fetchDatosInconformidad, isLoading } = useInconformidadStore();
  const { selectedDataAcademico, idSolicitud } = useEvaluationStore();
  const [criterios, setCriterios] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [sendOk, setSendOk] = useState(false);
  const [checked, setCheked] = useState(false);
  const [urlPDF, setUrlPDF] = useState(null);
  const [status, setStatus] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [responsePDF, setResponsePDF] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState({
    type: null,
    mensaje: null,
  });

  const VALIDATION = {
    comentario: {
      required: "Debe escribir un comentario",
      minLength: { value: 5, message: "El mensaje debe tener al menos 5 caracteres" },
      maxLength: { value: 500, message: "El mensaje no puede superar los 500 caracteres" },
    },
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      comentario: "",
    },
  });

  let cabecerasTable = [
    { id: 2, labelCabecera: "Criterio" },
    { id: 3, labelCabecera: "Ver Evidencia" },
    { id: 5, labelCabecera: "Reemplazar Evidencia" },
    { id: 4, labelCabecera: "Inconformidad" },
  ];

  if (status !== 3) cabecerasTable = cabecerasTable.filter((cabecera) => cabecera.id !== 5);

  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        const data = await fetchStatus(selectedDataAcademico.id);
        setStatus(data);
      } catch (error) {
        console.error("Error fetching initial status: ", error);
      }
    };

    fetchInitialStatus();
  }, [selectedDataAcademico]);

  /*Inconformidad API */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(`${API_URL_CRITERIOS}${selectedDataAcademico.id}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Response data:", response.data);
        setCriterios(response.data);
        setCheked(response.data[0].archivos[0].cotejado);
        setSelectedFile(response.data[0].archivos);
      })
      .catch((error) => console.error("Error fetching criterios: ", error));
  }, [selectedDataAcademico, responsePDF, checked]);

  /*GET comentarios */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get(`${API_GET_COMENTARIOS}${idSolicitud}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setComentarios(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener comentarios: ", error);
        if (error.response) {
          const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
          setMensajeAlerta({
            type: "error",
            mensaje: message,
          });
        }
      });
  }, [sendOk, idSolicitud]);

  /*Submit comentarios */
  const handleSubmitComentario = async (data) => {
    const body = { ...data, idSolicitud };

    const token = localStorage.getItem("accessToken");
    axios
      .post(API_SEND_COMENTARIO, body, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setIsVisible(!isVisible);
        setMensajeAlerta({
          type: "success",
          mensaje: "Comentario agregado correctamente",
        });
        setSendOk(!sendOk);
        reset();
      })
      .catch((error) => {
        console.error("Error al agregar comentario: ", error);
        const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
        setMensajeAlerta({
          type: "error",
          mensaje: message,
        });
      })
      .finally(() => {
        setTimeout(() => {
          setMensajeAlerta({
            type: null,
            mensaje: null,
          });
        }, 3000);
      });
  };

  /*change check */
  const handleChange = (e) => {
    const isChecked = e.target.checked;
    const value = isChecked ? e.target.value : "";

    console.log("Check value:", isChecked);
    const body = {
      ids: [selectedFile[0].id],
      cotejado: isChecked,
    };
    const token = localStorage.getItem("accessToken");

    axios
      .post(`${API_POST_check_INCONFORMIDAD}`, body, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setIsVisible(!isVisible);
        setMensajeAlerta({
          type: "success",
          mensaje: "Cotejo realizado exitosamente",
        });
        setSendOk(!sendOk);
        reset();
        console.log("checked ", checked);
        setCheked(!checked);
      })
      .catch((error) => {
        console.error("Error al cotejar: ", error);
        const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
        setMensajeAlerta({
          type: "error",
          mensaje: message,
        });
      })
      .finally(() => {
        setTimeout(() => {
          setMensajeAlerta({
            type: null,
            mensaje: null,
          });
        }, 3000);
      });
  };

  /**Cotejar */
  const handleCotejar = async () => {
    const body = {
      idSolicitud,
      form_data: "",
      archivo: "",
    };

    const token = localStorage.getItem("accessToken");
    const headers = {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(API_POST_ENVIAR_COTEJO, body, { headers });

      const statusData = await fetchStatus(selectedDataAcademico.id);
      setStatus(statusData);

      setMensajeAlerta({
        type: "success",
        mensaje: "Cotejo enviado exitosamente",
      });

      setIsVisible(true);
      setSendOk((prev) => !prev);
    } catch (error) {
      console.error("Error al enviar cotejo: ", error);

      const message = ERROR_MESSAGES_GENERICS_API[error.response?.status] || ERROR_MESSAGES_GENERICS_API.default;
      setMensajeAlerta({
        type: "error",
        mensaje: message,
      });

      setIsVisible(true);
    } finally {
      setTimeout(() => {
        setMensajeAlerta({
          type: null,
          mensaje: null,
        });
        setIsVisible(false);
      }, 3000);
    }
  };

  /**Cambiar pdf */

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

  // console.log("Selected file: ", selectedFile)
  console.log("Status : ", status);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} width="750px">
        <ViewerPDF urlPdf={urlPDF} />
      </Modal>
      <p className={styles.tituloNotas}>
        <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> {""}
        Cotejos de Inconformidad
      </p>
      <Table cabecerasTable={cabecerasTable}>
        {criterios?.length ? (
          criterios?.map((requisito) => {
            console.log(requisito);

            return (
              <tr key={requisito.id}>
                <td>
                  <label htmlFor={requisito.id} className={styles.label}>
                    {requisito.nombre}
                  </label>
                </td>
                <td className={styles.tdTablaCotejoRequisitos}>
                  <div className={styles.containerBtnPDF}>
                    {requisito.archivos?.[0]?.nodo ? (
                      <button
                        type="button"
                        className={styles.buttonPdf}
                        title="Ver PDF"
                        onClick={() => {
                          openModal();
                          setUrlPDF(requisito?.archivos[0]?.nodo || "");
                        }}
                      >
                        <FontAwesomeIcon icon={faFilePdf} color="green" />
                      </button>
                    ) : (
                      "No se ha subido evidencia"
                    )}
                  </div>
                </td>

                {status === 3 ? (
                  <td>
                    <>
                      <CargarEvidencia
                        idExpediente={requisito.id}
                        idArchivo={selectedFile[0].id}
                        idSolicitud={idSolicitud}
                        tipoUpload="requisito"
                        onUploadSuccess={() => console.log()}
                        setResponsePDF={setResponsePDF}
                      />
                    </>
                  </td>
                ) : (
                  <></>
                )}

                <td className={styles.tdCheckCotejo}>
                  {![3, 9, 10].includes(status) ? (
                    <input
                      type="checkbox"
                      className="checkbox_green"
                      value={requisito.id}
                      disabled={true}
                      checked={requisito?.archivos?.[0]?.cotejado || false}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      className="checkbox_green"
                      onChange={handleChange}
                      value={requisito.id}
                      checked={checked}
                    />
                  )}
                </td>
              </tr>
            );
          })
        ) : (
          <></>
        )}
      </Table>
      <p className={styles.tituloNotas}>
        <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> {""}
        Comentarios
      </p>
      {!comentarios.length <= 0 ? (
        <div className={styles.containerEntradas}>
          {comentarios?.map((comentario) => (
            <div key={comentario.id} className={styles.containerEntradaComentario}>
              <p>
                <span>
                  [{comentario.fechaFormato} - {comentario.usuario}]
                </span>
                <p className={styles.spliText}>{comentario.comentario}</p>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
      {/**Comentarios */}
      <form action="" onSubmit={handleSubmit(handleSubmitComentario)}>
        <div className={styles.containerAgregarEntrada}>
          <div className={styles.containerTextareaEntrada}>
            <p>Agregar comentario</p>
            <textarea
              title="Maximo 500 caracteres"
              maxLength={500}
              rows={6}
              className={errors.comentario ?? `${styles.containerTextareaEntradaError} : ''`}
              {...register("comentario", VALIDATION.comentario)}
            ></textarea>
          </div>

          {errors.comentario && (
            <Alert typeAlert={"error"}>
              <p>{errors.comentario.message}</p>
            </Alert>
          )}

          {isVisible && (
            <Alert typeAlert={mensajeAlerta.type}>
              <p>{mensajeAlerta.mensaje}</p>
            </Alert>
          )}

          <div className={styles.buttonsTextareaEntrada}>
            {status === 4 || status >= 13 ? (
              <button className={styles.btnDisable} disabled={true}>
                Agregar Comentario
              </button>
            ) : (
              <button type="submit" className={styles.btnAgregarComentario}>
                Agregar Comentario
              </button>
            )}

            {status !== 10 && status !== 9 ? (
              <button type="button" className={styles.btnDisable} onClick={handleCotejar} disabled={true}>
                Enviar cotejo
              </button>
            ) : (
              <button type="button" className={styles.btnComentarioLeido} onClick={handleCotejar}>
                Enviar cotejo
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default CotejosInconformidad;
