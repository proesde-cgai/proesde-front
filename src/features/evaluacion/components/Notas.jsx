import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Alert from "../../../reutilizable/Alert";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { getComentarios, postComentario, putComentario } from "../services/notasService";
import { ERROR_MESSAGES_GENERICS_API } from "../../../utils/messagesFromAPI";
import styles from "./styles/Notas.module.css";
import Loading from "../../../reutilizable/Loading";

const Notas = () => {
  const { idSolicitud, isLoading, setIsLoading } = useEvaluationStore();
  const [loadComments, setLoadingComments, ] = useState(false);
  const [sendOk, setSendOk] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [mensajeAlerta, setMensajeAlerta] = useState({
    type: null,
    mensaje: null,
  });

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

  useEffect(() => {
    const fetchComentarios = async () => {
      setLoadingComments(true); 
      try {
        const response = await getComentarios(idSolicitud);
        setComentarios(response);
      } catch (error) {
        console.error("Error al obtener comentarios: ", error);
        if (error.response) {
          const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
          setMensajeAlerta({
            type: "error",
            mensaje: message,
          });
        }
      } finally {
        setLoadingComments(false); 
      }
    };
    fetchComentarios();
  }, [sendOk, idSolicitud]);

  const handleSubmitComentario = async (data) => {
    const body = { ...data, idSolicitud };
    await postComentario(body)
      .then((response) => {
        if (response.status === 200) {
          setIsVisible(!isVisible);
          setMensajeAlerta({
            type: "success",
            mensaje: "Comentario agregado correctamente",
          });
          setSendOk(!sendOk);
          reset();
        }
      })
      .catch((error) => {
        console.error("Error al agregar comentario: ", error);
        const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
        setMensajeAlerta({
          type: "error",
          mensaje: message,
        });
      });
  };

  const handleLeerNota = async () => {
    const body = { idSolicitud };
    await putComentario(body)
      .then((response) => {
        setIsVisible(!isVisible);
        setMensajeAlerta({
          type: "success",
          mensaje: response.mensaje,
        });
        setSendOk(!sendOk);
      })
      .catch((error) => {
        console.error("Error al leer la nota: ", error);
        const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
        setMensajeAlerta({
          type: "error",
          mensaje: message,
        });
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, [isVisible]);

  const VALIDATION = {
    comentario: {
      required: "Debe escribir un comentario",
      minLength: { value: 5, message: "El mensaje debe tener al menos 5 caracteres" },
      maxLength: { value: 500, message: "El mensaje no puede superar los 500 caracteres" }, 
    },
  };
  console.log(isLoading)
  if (isLoading || loadComments) return <Loading />;

  return (
    <div className={styles.containerNotas}>
      <p className={styles.tituloNotas}>
        <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> {""}
        Puede agregar tantas entradas como desee
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

      <form action="" onSubmit={handleSubmit(handleSubmitComentario)}>
        <div className={styles.containerAgregarEntrada}>
          <div className={styles.containerTextareaEntrada}>
            <p>Agregar entrada</p>
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
            <button type="submit" className={styles.btnAgregarComentario}>
              Agregar
            </button>
            <button type="button" className={styles.btnComentarioLeido} onClick={handleLeerNota}>
              Comentario leído
            </button>
            {/* <button type='button' className={styles.btnCancelar}>Cancelar</button> */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Notas;
