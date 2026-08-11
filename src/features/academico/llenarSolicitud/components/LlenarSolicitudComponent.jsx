import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Alert from "../../../../reutilizable/Alert";
import InputField from "../../../../reutilizable/InputField";
import SelectField from "../../../../reutilizable/SelectField";
import { dataPrefilledAdapter } from "../adapters";
import { getGradoService, getMunicipiosService, getPrefilledService } from "../services";
import styles from "./llenarSolicitudPage.module.css";
import { useCargaHorariaStore } from "../../../../store/useCargaHorariaStore";
import TablaCargaHoraria from "../../../../reutilizable/components/TablaCargaHoraria";
// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Concatenar el contexto y el servicio/recurso
const API_URL_GRADO = `${API_BASE_URL}/api/v1/grado/all`;
const API_URL_AREA = `${API_BASE_URL}/api/v1/area-conocimiento/all`;
const API_URL_NIVEL = `${API_BASE_URL}/api/v1/nivel-educativo/all`;
const API_URL_NOMBRAMIENTO = `${API_BASE_URL}/api/v1/nombramiento/activa-filtrado`;
const API_URL_DEPENDENCIA = `${API_BASE_URL}/api/v1/dependencia/activa`;
const API_URL_SOLICITUD = `${API_BASE_URL}/api/v1/solicitud`;
const API_URL_PROGRAMAS_EDUCATIVOS = `${API_BASE_URL}/api/v1/programa-educativo/all`;

