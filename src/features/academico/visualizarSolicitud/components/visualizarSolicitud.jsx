import React, { useEffect, useState } from "react";
import axios from "axios";
import InputField from "../../../../reutilizable/InputField";
import SelectField from "../../../../reutilizable/SelectField";
import styles from "./visualizarSolicitud.module.css";
import useStoredFecha from "../../../useStoredFecha";
import { useCargaHorariaStore } from "../../../../store/useCargaHorariaStore";
import TablaCargaHoraria from "../../../../reutilizable/components/TablaCargaHoraria";

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Concatenar el contexto y el servicio/recurso
const API_URL_PRELLENADO = `${API_BASE_URL}/api/v1/solicitud/activa`;
const API_URL_AREA = `${API_BASE_URL}/api/v1/area-conocimiento/all`;
const API_URL_DEPENDENCIA = `${API_BASE_URL}/api/v1/dependencia/activa`;

export const VisualizarSolicitud = () => {
  const { fetchCargaGlobal } = useCargaHorariaStore();

  const [total, setTotal] = useState(0.0);
  const [areas, setAreas] = useState([]);
  const [visible, setVisible] = useState(true);
  const fecha = useStoredFecha();
  const displayDate = fecha?.rangoFecha || "2024-2025";

  const initialState = {
    codigo: null,
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    rfc: "",
    CURP: "",
    ultimogrado: {},
    nombregradoacademico: "",
    institucionOtorgante: "",
    correo: "",
    correoProesde: "",
    telefono: "",
    telefonoMovil: "",
    nacionalidad: "",
    entidadFederativa: "",
    nombramiento: {},
    dependencia: {},
    municipio: null,
    fechaDeIngreso: null,
    antiguedad: null,
    PuestoDirectivo: false,
    areaConocimiento: null,
    departamento: "",
    nombreJefeDepto: "",
    cetro: "",
    tipoPuesto: null,
    tipoParticipacion: null,
    textoAclarativo: "",
    todosCamposCorrectos: "",
    cargaGlobal: [],
    nivelEducativo: {},
    horasFrenteAlGrupo: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [jefes, setJefes] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [sexo, setSexo] = useState();
  const [idTipoParticipacion, setIdTipoParticipacion] = useState();

  useState(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_PRELLENADO, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(response.data);
        const sortedCargaGlobal = (data.cargaGlobal || []).sort((a, b) => {
          const order = ["BACHILLERATO", "LICENCIATURA", "POSGRADO"];
          return order.indexOf(a.nivel) - order.indexOf(b.nivel);
        });
        //console.log("prellenado ", response.data)
        // Set form data with the pre-filled values
        setFormData({
          codigo: data.codigo || null,
          nombre: data.nombre || "",
          apellidoPaterno: data.apellidoPaterno || "",
          apellidoMaterno: data.apellidoMaterno,
          rfc: data.datosSep.rfc || "",
          CURP: data.curp || "",
          ultimogrado: data.grado || null,
          nombregradoacademico: data.nombrePosgrado || "",
          institucionOtorgante: data.institucionOtorgante || "",
          correo: data.email || "",
          correoProesde: data.emailProesde || "",
          telefono: data.telefono || "",
          ext: data.ext || "",
          telefonoMovil: data.movil || "",
          nacionalidad: data.nacionalidad || "",
          entidadFederativa: data.estadonac,
          dependencia: data.dependencia || null,
          municipio: data.municipio || null,
          fechaDeIngreso: data.fechaIngresoFormato || null,
          antiguedad: data.antiguedad || null,
          PuestoDirectivo: data.directivo || false,
          areaConocimiento: data.datosSep.idAreaConocimiento || null,
          departamento: "",
          nombreJefeDepto: data.nombreJefeDepto || "",
          cargaGlobal: sortedCargaGlobal,
          nombramiento: data.nombramiento,
          nivelEducativo: data.datosSep.nivelEducativo || {},
          horasFrenteAlGrupo: data.horasFrenteGrupo,
        });
        fetchCargaGlobal(data.codigo || null);
        setSexo(data.generoJefe);
        setIdTipoParticipacion(data.idTipoParticipacion);

        setTotal(
          Math.round(
            data.cargaGlobal.reduce((total, item) => {
              return total + parseFloat(item.cargaHoraria || 0);
            }, 0) * 100
          ) / 100
        );
      })
      .catch((error) => {
        console.error("Error fetching data ", error);
      });
  }, []);

  ///area-conocimiento
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_AREA, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);

  useState(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_DEPENDENCIA, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const { departamentos, jefesDepartamento } = response.data;
        console.log(departamentos);
        const result = departamentos.map((departamento, index) => ({
          id: index + 1,
          departamento: departamento,
        }));
        const resultJefes = jefesDepartamento.map((jefe, index) => ({
          id: index + 1,
          jefe: jefe,
        }));
        setJefes(resultJefes);
        setDepartamentos(result);
      })
      .catch((error) => console.error("Error fetching dependencias: ", error));
  }, []);
  useEffect(() => {
    if (departamentos && departamentos.length === 1) {
      setFormData((prevData) => ({
        ...prevData,
        departamento: departamentos[0].id,
      }));
    }
  }, [departamentos]);

  return (
    <>
      <div className={styles.solicitudContainer}>
        <h2 className={styles.titulo}>PROGRAMA DE ESTIMULOS AL DESEMPEÑO DOCENTE {displayDate}</h2>
        <p> Revise que su información sea correcta antes de suscribir la solicitud.</p>

        <div className={styles.container}>
          <form className={styles.form} id="datosPersonalesForm">
            <div className={styles.form_data}>
              <h2 className={styles.titulo}>Datos personales</h2>

              <InputField label="Código" id="codigo" value={formData.codigo} readOnly styles={styles} />
              <InputField label="Nombre" id="nombre" value={formData.nombre} readOnly styles={styles} />
              <InputField
                label="Apellido Paterno"
                id="apellidoPaterno"
                value={formData.apellidoPaterno}
                readOnly
                styles={styles}
              />
              <InputField
                label="Apellido Materno"
                id="apellidoM"
                value={formData.apellidoMaterno}
                readOnly
                styles={styles}
              />
              <InputField label="RFC" id="rfc" value={formData.rfc} readOnly styles={styles} />
              <InputField label="CURP" id="CURP" value={formData.CURP} readOnly styles={styles} />
              <InputField
                label="Último grado de estudios"
                id="ultimogrado"
                value={formData.ultimogrado?.nombre}
                readOnly
                styles={styles}
              />
              <InputField
                label="Nombre del último grado de estudios"
                id="nombregradoacademico"
                value={formData.nombregradoacademico}
                readOnly
                styles={styles}
              />
              <InputField
                label="Institución otorgante"
                id="institucionOtorgante"
                value={formData.institucionOtorgante}
                readOnly
                styles={styles}
              />
              <SelectField
                label="Área de conocimiento conforme a PRODEP"
                id="areaConocimiento"
                value={formData.areaConocimiento}
                options={areas}
                propertyName={""}
                readOnly
                styles={styles}
              />
              <InputField
                label="Correo Electrónico"
                id="correo"
                value={formData.correo}
                type="email"
                readOnly
                styles={styles}
              />
              <InputField
                label="Correo Electrónico Proesde"
                id="correoProesde"
                value={formData.correoProesde ?? ""}
                type="email"
                readOnly
                styles={styles}
              />
              <InputField
                label="Teléfono"
                id="telefono"
                value={formData.telefono}
                type="tel"
                readOnly
                styles={styles}
              />
              <InputField label="Ext." id="ext" value={formData.ext} readOnly styles={styles} />
              <InputField
                label="Teléfono Móvil"
                id="telefonoMovil"
                value={formData.telefonoMovil}
                readOnly
                type="tel"
                styles={styles}
              />
              <InputField
                label="Nacionalidad"
                id="nacionalidad"
                value={formData.nacionalidad}
                readOnly
                type="text"
                styles={styles}
              />
              <InputField
                label="Entidad Federativa"
                id="entidadFederativa"
                value={formData.entidadFederativa}
                readOnly
                styles={styles}
              />
            </div>
          </form>

          <h2 className={styles.titulo}> Datos de nombramiento o contrato actual </h2>
          <form className={styles.form} id="informacionAcademicaForm">
            <div className={styles.form_data}>
              {console.log(
                "departamentos[parseInt(formData.departamento)]?.departamento",
                departamentos[parseInt(formData.departamento - 1)]?.id
              )}
              <InputField
                label="Nombramiento"
                id="nombramiento"
                value={formData.nombramiento?.nombre?.toUpperCase()}
                readOnly
                styles={styles}
              />
              {/*<InputField
                label="Nivel Educativo"
                id="nivelEducativo"
                value={formData.nivelEducativo?.nombre}
                readOnly
                styles={styles}
              />*/}
              <InputField
                label="Dependencia"
                id="dependencia"
                value={formData.dependencia?.nombre}
                readOnly
                styles={styles}
              />
              <InputField
                label="Departamentos"
                id="departamentos"
                value={departamentos[0]?.departamento || ""}
                readOnly
                styles={styles}
              />
              <InputField
                label={sexo === "F" ? "Jefa de Departamento" : "Jefe de Departamento"}
                id="nombreJefeDepto"
                value={jefes[0]?.jefe || ""}
                readOnly
                styles={styles}
              />
              <InputField
                label="Municipio"
                id="municipio"
                value={formData.municipio?.nombre}
                readOnly
                styles={styles}
              />
              <InputField
                label="Fecha de Ingreso"
                id="fechaDeIngreso"
                value={formData.fechaDeIngreso}
                readOnly
                styles={styles}
              />
              <InputField label="Antigüedad" id="antiguedad" value={formData.antiguedad} readOnly styles={styles} />
              <InputField
                label="Puesto Directivo"
                id="PuestoDirectivo"
                value={formData.PuestoDirectivo === false ? "No aplica" : "Si aplica"}
                readOnly
                styles={styles}
              />
            </div>
          </form>
          <div className={styles.datosNombramiento}>
            <TablaCargaHoraria />
          </div>
        </div>
      </div>
    </>
  );
};
