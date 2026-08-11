// External libraries.
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Internal components.
import { datosEvaluacionLectura } from "../../inconformidad/services/evaluacionInconformidadService";
import TablaResultadosEvaluacion from "../../evaluacion/components/TablaResultadosEvaluacion";
import { ERROR_MESSAGES_GENERICS_API } from "../../../utils/messagesFromAPI";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import Loading from "../../../reutilizable/Loading";
import ProcesarCriterios from "./ProcesarCriterios";
import Alert from "../../../reutilizable/Alert";

// Styles.
import styles from "./styles/FormEvaluacionInconformidad.module.css";

const ALIAS_ACTIVIDAD = { inconformidad: "inconformidad", evaluacion: "evaluacion" };

const FormEvaluacionInconformidad = ({ setUltimoMiembro, aliasActividad }) => {
  const { idSolicitud, selectedDataAcademico} = useEvaluationStore();
  const [cotejoStatus, setCotejoStatus] = useState(null);
  const { register, watch } = useForm();

  const [resultadosEvaluacion, setResultadosEvaluacion] = useState();
  const [arbolCriterios, setArbolCriterios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [miembros, setMiembros] = useState([]);
  const [puntaje, setPuntaje] = useState({});
  const [mensaje, setMensaje] = useState({
    type: null,
    mensaje: null,
  });
  const [nivel, setNivel] = useState();

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [idSolicitud]);

   useEffect(() => {
      const fetchCotejoStatus = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await fetch( `${process.env.REACT_APP_API_BASE_URL}/api/v1/cotejo-documentos/status?idSolicitud=${selectedDataAcademico?.id}`, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } } );
          if (!response.ok) {
            throw new Error('Error al consultar el estado de cotejo');
          }
          const data = await response.json();
          setCotejoStatus(data);
        } catch (err) {
          console.error('Error fetching Cotejo status:', err);
        }
      };
  
      if (selectedDataAcademico?.id) {
        fetchCotejoStatus();
      }
    }, [selectedDataAcademico?.id]);

  const getData = async () => {
    setMensaje(null);
    const tipoParticipacion = aliasActividad || ALIAS_ACTIVIDAD.evaluacion;

    if (idSolicitud) {
      setIsLoading(true);

      await datosEvaluacionLectura(idSolicitud, tipoParticipacion)
        .then((data) => {
          setMiembros(data.miembros);
          setArbolCriterios(data.arbolCriterios);
          setResultadosEvaluacion(data.tablaResultados);
          setPuntaje(data.puntaje);
          setNivel(data.nivelPrimerEvaluacion);
          setUltimoMiembro(data.ultimoMiembro);
        })
        .catch((error) => {
          console.error("Error al obtener los datos de evaluación: ", error);
          if (error.response) {
            const message = "Este academico aún no ha sido evaluado.";
            setMensaje({
              mensaje: message,
              type: "error",
            });
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

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
    <>
      <div className={styles.formEvaluacion}>
        <ProcesarCriterios
          criterios={arbolCriterios}
          puntaje={puntaje}
          register={register}
          watch={watch}
          pdfDraw={true}
          typeRadio={0}
        />
      </div>

      <div className={styles.restForm}>
        <div className={styles.submit}>
          <TablaResultadosEvaluacion resultados={resultadosEvaluacion} nivel={nivel} />
        </div>
      </div>
    </>
  );
};

export default FormEvaluacionInconformidad;
