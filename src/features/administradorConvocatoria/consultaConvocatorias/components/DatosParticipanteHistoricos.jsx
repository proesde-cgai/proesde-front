import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useDetalleSolicitudHistoricoStore } from "../store/useDetalleSolicitudHistoricoStore";
import styles from "../../../visorDeDocumentos/components/DatosParticipante.module.css";

const formatFecha = (timestamp) => {
  if (timestamp == null || timestamp === "") return "Sin registro";
  const d = new Date(Number(timestamp));
  return Number.isNaN(d.getTime()) ? "Sin registro" : d.toLocaleDateString("es-MX");
};

export const DatosParticipanteHistoricos = () => {
  const detalle = useDetalleSolicitudHistoricoStore((state) => state.detalle);

  if (!detalle) {
    return (
      <div className={styles.container}>
        <div className={styles.containerData}>
          <p className={styles.nombreDatos}>Seleccione un académico del listado para ver el detalle.</p>
        </div>
      </div>
    );
  }

  const {
    id,
    codigo,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    tipoParticipacion,
    nombreConvocatoria,
    fechaSolicitud,
    estatus,
    centroUniversitario,
    gradoAcademico,
    ciclo,
    cicloB,
    comentarios,
    anio,
    programa,
    nombreCompleto,
    dictamen,
    urlDocumento,
    puntaje,
  } = detalle;

  return (
    <div className={styles.container}>
      <div className={styles.containerData}>
        <div className={styles.datosPersonales}>
          <p className={styles.nombreDatos}>
            <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> Datos personales
          </p>
          <div className={styles.containerTableData}>
            <div className={styles.inputContainer}>
              <label htmlFor="codigo-h">Código</label>
              <input id="codigo-h" type="text" value={codigo ?? "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="nombre-h">Nombre completo</label>
              <input
                id="nombre-h"
                type="text"
                value={nombreCompleto ?? ([nombre, apellidoPaterno, apellidoMaterno].filter(Boolean).join(" ") || "Sin registro")}
                readOnly
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="nombre-h2">Nombre</label>
              <input id="nombre-h2" type="text" value={nombre ?? "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="apellidoPaterno-h">Apellido paterno</label>
              <input id="apellidoPaterno-h" type="text" value={apellidoPaterno ?? "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="apellidoMaterno-h">Apellido materno</label>
              <input id="apellidoMaterno-h" type="text" value={apellidoMaterno ?? "Sin registro"} readOnly />
            </div>
          </div>
        </div>

        <div className={styles.datosNombramiento}>
          <p className={styles.nombreDatos}>
            <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> Convocatoria y participación
          </p>
          <div className={styles.containerTableData}>
            <div className={styles.inputContainer}>
              <label htmlFor="tipoParticipacion-h">Tipo de participación</label>
              <input id="tipoParticipacion-h" type="text" value={tipoParticipacion ?? "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="nombreConvocatoria-h">Nombre convocatoria</label>
              <input id="nombreConvocatoria-h" type="text" value={nombreConvocatoria ?? "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="programa-h">Programa</label>
              <input id="programa-h" type="text" value={programa ?? "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="fechaSolicitud-h">Fecha solicitud</label>
              <input id="fechaSolicitud-h" type="text" value={formatFecha(fechaSolicitud)} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="estatus-h">Estatus</label>
              <input id="estatus-h" type="text" value={estatus ?? "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="anio-h">Año</label>
              <input id="anio-h" type="text" value={anio ?? "Sin registro"} readOnly />
            </div>
          </div>
        </div>

        <div className={styles.datosNombramiento}>
          <p className={styles.nombreDatos}>
            <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> Centro y grado
          </p>
          <div className={styles.containerTableData}>
            <div className={styles.inputContainer}>
              <label htmlFor="centro-h">Centro universitario</label>
              <input id="centro-h" type="text" value={centroUniversitario ?? "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="grado-h">Grado académico</label>
              <input id="grado-h" type="text" value={gradoAcademico ?? "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="ciclo-h">Ciclo</label>
              <input id="ciclo-h" type="text" value={ciclo ?? "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="cicloB-h">Ciclo B</label>
              <input id="cicloB-h" type="text" value={cicloB ?? "Sin registro"} readOnly />
            </div>
          </div>
        </div>

        <div className={styles.datosNombramiento}>
          <p className={styles.nombreDatos}>
            <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> Evaluación
          </p>
          <div className={styles.containerTableData}>
            <div className={styles.inputContainer}>
              <label htmlFor="dictamen-h">Dictamen</label>
              <input id="dictamen-h" type="text" value={dictamen ?? "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="puntaje-h">Puntaje</label>
              <input id="puntaje-h" type="text" value={puntaje != null ? String(puntaje) : "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="comentarios-h">Comentarios</label>
              <input id="comentarios-h" type="text" value={comentarios ?? "Sin registro"} readOnly />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
