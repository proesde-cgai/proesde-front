import React, { useEffect, useState } from "react";
import axios from "axios";
import { TitlePage } from "../components/TitlePage";
import styles from "./styles/RespaldarHistorico.module.css";
import { getAccessToken } from "../../authService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_HISTORICOS_CONVOCATORIA = `${API_BASE_URL}/api/v1/historicos/convocatoria`;
const API_HISTORICOS_POR_CONVOCATORIA = `${API_BASE_URL}/api/v1/historicos`;
const API_HISTORICOS_ACTIVO = `${API_BASE_URL}/api/v1/parametro/historicos-activo`;
const API_HISTORICOS_BOTON_HABILITADO = `${API_BASE_URL}/api/v1/parametro/historicos-boton-habilitado`;

const RespaldarHistorico = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState("");
  const [loadingConvocatorias, setLoadingConvocatorias] = useState(true);
  const [historialRespaldos, setHistorialRespaldos] = useState([]);
  const [historicosActivo, setHistoricosActivo] = useState(false);
  const [botonHabilitado, setBotonHabilitado] = useState(false);

  useEffect(() => {
    const fetchConvocatorias = async () => {
      try {
        setLoadingConvocatorias(true);
        const token = await getAccessToken();
        const response = await axios.get(API_HISTORICOS_CONVOCATORIA, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const lista = Array.isArray(response.data) ? response.data : [];
        const ordenadasRecientePrimero = [...lista].sort(
          (a, b) => (b.id ?? 0) - (a.id ?? 0)
        );

        setConvocatorias(ordenadasRecientePrimero);

        if (ordenadasRecientePrimero.length > 0) {
          const primerId = ordenadasRecientePrimero[0].id;
          setConvocatoriaSeleccionada((prev) =>
            prev || (primerId != null ? String(primerId) : "")
          );
        }
      } catch (error) {
        console.error("Error al obtener históricos convocatoria:", error);
        setConvocatorias([]);
      } finally {
        setLoadingConvocatorias(false);
      }
    };

    fetchConvocatorias();
  }, []);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const token = await getAccessToken();
        const [activoRes, botonRes] = await Promise.all([
          axios.get(API_HISTORICOS_ACTIVO, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(API_HISTORICOS_BOTON_HABILITADO, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const activo = typeof activoRes.data === "boolean" ? activoRes.data : activoRes.data === "true";
        const boton = typeof botonRes.data === "boolean" ? botonRes.data : botonRes.data === "true";

        setHistoricosActivo(activo);
        setBotonHabilitado(boton);
      } catch (error) {
        console.error("Error al obtener parámetros de históricos:", error);
        setHistoricosActivo(false);
        setBotonHabilitado(false);
      }
    };

    fetchFlags();
  }, []);

  useEffect(() => {
    const fetchHistorialRespaldos = async () => {
      if (!convocatoriaSeleccionada) {
        setHistorialRespaldos([]);
        return;
      }

      try {
        const token = await getAccessToken();
        const response = await axios.get(
          `${API_HISTORICOS_POR_CONVOCATORIA}/${encodeURIComponent(
            convocatoriaSeleccionada
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const normalize = (name) =>
          (name ?? "").toLowerCase().replace(/[\s_]/g, "");

        const ORDEN_TABLAS = [
          "convocatoria",
          "grado",
          "municipio",
          "rol",
          "actividadconvocatoria",
          "nivel",
          "tipoparticipacion",
          "nombramiento",
          "dependencia",
          "solicitud",
          "etapadocumentos",
          "archivodocumentos",
          "datossep",
          "evaluacion",
          "solicitudfks",
        ];

        const TABLAS_OCULTAS = ["miembro"];

        const lista = (Array.isArray(response.data) ? response.data : []).filter(
          (item) => !TABLAS_OCULTAS.includes(normalize(item.tablaRespaldo))
        );
        const ordenada = [...lista].sort((a, b) => {
          const ia = ORDEN_TABLAS.indexOf(normalize(a.tablaRespaldo));
          const ib = ORDEN_TABLAS.indexOf(normalize(b.tablaRespaldo));
          const ra = ia === -1 ? ORDEN_TABLAS.length : ia;
          const rb = ib === -1 ? ORDEN_TABLAS.length : ib;
          return ra - rb;
        });
        setHistorialRespaldos(ordenada);
      } catch (error) {
        console.error("Error al obtener historial de respaldos:", error);
        setHistorialRespaldos([]);
      }
    };

    fetchHistorialRespaldos();
  }, [convocatoriaSeleccionada]);

  const formatFecha = (timestamp) => {
    if (!timestamp) return "-";
    const fecha = new Date(timestamp);
    if (Number.isNaN(fecha.getTime())) return "-";
    return fecha.toLocaleString("es-MX");
  };
  const handleIniciarRespaldo = async () => {
    try {
      const token = await getAccessToken();
      await axios.patch(
        `${API_HISTORICOS_ACTIVO}?activo=true`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistoricosActivo(true);
    } catch (error) {
      console.error("Error al activar historicos-activo:", error);
    }
  };

  return (
    <div className={styles.container}>
      <TitlePage title="Respaldar Historico" />

      <div className={styles.selectWrapper}>
        <label
          htmlFor="historico-convocatoria-select"
          className={styles.selectLabel}
        >
          Convocatoria a respaldar
        </label>
        <select
          id="historico-convocatoria-select"
          className={styles.select}
          value={convocatoriaSeleccionada}
          onChange={(e) => setConvocatoriaSeleccionada(e.target.value)}
          disabled={loadingConvocatorias}
        >
          <option value="">
            {loadingConvocatorias
              ? "Cargando..."
              : "Seleccione una convocatoria"}
          </option>
          {convocatorias.map((conv) => (
            <option key={conv.id} value={String(conv.id)}>
              {conv.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        <section className={styles.cardIniciar}>
          {botonHabilitado && (
            <button
              type="button"
              className={styles.btnIniciar}
              disabled={historicosActivo}
              onClick={handleIniciarRespaldo}
            >
              Iniciar Respaldo
            </button>
          )}
        </section>

        <section className={styles.cardHistorial}>
          <h3 className={styles.subtitulo}>Historial de Respaldos</h3>
          <div className={styles.listaRespaldos}>
            {historialRespaldos.map((item) => {
              const estadoTexto = item.flagCompleto ? "Completa" : "Incompleta";
              const estadoClass = item.flagCompleto
                ? styles.itemEstadoOk
                : styles.itemEstadoError;

              return (
                <div key={item.id} className={styles.itemRespaldo}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemTitulo}>
                      {item.tablaRespaldo}
                    </span>
                    <span className={styles.itemFecha}>
                      Fecha: {formatFecha(item.fechaFin)}
                    </span>
                  </div>
                  <span className={estadoClass}>
                    {estadoTexto}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RespaldarHistorico;
