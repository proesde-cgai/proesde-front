import React, { useEffect, useMemo, useState } from 'react';
import { useEvaluationStore } from '../../../../../store/useEvaluationStore';
import { datosInconformidad } from '../services/InconformidadService';

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import axios from 'axios';
import Alert from '../../../../../reutilizable/Alert';
import TablaResultadosEvaluacion from '../../../../evaluacion/components/TablaResultadosEvaluacion';
import { datosEvaluacion } from '../services/evaluacionService';
import styles from '../styles/VisualizacionAsignacionNivel.module.css';

const VisualizacionAsignacionNivel = () => {
  const { selectedDataAcademico } = useEvaluationStore();

  const [cotejoStatus, setCotejoStatus] = useState(null);
  const [resultadosEvaluacion, setResultadosEvaluacion] = useState([]);
  const [arbolCriterios, setArbolCriterios] = useState([]);
  const [miembros, setMiembros] = useState([]);
  const [puntaje, setPuntaje] = useState({});
  const [resultadosInconformidad, setResultadosInconformidad] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const [errorInconformidad, setErrorInconformidad] = useState("")
  const [nivel, setNivel] = useState(0);
  const [nivelInconformidad, setNivelInconformidad] = useState(0);
  const [isParticipante, setIsParticipante] = useState(false);

  useEffect(() => {
    const fetchCotejoStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/cotejo-documentos/status?idSolicitud=${selectedDataAcademico?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al consultar el estado de cotejo");
        }
        const data = await response.json();
        setCotejoStatus(data);
      } catch (err) {
        console.error("Error fetching Cotejo status:", err);
      }
    };

    fetchCotejoStatus();
  }, [selectedDataAcademico?.id]);

  useEffect(() => {
    const fetchStatusParticipacion = async () => {
      if (!selectedDataAcademico?.codigo) return;
      
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/evaluacion/status-participacion?codigo=${selectedDataAcademico?.codigo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'text',
          }
        );

        const data = response.data;
        if (data === "PARTICIPANTE") {
          setIsParticipante(true);
        } else {
          setIsParticipante(false);
          setError('No se encontró la evaluación de dictaminador del Usuario');
        }
      } catch (err) {
        console.error("Error fetching status participacion:", err);
        setIsParticipante(false);
      }
    };

    fetchStatusParticipacion();
  }, [selectedDataAcademico?.codigo]);

  useEffect(() => {
    if (!selectedDataAcademico?.id) return;

    setLoading(true);
    setError('')
    datosEvaluacion(selectedDataAcademico.id)
      .then(data => {
        setMiembros(data.miembros);
        setArbolCriterios(data.arbolCriterios);
        setResultadosEvaluacion(data.tablaResultados);
        setPuntaje(data.puntaje);
        setNivel(data.nivelPrimerEvaluacion);
      })
      .catch(
        error => setError("No se encontró la evaluación de dictaminador del Usuario"),
        setResultadosEvaluacion(null)
      )
      .finally(() => setLoading(false));
  }, [selectedDataAcademico]);

  const isInconformidad = useMemo(() => {
    // Tabla de Comisión Ingreso solo se muestra desde status 14 (COM_ING_EVALUA_INCONF) en adelante
    // No se muestra en status 13 (COM_ING_SAVE_REQ_INCONF) porque aún no ha evaluado
    const validStatusInconformidad = [14, 15, 16];

    return validStatusInconformidad.includes(cotejoStatus);
  }, [cotejoStatus]);

  const getInconformidad = useCallback(async () => {
    setLoading(true);
    try {
      const response = await datosInconformidad(selectedDataAcademico?.id);
      setErrorInconformidad(null);
      setResultadosInconformidad(response.tablaResultados);
      setNivelInconformidad(response.nivelPrimerEvaluacion);
    } catch (error) {
      setErrorInconformidad("No se encontró la evaluación de Inconformidad del Usuario");
    }
  }, [selectedDataAcademico?.id]);

  useEffect(() => {
    if (!isInconformidad) return setErrorInconformidad("No se encontró la evaluación de Inconformidad del Usuario");
    getInconformidad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInconformidad, selectedDataAcademico?.id]);

  if (loading) {
    return <div className={styles.textCenter}><p>Cargando...</p></div>;
  }
  
  return (
    <div className={styles.restForm}>

      {error && <Alert typeAlert='error'>{error}</Alert>}
      {(isParticipante && resultadosEvaluacion) && (
        <div className={styles.submit}>
          <div className={styles.tableTitleContainer}>
            <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /><h3 className={styles.tableTitle}>Comisión Dictaminadora</h3>
          </div>
          <TablaResultadosEvaluacion
            resultados={resultadosEvaluacion}
            nivel={nivel || 0}
          />
        </div>
      )}
      {
        errorInconformidad || !isInconformidad ? (
          <Alert typeAlert='error'>
            <p>{errorInconformidad}</p>
          </Alert>
        )
          : (
            isInconformidad && (
              <div className={styles.submit}>
                <div className={styles.tableTitleContainer}>
                  <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /><h3 className={styles.tableTitle}>Comisión Ingreso</h3>
                </div>
                  <TablaResultadosEvaluacion resultados={resultadosInconformidad} nivel={nivelInconformidad || 0} />
              </div>
            )
          )
      }

    </div>
  );
};

export default VisualizacionAsignacionNivel;
