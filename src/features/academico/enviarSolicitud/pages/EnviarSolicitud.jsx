// External libraries.
import { useState } from "react";

// Internal libraries.
import Alert from "../../../../reutilizable/Alert";
import Loading from "../../../../reutilizable/Loading";
import { obtenerRequisitosExpediente } from "../../expediente/services/requisitosExpedienteService";
import { enviarSolicitud } from "./../services/Solicitud";

// Styles.
import { useDatosAcademico } from "../../store/useDatosAcademico";
import styles from "./EnviarSolicitud.module.css";

const EnviarSolicitud = () => {
  const [mensajeAlerta, setMensajeAlerta] = useState({ type: null, mensaje: null });
  const [errorSubmit, setErrorSubmit] = useState({ type: null, mensaje: null });
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  // const { idSolicitud } = useEvaluationStore();
  const { datosAcademico } = useDatosAcademico();
  const { idSolicitud } = datosAcademico;

  const handleSend = async () => {
    console.log("handleSend!");

    const body = { idSolicitud };
    console.log(body);

    setLoading(true);
    setErrorSubmit({ type: null, mensaje: null });

    // Refrescar los requisitos antes de enviar para sincronizar el estado con el backend
    // Esto asegura que el backend tenga el estado actualizado (ej: Plan de Trabajo aprobado)
    try {
      await obtenerRequisitosExpediente(idSolicitud);
      console.log("Requisitos refrescados antes de enviar");
    } catch (error) {
      console.warn("Error al refrescar requisitos (continuando con el envío):", error);
      // No bloqueamos el envío si falla el refresh, el backend validará de todas formas
    }

    await enviarSolicitud(body)
      .then((response) => {
        if (response.status === 200) {
          setIsVisible(!isVisible);
          setMensajeAlerta({
            type: "success",
            mensaje: "Solicitud enviada correctamente",
          });
        }

        window.location.reload();
      })
      .catch((error) => {
        console.error("Error al enviar solicitud: ", error);
        if (error.response) {
          if (error.response.status.toString() === "404") {
            const message = error.response?.data?.mensaje || 'Revisa tu información';
            setErrorSubmit({
              type: "error",
              mensaje: message,
            });
          } else {
            const message = error.response?.data?.mensaje || 'Revisa tu información';
            setErrorSubmit({
              type: "error",
              mensaje: message,
            });
          }

        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className={styles.solicitudContainer}>
        <h2 className={styles.titulo}>ENVIO DE SOLICITUD</h2>
        <p>
          Por favor revise que la información de su solicitud sea correcta antes de enviar, este proceso no puede
          deshacerse.
        </p>
      </div>
      <div className={styles.buttonContainer}>
        <button className={`${styles.btn} ${styles.enviar}`} onClick={handleSend}>
          Enviar solicitud
        </button>
      </div>
      <div>
        {loading && <Loading />}
        {isVisible && (
          <Alert typeAlert={mensajeAlerta.type}>
            <p>{mensajeAlerta.mensaje}</p>
          </Alert>
        )}
        {errorSubmit && (
          <Alert typeAlert={errorSubmit.type}>
            <p>{errorSubmit.mensaje}</p>
          </Alert>
        )}
      </div>
    </>
  );
};

export default EnviarSolicitud;