export const LlenarSolicitudComponent = () => {
  const { fetchCargaGlobal, } = useCargaHorariaStore();
  const codeUser = localStorage.getItem('userName');
  const initialState = {
    codigo: null,
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    rfc: "",
    CURP: "",
    ultimogrado: {},
    nombreUltimoGradoEstudios: "",
    institucionOtorgante: "",
    correo: "",
    correoProesde: null,
    telefono: "",
    telefonoMovil: "",
    nacionalidad: "",
    entidadFederativa: "",
    nombramiento: null,
    dependencia: null,
    municipio: null,
    fechaDeIngreso: null,
    antiguedad: null,
    PuestoDirectivo: false,
    areaConocimiento: null,
    departamento: "",
    nombreJefeDepto: "",
    textoAclarativo: "",
    todosCamposCorrectos: "",
    cargaGlobal: [],
    nivelEducativo: {},
    fechaNacimientoFormato: ""
  };
  const fecha = JSON.parse(localStorage.getItem("fecha"));
  const displayDate = fecha?.rangoFecha || "2024-2025";

  const resetState = {
    areaConocimiento: 0,
    nombreUltimoGradoEstudios: "",
    institucionOtorgante: "",
    ext: "",
    entidadFederativa: "",
    todosCamposCorrectos: "",
    nombramiento: 0,
    dependencia: 0,
    departamento: "",
    nombreJefeDepto: "",
    municipio: 0,
    textoAclarativo: ""
  }

  const [grados, setGrados] = useState([])
  const [areaEditable, setAreaEditable] = useState(false);
  const [programas, setProgramas] = useState([])
  const [dependencias, setDependencias] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [nombramientos, setNombramientos] = useState([]);
  const [niveles, setNiveles] = useState([])
  const [areas, setAreas] = useState([])
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0.0)
  const [municipios, setMunicipios] = useState([])
  const [isVisible, setIsVisible] = useState(true);
  const [jefes, setJefes] = useState([]);
  const [isPageVisible, setIsPageVisible] = useState(true)
  const [sexo, setSexo] = useState()
  const [idTipoParticipacion, setIdTipoParticipacion] = useState()

  const getMunicipios = async () => {
    try {
      const response = await getMunicipiosService();
      const sortedMunicipios = response.sort((a, b) =>
        a.municipio.localeCompare(b.municipio, 'es', { sensitivity: 'base' })
      );


      setMunicipios(sortedMunicipios);
    } catch (error) {
      console.log(error.message);
    }
  }

  const getGrado = async () => {
    try {
      const response = await getGradoService();

      setGrados(response)
    } catch (error) {
      console.log(error.message);
    }
  }

  const getPrefilled = async () => {
    try {
      const response = await getPrefilledService();
      const prefilledAdapter = dataPrefilledAdapter(response);

      setFormData({ ...formData, ...prefilledAdapter })
      setSexo(response.generoJefe)
      setIdTipoParticipacion(response.idTipoParticipacion)

      setTotal(response.cargaGlobal.reduce((total, item) => {
        return total + parseFloat(item.cargaHoraria || 0);
      }, 0))

      if (!response.datosSep.idAreaConocimiento) setAreaEditable(true)

    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    getMunicipios();
    getGrado();
    getPrefilled();
    fetchCargaGlobal(codeUser);
    // eslint-disable-next-line
  }, []);


  //programas educativos
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    axios.get(API_URL_PROGRAMAS_EDUCATIVOS, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setProgramas(response.data)
      })
      .catch(error => console.error("Error fetching grados: ", error))
  }, [])

  ///area-conocimiento
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    axios.get(API_URL_AREA, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setAreas(response.data)
      })
      .catch(error => console.error("Error fetching grados: ", error))
  }, [])

  //nivel educativo
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    axios.get(API_URL_NIVEL, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setNiveles(response.data)

      })
      .catch(error => console.error("Error fetching grados: ", error))
  }, [])

  //nombramiento
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    axios.get(API_URL_NOMBRAMIENTO, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setNombramientos(response.data)
      })
      .catch(error => console.error("Error fetching grados: ", error))
  }, [])

  // En casos de que solo regrese un dato nombramientos end point

  useEffect(() => {
    if (nombramientos && nombramientos.length === 1) {
      setFormData((prevData) => ({
        ...prevData,
        nombramiento: nombramientos[0].id ?? prevData.nombramiento,
      }));
    }
  }, [nombramientos]);

  //dependencias
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    axios.get(API_URL_DEPENDENCIA, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        const { dependencias, departamentos, jefesDepartamento } = response.data;
        const mappedDepartamentos = (departamentos && departamentos.length > 0) ? departamentos.map((departamento, index) => ({
          id: index + 1,
          departamento: departamento,
        })) : [];

        const mappedJefes = (jefesDepartamento && jefesDepartamento.length > 0) ? jefesDepartamento.map((jefe, index) => ({
          id: index + 1,
          jefe: jefe,
        })) : [];


        setDependencias(dependencias || []);
        setDepartamentos(mappedDepartamentos);
        setJefes(mappedJefes);

        setFormData(prevData => ({
          ...prevData,
          dependencia: dependencias?.length === 1 ? dependencias[0].id : prevData.dependencia,
          departamento: mappedDepartamentos.length === 1 ? mappedDepartamentos[0].departamento : prevData.departamento,
          nombreJefeDepto: mappedJefes.length === 1 ? mappedJefes[0].jefe : prevData.nombreJefeDepto,
        }));

      })
      .catch(error => console.error("Error fetching dependencias: ", error))
  }, [])

  // En casos de que solo regrese un dato nombramientos end point
  useEffect(() => {
    if (nombramientos && nombramientos.length === 1) {
      console.log("solo un nombramiento")
      setFormData((prevData) => ({
        ...prevData,
        nombramiento: nombramientos[0].id,
      }));
    }
  }, [nombramientos]);


  // En casos de que solo regrese un dato en dependencias
  useEffect(() => {
    if (dependencias && dependencias.length === 1) {
      setFormData((prevData) => ({
        ...prevData,
        dependencia: dependencias[0].id,
      }));
    }
  }, [dependencias]);

  // En casos de que solo regrese un dato en dependencias
  useEffect(() => {
    if (departamentos && departamentos.length === 1) {
      setFormData((prevData) => ({
        ...prevData,
        departamento: departamentos[0].departamento,
      }));
    }
  }, [departamentos]);

  useEffect(() => {
    if (jefes && jefes.length === 1) {
      setFormData((prevData) => ({
        ...prevData,
        nombreJefeDepto: jefes[0].jefe,
      }));
    }
  }, [jefes]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Validar campos
  const validateFields = (updatedFormData) => {
    let hasError = [];

    Object.keys(updatedFormData).forEach((key) => {
      console.log(key);
      
      if (
        key !== "textoAclarativo" &&
        key !== "ext" &&
        key !== "apellidoMaterno" &&
        key !== "correoProesde" &&
        (updatedFormData[key] === "" ||
          updatedFormData[key] === null ||
          updatedFormData[key] === undefined)
      ) {
        if (key === "todosCamposCorrectos") {
          hasError.push("¿Estás de acuerdo con el correo electrónico para notificaciones?");
        } else {
          hasError.push(key);
        }

      }
    });
    return hasError;
  };
  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      dependencia: dependencias.length === 1 ? dependencias[0].id : formData.dependencia,
      departamento: departamentos.length === 1 ? departamentos[0].departamento : formData.departamento,
      nombreJefeDepto: jefes.length === 1 ? jefes[0].jefe : formData.nombreJefeDepto,
      nombramiento: nombramientos.length === 1 ? nombramientos[0].id : formData.nombramiento,
    };

    console.log("✅ Enviando datos actualizados:", updatedFormData);
    const hasError = validateFields(updatedFormData);
    if (hasError.length > 0 || !formData.todosCamposCorrectos) {
      const formattedErrors = hasError.map(error =>
        error
          .replace(/([a-z])([A-Z])/g, "$1 $2") // Separa palabras camelCase con espacios
          .replace(/^\w/, c => c.toUpperCase()) // Capitaliza la primera letra
      );
      setError(`Todos los campos son obligatorios. Campos con error: ${formattedErrors.join(", ")}`);
    }
    else {
      setError("");
      const requestData = {
        datosSep: {
          rfc: updatedFormData.rfc,
          idAreaConocimiento: Number(updatedFormData.areaConocimiento),
          idNivelEducativo: Number(updatedFormData.nivelEducativo.id),
        },
        idGrado: Number(updatedFormData.ultimogrado.id),
        idNombramiento: Number(updatedFormData.nombramiento),
        idDependencia: Number(updatedFormData.dependencia),
        nombre: updatedFormData.nombre,
        apellidoPaterno: updatedFormData.apellidoPaterno,
        apellidoMaterno: updatedFormData.apellidoMaterno,
        curp: updatedFormData.CURP,
        nombrePosgrado: updatedFormData.nombreUltimoGradoEstudios,
        institucionOtorgante: updatedFormData.institucionOtorgante,
        nombreJefeDepto: updatedFormData.nombreJefeDepto,
        correoProesde: updatedFormData.correoProesde ? updatedFormData.correoProesde : updatedFormData.correo,
        email: updatedFormData.textoAclarativo ? updatedFormData.textoAclarativo : updatedFormData.correo,
        telefono: updatedFormData.telefono,
        ext: updatedFormData.ext,
        movil: updatedFormData.telefonoMovil,
        horasFrenteGrupo: total,
        departamento: updatedFormData.departamento,
        idMunicipio: updatedFormData.municipio,
        fechaIngresoFormato: updatedFormData.fechaDeIngreso,
        antiguedad: updatedFormData.antiguedad,
        directivo: updatedFormData.PuestoDirectivo,
        nacionalidad: updatedFormData.nacionalidad,
        estadonac: updatedFormData.entidadFederativa,
        otros: updatedFormData.textoAclarativo,
        cargaGlobal: updatedFormData.cargaGlobal,
        fechaNacimientoFormato: updatedFormData.fechaNacimientoFormato,
      };


      const token = localStorage.getItem('accessToken');
      axios.post(API_URL_SOLICITUD, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          // TODO: ADD MODAL SELECT PARTICIPATION TYPE
          setIsVisible(!isVisible);
          setTimeout(() => {
            window.location.reload();
          }, 3000);

        })
        .catch((error) => {
          const status = error.response.status;
          if (status === 403) {
            setError("No se puede almacenar más de una solicitud en la misma convocatoria")
          }
        });
    }
  };


  // Limpiar formulario
  const handleCancel = () => {
    setIsPageVisible(false)
    // setFormData({ ...formData, ...resetState });
    // setError("");
  };

  useEffect(() => {
    const timer = setTimeout(() => { setIsVisible(false) }, 2000);
    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, [isVisible])

  // Efecto para limpiar los errores después de 3 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Limpiar el mensaje de error después de 3 segundos
      }, 5000);
      return () => clearTimeout(timer); // Limpiar el timeout si el componente se desmonta
    }
  }, [error]);

  return (
    <>
      <div className={styles.solicitudContainer} style={{ display: isPageVisible ? 'block' : 'none' }}>
        <>
          <Alert typeAlert={'warning'}>
            <p>AVISO: Para evitar la pérdida de su información, no cierre la sesión ni cambie de pestaña hasta finalizar el proceso.</p>
          </Alert>
          <h2 className={styles.titulo}>PROGRAMA DE ESTIMULOS AL DESEMPEÑO DOCENTE {displayDate}</h2>
          <p>Por favor, revise cuidadosamente que todos sus datos sean correctos antes de guardar la solicitud.</p>

          <div className={styles.container}>
            <form className={styles.form} id="datosPersonalesForm">
              <div className={styles.form_data}>
                <h2 className={styles.titulo}>Datos personales</h2>
                <InputField label="Código" id="codigo" value={formData.codigo} readOnly styles={styles} />
                <InputField label="Nombre" id="nombre" value={formData.nombre} readOnly styles={styles} />
                <InputField label="Apellido Paterno" id="apellidoPaterno" value={formData.apellidoPaterno} readOnly styles={styles} />
                <InputField label="Apellido Materno" id="apellidoM" value={formData.apellidoMaterno} readOnly styles={styles} />
                <InputField label="RFC" id="rfc" value={formData.rfc} readOnly styles={styles} />
                <InputField label="CURP" id="CURP" value={formData.CURP} readOnly styles={styles} />
                <InputField label="Último grado de estudios" id="ultimogrado" value={formData.ultimogrado.nombre} readOnly styles={styles} />
                <InputField label={<>Nombre del último grado de estudios  <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="nombreUltimoGradoEstudios" value={formData.nombreUltimoGradoEstudios} onChange={handleChange} styles={styles} />
                <InputField label={<>Institución otorgante <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="institucionOtorgante" value={formData.institucionOtorgante} onChange={handleChange} styles={styles} />
                <SelectField label={<>Área de conocimiento conforme a PRODEP <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="areaConocimiento" value={formData.areaConocimiento} onChange={handleChange} options={areas} propertyName={""} readOnly={!areaEditable} styles={styles} />
                <InputField label={<>Correo Electrónico<span className={styles.tooltipIcon}><FontAwesomeIcon icon={faQuestionCircle} /><span className={styles.tooltipText}>la información aquí añadida es única y exclusivamente para seguimiento de su solicitud de PROESDE, para actualizar cualqueir dato de manera definitiva favor de dirigirse a la Coordinación de Personal de su dependencia de adscripción</span></span></>} id="correo" value={formData.correo} readOnly type="email" styles={styles} />
                <div className={styles.inputContainer}>
                  <label htmlFor="todosCamposCorrectos"><>¿Estás de acuerdo con el correo electrónico para notificaciones? <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></></label>
                  <select id="todosCamposCorrectos" value={formData.todosCamposCorrectos} onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option value="true">Si</option>
                    <option value="false">No</option>
                  </select>
                </div>

                {formData.todosCamposCorrectos === "false" && (
                  <InputField label="Todas las notificaciones de este sistema serán remitidas a este correo electrónico, en caso de que requiera actualizarse, favor de dirigirse a la Coordinación de Personal de su dependencia de adscripción" id="textoAclarativo" value={formData.textoAclarativo} onChange={handleChange} styles={styles} />
                )}
                {/*formData.todosCamposCorrectos === "true" && (
                  <InputField label={<>Correo Electrónico Proesde<span className={styles.tooltipIcon}></span></>} id="correoProesde" value={formData.correoProesde ?? ""} readOnly onChange={handleChange} type="email" styles={styles} />
                )*/}
                <InputField label="Teléfono" id="telefono" value={formData.telefono} readOnly type="tel" styles={styles} />

               {/* <InputField label={<>Ext. <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="ext" value={formData.ext} onChange={handleChange} styles={styles} />*/}
                <div className={styles.inputContainer}>
                  <label htmlFor="ext">{<>Ext. <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span> <span className={styles.tooltipIcon}><FontAwesomeIcon icon={faQuestionCircle} /><span className={styles.tooltipText}>Máximo 8 caracteres</span></span> </>}</label>
                  <input
                    id="ext"
                    type="text"
                    value={formData.ext}
                    onChange={handleChange} 
                    maxLength={8}
                  />
                </div>
                <InputField label="Teléfono Móvil" id="telefonoMovil" value={formData.telefonoMovil} onChange={handleChange} type="tel" styles={styles} />
                <InputField label="Nacionalidad" id="nacionalidad" value={formData.nacionalidad} readOnly type="text" styles={styles} />
                <InputField label={<>Entidad Federativa  <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="entidadFederativa" value={formData.entidadFederativa} onChange={handleChange} styles={styles} />
              </div>
            </form>
            <h2 className={styles.titulo}> Datos de nombramiento o contrato actual </h2>
            <form className={styles.form} id="informacionAcademicaForm">
              <div className={styles.form_data}>
                {/*<ConditionalSelectOrInput label="Nombramiento" id="nombramiento" value={formData.nombramiento} options={nombramientos} propertyName={"nombramiento"} onChange={handleChange} styles={styles} />*/}
                <div className={styles.inputContainer}>
                  <label htmlFor="nombramiento"><>Nombramiento  </></label>
                  {nombramientos && nombramientos.length === 1 ? (
                    <input
                      type="text"
                      id="nombramiento"
                      value={nombramientos[0].nombramiento?.toUpperCase()}
                      readOnly
                    />

                  ) : (
                    <select id="nombramiento" value={formData.nombramiento} onChange={handleChange} >
                      <option value="">Seleccione</option>
                      {nombramientos && nombramientos.length > 0 &&
                        nombramientos.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.nombramiento?.toUpperCase()}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                {/*<InputField label="Nivel Educativo" id="nivelEducativo" value={formData.nivelEducativo.nombre} readOnly styles={styles} />*/}
                <div className={styles.inputContainer}>
                  <label htmlFor="dependencia"><>Dependencia</></label>
                  {dependencias && dependencias.length === 1 ? (
                    <input
                      type="text"
                      id="dependencia"
                      value={dependencias[0].dependencia}
                      readOnly
                    />

                  ) : (
                    <select id="dependencia" value={formData.dependencia} onChange={handleChange} >
                      <option value="">Seleccione</option>
                      {dependencias && dependencias.length > 0 &&
                        dependencias.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.dependencia}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                {/*<ConditionalSelectOrInput label="Departamento" id="departamento" value={formData.departamento} options={departamentos} propertyName={""} onChange={handleChange} styles={styles} />*/}
                <div className={styles.inputContainer}>
                  <label htmlFor="departamento"><>Departamentos </></label>
                  {departamentos && departamentos.length === 1 ? (
                    <input
                      type="text"
                      id="departamento"
                      value={departamentos[0].departamento}
                      readOnly
                    />

                  ) : (
                    <select id="departamento" value={formData.departamento} onChange={handleChange} >
                      <option value="">Seleccione</option>
                      {departamentos && departamentos.length > 0 &&
                        departamentos.map((item) => (
                          <option key={item.id} value={item.departamento}>
                            {item.departamento}
                          </option>
                        ))}
                    </select>
                  )}
                </div>

                {/*<InputField label="Nombre del Jefe del Departamento" id="nombreJefeDepto" value={formData.nombreJefeDepto} onChange={handleChange} styles={styles} />*/}
                <div className={styles.inputContainer}>
                  <label htmlFor="nombreJefeDepto">
                    <>{sexo === 'F' ? 'Jefa de Departamento' : 'Jefe de Departamento'}</>
                  </label>
                  {jefes && jefes.length === 1 ? (
                    <input
                      type="text"
                      id="nombreJefeDepto"
                      value={jefes[0].jefe}
                      readOnly
                    />

                  ) : (
                    <select id="nombreJefeDepto" value={formData.nombreJefeDepto} onChange={handleChange} >
                      <option value="">Seleccione</option>
                      {jefes && jefes.length > 0 &&
                        jefes.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.jefe}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                {/*<InputField label="Municipio" id="municipio" value={formData.municipio} onChange={handleChange} styles={styles} />*/}
                <SelectField label={<>Municipio  <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="municipio" value={formData.municipio} onChange={handleChange} options={municipios} propertyName={"municipio"} styles={styles} />
                <InputField label="Fecha de Ingreso" id="fechaDeIngreso" value={formData.fechaDeIngreso} readOnly styles={styles} />
                <InputField label="Antigüedad" id="antiguedad" value={formData.antiguedad} readOnly styles={styles} />
                <div className={styles.inputContainer}>
                  <label htmlFor={"PuestoDirectivo"}>Puesto Directivo</label>
                  <input
                    id="PuestoDirectivo"
                    type="text"
                    value={formData.PuestoDirectivo === false ? "No Aplica" : "Si Aplica"}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
            </form>
            {/*Carga Global*/}
            <div className={styles.datosNombramiento}>
              <TablaCargaHoraria />
            </div>

            {error && (
              <p className={styles.error}>{error}</p> // Mostrar mensaje de error general
            )
            }

            {/* SELECCIONAR LA MODALIDAD POR LA CUAL DESEA PARTICIPAR */}
            {/*isVisible && (
              <ModalidadEvaluacion />
            )*/}


            <div className={styles.submit}>
              <button className={`${styles.btn} ${styles.enviar}`} type="submit" onClick={handleSubmit} >
                Guardar
                <span className={styles.iconContainer}>
                  <FontAwesomeIcon icon={faFloppyDisk} className={styles.customIcon} />
                </span>
              </button>
              <button className={`${styles.btn} ${styles.cancelar}`} type="button" onClick={handleCancel} >
                Cancelar
              </button>
            </div>
          </div>
        </>


      </div >

    </>
  );
};