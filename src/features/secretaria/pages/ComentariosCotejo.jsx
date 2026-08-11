import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Alert from "../../../reutilizable/Alert";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import {
  enviarComentariosCotejo,
  obtenerStatusCotejo,
  agregrarComentarioCotejo,
  obtenerComentariosCotejo,
  regresarSolicitud,
} from "../services/comentariosCotejo";

import { ERROR_MESSAGES_GENERICS_API } from "../../../utils/messagesFromAPI";
import styles from "./styles/ComentariosCotejo.module.css";
import Loading from "../../../reutilizable/Loading";
import useCotejoStore from "../../../store/useCotejoStore";
import Modal from "../../../reutilizable/Modal";
import { useSearchStore } from "../../../store/useSearchStore";

const ComentariosCotejo = () => {
  const { requisitos, rubros, resetStore } = useCotejoStore();
  const { selectedDataAcademico, idSolicitud } = useEvaluationStore();
  const [comentarioEnviado, setComentarioEnviado] = useState(false);
  const [comentarios, setComentarios] = useState([""]);
  const SIN_COTEJAR = 0;
  const COTEJADA_CON_CORRECCION = 2;
  // null = aún cargando; 0 = SIN_COTEJAR; 1 = COTEJADA; 2 = SOLICITUD_GENERADA; etc.
  const [statusCotejo, setStatusCotejo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState({ type: null, mensaje: null });
  const [mensajeAlerta, setMensajeAlerta] = useState({
    type: null,
    mensaje: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmRegresarOpen, setIsConfirmRegresarOpen] = useState(false);

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);
  const openConfirmRegresar = () => setIsConfirmRegresarOpen(true);
  const closeConfirmRegresar = () => setIsConfirmRegresarOpen(false);

  useEffect(() => {
    obtenerComentariosCotejo(idSolicitud)
      .then((response) => {
        if (response.status === 200) setComentarios(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener comentarios de cotejo: ", error);
        if (error.response) {
          const message =
            ERROR_MESSAGES_GENERICS_API[error.response.status] ||
            ERROR_MESSAGES_GENERICS_API.default;
          setMensajeAlerta({
            type: "error",
            mensaje: message,
          });
        }
      });
  }, [idSolicitud, comentarioEnviado]);

  useEffect(() => {
    getStatus();
    // eslint-disable-next-line
  }, [idSolicitud]);

  const getStatus = async () => {
    obtenerStatusCotejo(idSolicitud)
      .then((response) => {
        if (response.status === 200) setStatusCotejo(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener status de cotejo: ", error);
      });
  };

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      comentario: "",
    },
  });

  // Limpiar formulario y errores cuando cambia la solicitud (o el usuario seleccionado)
  useEffect(() => {
    // Resetea el formulario y limpia errores para evitar que mensajes de validación previos queden pegados
    try {
      reset({ comentario: "" });
      if (typeof clearErrors === "function") clearErrors();
    } catch (e) {
      // no-operation
    }
    // limpiar mensajes de alerta previos
    setMensajeAlerta({ type: null, mensaje: null });
    setErrorSubmit({ type: null, mensaje: null });
    setIsVisible(false);
  }, [idSolicitud, clearErrors, reset]);

  const handleEnviarCorreo = async () => {
    const body = { idSolicitud };

    setLoading(true);
    await enviarComentariosCotejo(body)
      .then((response) => {
        if (response.status === 200) {
          setIsVisible(!isVisible);
          setMensajeAlerta({
            type: "success",
            mensaje: "Correo enviado correctamente",
          });
        }
        resetStore();
        reset();
        getStatus();
        closeModal();
      })
      .catch((error) => {
        console.error("Error al enviar correo de cotejo: ", error);
        if (error.response) {
          const message =
            ERROR_MESSAGES_GENERICS_API[error.response.status] ||
            ERROR_MESSAGES_GENERICS_API.default;
          setErrorSubmit({
            type: "error",
            mensaje: message,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  const handleSubmitComentario = async (data) => {
    const { comentario } = data;
    const body = { idSolicitud, comentario };
    await agregrarComentarioCotejo(body)
      .then((response) => {
        if (response.status === 200) {
          setIsVisible(!isVisible);
          setComentarioEnviado(!comentarioEnviado);
          setMensajeAlerta({
            type: "success",
            mensaje: "Comentario agregado correctamente",
          });
          reset();
        }
      })
      .catch((error) => {
        console.error("Error al agregar comentario: ", error);
        if (error.response) {
          setIsVisible(!isVisible);
          const message =
            ERROR_MESSAGES_GENERICS_API[error.response.status] ||
            ERROR_MESSAGES_GENERICS_API.default;
          setErrorSubmit({
            type: "error",
            mensaje: message,
          });
        }
      });
  };

  const handleRegresarSolicitud = async () => {
    // No permitir acción si ya fue cotejada con corrección
    if (statusCotejo === COTEJADA_CON_CORRECCION) return;

    setLoading(true);

    // Valores del status 7 (DEVUELTA_PARA_CORRECCION) según Constantes.java del backend
    const STATUS_DEVUELTA = 7;
    const DESC_STATUS_DEVUELTA = "Devuelta para corrección";

    try {
      const resp = await regresarSolicitud(idSolicitud);
      if (resp?.status >= 200 && resp?.status < 300) {
        const message =
          resp?.data?.message || "Solicitud regresada correctamente.";
        setMensajeAlerta({ type: "success", mensaje: message });

        // Refrescar statusCotejo local desde el backend
        await getStatus();

        // Sincronizar el academico seleccionado con el nuevo status
        const currentData = useEvaluationStore.getState().selectedDataAcademico;
        if (currentData) {
          useEvaluationStore.setState({
            selectedDataAcademico: {
              ...currentData,
              status: STATUS_DEVUELTA,
              statusDescripcion: DESC_STATUS_DEVUELTA,
            },
            status: STATUS_DEVUELTA,
          });
          // Sincronizar la lista del sidebar para mostrar el nuevo estatus
          useSearchStore.getState().updateAcademicoStatus(
            idSolicitud,
            STATUS_DEVUELTA,
            DESC_STATUS_DEVUELTA
          );
        }
      } else {
        setMensajeAlerta({
          type: "error",
          mensaje: `Respuesta inesperada del servidor: ${resp?.status}`,
        });
      }
    } catch (error) {
      console.error("Error al regresar solicitud:", error);
      console.error("Response completa:", error?.response);
      const statusCode = error?.response?.status;
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "No fue posible regresar la solicitud";
      const alertaMsg = statusCode
        ? `${statusCode} - ${String(serverMsg)}`
        : String(serverMsg);
      setMensajeAlerta({ type: "error", mensaje: alertaMsg });
    } finally {
      setIsVisible(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isVisible]);

  const VALIDATION = {
    comentario: {
      required: "Debe escribir un comentario",
      minLength: {
        value: 5,
        message: "El mensaje debe tener al menos 5 caracteres",
      },
      maxLength: {
        value: 500,
        message: "El mensaje no puede superar los 500 caracteres",
      },
    },
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        withFooter={false}
        title="ENVIAR COTEJO"
        width="400px"
      >
        <p>
          Esta acción no puede deshacerse, por favor verifique detalladamente
          antes de enviar a cotejo.
        </p>
        <br></br>
        <div className={styles.modalDiv}>
          <button
            type="button"
            onClick={handleEnviarCorreo}
            className={styles.btnEnviarCotejo}
          >
            Enviar Cotejo
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isConfirmRegresarOpen}
        onClose={closeConfirmRegresar}
        title="REGRESAR SOLICITUD"
        withFooter={false}
        width="400px"
      >
        <p className={styles.textConfirm}>
          ¿Estás seguro de que deseas regresar la solicitud?
        </p>
        <br />
        <div className={styles.modalDiv}>
          <button
            type="button"
            className={styles.btnEnviarCotejo}
            onClick={async () => {
              await handleRegresarSolicitud();
              closeConfirmRegresar();
            }}
            disabled={loading || statusCotejo === COTEJADA_CON_CORRECCION}
          >
            Confirmar
          </button>
        </div>
      </Modal>

      <div className={styles.containerNotas}>
        <p className={styles.tituloNotas}>
          <FontAwesomeIcon icon={faAngleRight} color={"yellow"} size="xl" />{" "}
          {""}
          {`Enviar cotejo del participante: 
          ${selectedDataAcademico.nombre} ${selectedDataAcademico.apellidoPaterno} ${selectedDataAcademico.apellidoMaterno}
        `}
        </p>

        {!comentarios.length <= 0 ? (
          <div className={styles.containerEntradas}>
            {comentarios?.map((comentario) => (
              <div
                key={comentario.id}
                className={styles.containerEntradaComentario}
              >
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

        <form onSubmit={handleSubmit(handleSubmitComentario)}>
          <div className={styles.containerAgregarEntrada}>
            <div className={styles.containerTextareaEntrada}>
              <p>Agregar comentarios de cotejo</p>
              <textarea
                title="Maximo 500 caracteres"
                rows={6}
                maxLength="499"
                className={
                  errors.comentario ??
                  `${styles.containerTextareaEntradaError} : ''`
                }
                {...register("comentario", VALIDATION.comentario)}
                disabled={statusCotejo === COTEJADA_CON_CORRECCION}
              ></textarea>
            </div>

            <div className={styles.buttonsTextareaEntrada}>
              <button
                type="submit"
                className={styles.btnAgregarComentario}
                // Deshabilitar si está cargando, si aún no llegó el status (null) o si ya fue cotejada con corrección
                disabled={loading || statusCotejo === null || statusCotejo === COTEJADA_CON_CORRECCION}
              >
                Agregar Comentario
              </button>
              <button
                type="button"
                onClick={openModal}
                className={styles.btnEnviarCotejo}
                // Solo habilitado cuando statusCotejo === 0 (SIN_COTEJAR)
                disabled={loading || statusCotejo === null || statusCotejo !== SIN_COTEJAR}
              >
                Enviar Cotejo
              </button>
              <button
                type="button"
                className={styles.btnRegresarSolicitud}
                onClick={openConfirmRegresar}
                // Solo habilitado cuando statusCotejo === 0 (SIN_COTEJAR)
                disabled={loading || statusCotejo === null || statusCotejo !== SIN_COTEJAR}
              >
                Regresar Solicitud
              </button>
            </div>

            <div>
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

              {errorSubmit && isVisible && (
                <Alert typeAlert={errorSubmit.type}>
                  <p>{errorSubmit.mensaje}</p>
                </Alert>
              )}

              {statusCotejo === COTEJADA_CON_CORRECCION && (
                <Alert typeAlert="warning">
                  <p>
                    {
                      "Esta solicitud ya ha sido cotejada y no se permiten enviar comentarios"
                    }
                  </p>
                </Alert>
              )}
            </div>
            {/* Spinner separado fuera del bloque de botones para no deformarlos */}
            {loading && (
              <div className={styles.loadingWrapper}>
                <Loading />
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ComentariosCotejo;
