// Libraries.
import { useEffect, useState } from "react";

// Components.
import { datosEvaluacionLectura } from "../../inconformidad/services/evaluacionInconformidadService";
import { getStatusParticipacion } from "../../secretaria/secretariaAdminSems/GenerarDocInconformidad/services/participacionService";
import ProcesarCriterios from "./ProcesarCriterios";
import Loading from "../../../reutilizable/Loading";
import Alert from "../../../reutilizable/Alert";
import { useForm } from "react-hook-form";

// Styles.
import styles from "./styles/RubrosImpugnados.module.css";

// Datos.
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { useInconformidadStore } from "../../../store/useInconformidadStore";

const RubrosImpugnados = () => {
  const [mensaje, setMensaje] = useState({ type: null, mensaje: null });
  const [arbolCriterios, setArbolCriterios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [puntaje, setPuntaje] = useState({});
  const { register, watch } = useForm();
  const { selectedDataAcademico } = useEvaluationStore();
  const selectedIdSolicitud = selectedDataAcademico?.idSolicitud;
  const codigo = selectedDataAcademico?.codigo;
  const { datosInconformidad, fetchDatosInconformidad } = useInconformidadStore();
  const [cotejoStatus, setCotejoStatus] = useState(null);

  const getData = async () => {
    setMensaje(null);

    if (!selectedIdSolicitud || !codigo) return;

    setIsLoading(true);
    try {
      const statusParticipacion = await getStatusParticipacion(codigo);
      if (statusParticipacion !== "PARTICIPANTE") {
        setMensaje({ mensaje: "El académico no es participante, no cuenta con rubros de evaluación.", type: "error" });
        return;
      }

      await datosEvaluacionLectura(selectedIdSolicitud, "evaluacion")
        .then((data) => {
          setArbolCriterios(data.arbolCriterios);
          setPuntaje(data.puntaje);
        })
        .catch((error) => {
          if (error.response) {
            const message = "Este academico aún no ha sido evaluado.";
            setMensaje({ mensaje: message, type: "error" });
          }
        });
    } catch (error) {
      setMensaje({ mensaje: "Error al verificar el estado de participación.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCotejoStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/cotejo-documentos/status?idSolicitud=${selectedDataAcademico?.idSolicitud}`, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
      if (!response.ok) {
        throw new Error('Error al consultar el estado de cotejo');
      }
      const data = await response.json();
      setCotejoStatus(data);
    } catch (err) {
      console.error('Error fetching Cotejo status:', err);
    }
  };

  useEffect(() => {
    getData();
    fetchDatosInconformidad();
    fetchCotejoStatus();
    
    // eslint-disable-next-line
  }, [selectedDataAcademico]);

  const isReadOnly = Boolean(datosInconformidad?.razones ?? false);

  if (isLoading) return <Loading />;
  
  if (cotejoStatus === 10) {
    return (
      <Alert typeAlert='error'>
        <p>"No se cuenta con evaluación realizada por la comisión."</p>
      </Alert>
    );
  }

  if (mensaje) {
    return (
      <Alert typeAlert={mensaje.type}>
        <p>{mensaje.mensaje}</p>
      </Alert>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerCriterios}>
        <ProcesarCriterios criterios={arbolCriterios} puntaje={puntaje} register={register} watch={watch} pdfDraw={true} typeRadio={0} activeChecks={isReadOnly} />
      </div>
    </div>
  );
};

export default RubrosImpugnados;
