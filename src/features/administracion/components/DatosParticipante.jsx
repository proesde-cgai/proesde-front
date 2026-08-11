import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Alert from "../../../reutilizable/Alert";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import styles from "./styles/DatosParticipante.module.css";
import axios from "axios";
import { getEmailUdgService } from "../../visorDeDocumentos/services/datosParticipanteService";
import Loading from "../../../reutilizable/Loading";
import TablaCargaHoraria from "../../../reutilizable/components/TablaCargaHoraria";

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Concatenar el contexto y el servicio/recurso
const API_URL_CORREO_PROESDE = `${API_BASE_URL}/api/v1/solicitud/email/`;

export const DatosParticipante = () => {
  const { selectedDataAcademico, isLoading } = useEvaluationStore();
  const [correoProesde, setCorreoProesde] = useState("");

  useEffect(() => {
    if (!selectedDataAcademico?.codigo) return;
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
        setCorreoProesde(response.data);
      })
      .catch((error) => console.error("Error fetching correo: ", error));
  }, [selectedDataAcademico?.codigo]);

  /*  const [datosParticipante, setDatosParticipante] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); */

  /* useEffect(() => {
      getDatosParticipante()
        .then((response) => {
          setDatosParticipante(response.data);
          console.log(response.data);
          setError(null);
          setInfoAcademico({
            id: response.data.idSolicitud,
            nombre: response.data.nombre,
            apellidoPaterno: response.data.apellidoP,
            apellidoMaterno: response.data.apellidoM,
            codigo: response.data.codigo,
            cargo: "",
            tipo: "",
            nivel: "",
          });
        })
          console.error(
            "Error al obtener los datos del participante",
            error.error
          );
          if (error.response) {
            setError(
              `Ocurrió un error al obtener los datos del participante: ${error.response.data.mensaje} - Status Code: ${error.response.status}`
            );
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }, [setInfoAcademico]); */

  // Desestructuramos las propiedades del dato del participante para una mejor lectura
  if (!selectedDataAcademico) return null;

  const {
    id: idSolicitud,
    codigo,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    nombreGradoAcademico,
    institucionOtorgante,
    email,
    emailProesde,
    telefono,
    ext,
    telefonoMovil,
    nacionalidad,
    entidadFederativa,
    nombramiento,
    dependencia,
    municipio,
    fechaIngreso,
    antiguedad,
    puestoDirectivo,
    tipoPuestoDirectivo,
    tipoParticipacionNombre,
    tipoParticipacionDescripcion,
    evaluaciones,
    ultimoGrado,
    rfc,
    curp,
    horasFrenteGrupo,
    nombreParticipacion,

    // data
    ultimoGradoNombre,
    nombrePosgrado,
    movil,
    nombreNombramiento,
    municipioDependencia,
    nombreDependencia,
    apellidoM,
    apellidoP,
  } = selectedDataAcademico;

  // funcion para mostrar Si = true, No = false para mejor formato en la interfaz
  const formatoBool = (value = "") => (value ? "Si aplica" : "No aplica");

  if (isLoading) return <Loading />;

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
                value={`${nombre || ""} ${apellidoP || ""} ${apellidoM || ""}` || "Sin registro"}
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
              <input id="ultimoGrado" type="text" value={ultimoGradoNombre || ultimoGrado || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="nombreGradoAcademico">Nombre del último grado de estudios</label>
              <input id="nombreGradoAcademico" type="text" value={nombrePosgrado || nombreGradoAcademico} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="institucionOtorgante">Institución Otorgante</label>
              <input id="institucionOtorgante" type="text" value={institucionOtorgante || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="correo">Correo Electrónico</label>
              <input id="correo" type="email" value={correoProesde.emailUdg ?? "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="correo">Correo Electrónico Proesde</label>
              <input id="correo" type="email" value={email || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="telefono">Teléfono</label>
              <input id="telefono" type="tel" value={telefono || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="telefonoMovil">Teléfono Móvil</label>
              <input id="telefonoMovil" type="tel" value={telefonoMovil || movil || "Sin registro"} readOnly />
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
            Datos del nombramiento o contrato actual
          </p>

          <div className={styles.containerTableData}>
            <div className={styles.inputContainer}>
              <label htmlFor="nombramiento">Nombramiento</label>
              <input
                id="nombramiento"
                type="text"
                value={nombreNombramiento?.toUpperCase() || nombramiento.toUpperCase() || "Sin registro"}
                readOnly
              />
            </div>
            {/* <div className={styles.inputContainer}>
                            <label htmlFor="horasFrenteGrupo">Horas frente a grupo</label>
                            <input id="horasFrenteGrupo" type="text" value={horasFrenteGrupo} readOnly />
                        </div> */}
            <div className={styles.inputContainer}>
              <label htmlFor="dependencia">Dependencia</label>
              <input id="dependencia" type="text" value={nombreDependencia || dependencia || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="municipio">Municipio</label>

              <input id="municipio" type="text" value={municipio || municipioDependencia || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="fechaIngreso">Fecha de Ingreso</label>
              <input id="fechaIngreso" type="text" value={fechaIngreso || "Sin registro"} readOnly />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="antiguedad">Antigüedad</label>
              <input id="antiguedad" type="text" value={antiguedad || "Sin registro"} readOnly />
            </div>
            {console.log("directivo ", puestoDirectivo)}
            <div className={styles.inputContainer}>
              <label htmlFor="esDirectivo">¿Puesto directivo?</label>
              <input
                id="esDirectivo"
                type="text"
                value={puestoDirectivo === false ? "No Aplica" : "Si Aplica" || "Sin registro"}
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
              <TablaCargaHoraria selectedAcademico={selectedDataAcademico?.codigo}/>
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
