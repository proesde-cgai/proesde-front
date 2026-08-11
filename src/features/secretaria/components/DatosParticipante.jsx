import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Alert from "../../../reutilizable/Alert";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import styles from "./styles/DatosParticipante.module.css";
import Loading from "../../../reutilizable/Loading";
import axios from "axios";
import TablaCargaHoraria from "../../../reutilizable/components/TablaCargaHoraria";

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Concatenar el contexto y el servicio/recurso
const API_URL_CORREO_PROESDE = `${API_BASE_URL}/api/v1/solicitud/email/`;

export const DatosParticipante = () => {
  const { selectedDataAcademico } = useEvaluationStore();
  const [correoProesde, setCorreoProesde] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(`${API_URL_CORREO_PROESDE}${selectedDataAcademico?.codigo}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("response data ", response.data);
        setCorreoProesde(response.data);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, [selectedDataAcademico]);

  // Desestructuramos las propiedades del dato del participante para una mejor lectura
  if (!selectedDataAcademico) return null;
  console.log(selectedDataAcademico);

  const {
    id: idSolicitud,
    codigo,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    nombreGradoAcademico,
    institucionOtorgante,
    email,
    telefono,
    movil,
    emailUdg,
    ext,
    telefonoMovil,
    nacionalidad,
    entidadFederativa,
    nombreNombramiento,
    nombreDependencia,
    municipioDependencia,
    fechaIngresoFormato,
    antiguedad,
    directivo,
    tipoPuestoDirectivo,
    tipoParticipacionNombre,
    tipoParticipacionDescripcion,
    evaluaciones,
    ultimoGradoNombre,
    rfc,
    curp,
    horasFrenteGrupo,
    nombreParticipacion,
    nombrePosgrado,
  } = selectedDataAcademico;

  // funcion para mostrar Si = true, No = false para mejor formato en la interfaz
  const formatoBool = (value = "") => (value ? "Si" : "No");

  function convertirUnixAFechaLegible(timestamp) {
    // Si el timestamp está en segundos, convertirlo a milisegundos
    if (timestamp < 10000000000) {
      timestamp *= 1000; // Multiplicar por 1000 para convertir a milisegundos
    }

    // Crear un objeto Date con el timestamp
    const fecha = new Date(timestamp);

    // Formatear la fecha legible
    return fecha.toLocaleString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  console.log(directivo);

  return (
    <div className={styles.container}>
      <div className={styles.containerData}>
        {/* DATOS PERSONALES */}
        <div className={styles.datosPersonales}>
          <p className={styles.nombreDatos}>
            <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> {""}
            Datos personales
          </p>

          <div className={styles.containerTableData}>
            <div className={styles.inputContainer}>
              <label htmlFor="codigo">Código</label>
              <input id="codigo" type="text" value={codigo || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                value={`${nombre || ""} ${apellidoPaterno || ""} ${apellidoMaterno || ""}` || "Sin registro"}
                readOnly
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="rfc">RFC</label>
              <input id="rfc" type="text" value={rfc || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="curp">CURP</label>
              <input id="curp" type="text" value={curp || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="ultimoGrado">Último grado de estudios </label>
              <input id="ultimoGrado" type="text" value={ultimoGradoNombre || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="nombreGradoAcademico">Nombre del último grado de estudios</label>
              <input id="nombreGradoAcademico" type="text" value={nombrePosgrado} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="institucionOtorgante">Institución Otorgante</label>
              <input id="institucionOtorgante" type="text" value={institucionOtorgante || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="correo">Correo Electrónico</label>
              <input id="correo" type="email" value={correoProesde.emailUdg || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="correo">Correo Electrónico Proesde</label>
              <input id="correo" type="email" value={email || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="correo">Ext.</label>
              <input id="correo" type="email" value={ext || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="telefono">Teléfono</label>
              <input id="telefono" type="tel" value={telefono || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="telefonoMovil">Teléfono Móvil</label>
              <input id="telefonoMovil" type="tel" value={movil || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="nacionalidad">Nacionalidad</label>
              <input id="nacionalidad" type="text" value={nacionalidad || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="entidadFederativa">Entidad Federativa</label>
              <input id="entidadFederativa" type="text" value={entidadFederativa || "Sin registro"} readOnly />
            </div>
          </div>
        </div>

        {/* DATOS DEL NOMBRAMIENTO O CONTRATO ACTUAL */}
        <div className={styles.datosNombramiento}>
          <p className={styles.nombreDatos}>
            <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> {""}
            Datos del nombramiento o contrato actuals
          </p>

          <div className={styles.containerTableData}>
            <div className={styles.inputContainer}>
              <label htmlFor="nombramiento">Nombramiento</label>
              <input
                id="nombramiento"
                type="text"
                value={nombreNombramiento?.toUpperCase() || "Sin registro"}
                readOnly
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="dependencia">Dependencia</label>
              <input id="dependencia" type="text" value={nombreDependencia || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="municipio">Municipio</label>
              <input id="municipio" type="text" value={municipioDependencia || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="fechaIngreso">Fecha de Ingreso</label>
              <input id="fechaIngreso" type="text" value={fechaIngresoFormato || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="antiguedad">Antigüedad</label>
              <input id="antiguedad" type="text" value={antiguedad || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="esDirectivo">¿Puesto directivo?</label>

              <input
                id="esDirectivo"
                type="text"
                value={directivo === false ? "No Aplica" : "Si Aplica" || "Sin registro"}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* DATOS DE PARTICIPACION */}
        <div className={styles.datosNombramiento}>
          <p className={styles.nombreDatos}>
            <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> {""}
            Datos de participación
          </p>
          <div className={styles.containerTableData}>
            <div className={styles.inputContainer}>
              <label htmlFor="participacion">Participación</label>
              <input id="participacion" type="text" value={tipoParticipacionNombre || "Sin registro"} readOnly />
            </div>
            <div className={styles.datosNombramiento}>
              <TablaCargaHoraria />
            </div>
          </div>
        </div>
      </div>

      {/* <div className={styles.containerVisorDoc}>
            <div>Documentos recuperados de ALFRESCO</div>
          </div> */}
    </div>
  );
};
