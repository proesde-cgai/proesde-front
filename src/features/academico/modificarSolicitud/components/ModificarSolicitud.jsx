import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import styles from "./ModificarSolicitud.module.css";
import InputField from "../../../../reutilizable/InputField";
import SelectField from "../../../../reutilizable/SelectField";
import Alert from "../../../../reutilizable/Alert";
import useStoredFecha from "../../../useStoredFecha";
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
const API_URL_PRELLENADO = `${API_BASE_URL}/api/v1/solicitud/activa`;
const API_URL_SOLICITUD = `${API_BASE_URL}/api/v1/solicitud`;
const API_URL_PROGRAMAS_EDUCATIVOS = `${API_BASE_URL}/api/v1/programa-educativo/all`;
const API_URL_MUNICIPIOS = `${API_BASE_URL}/api/v1/municipio/all`;

export const ModificarSolicitud = () => {
    const initialState = {
        id: null,
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
        correoProesde: "",
        telefono: "",
        telefonoMovil: "",
        nacionalidad: "",
        entidadFederativa: "",
        nombramiento: null,
        dependencia: "",
        municipio: null,
        fechaDeIngreso: null,
        antiguedad: null,
        PuestoDirectivo: "",
        areaConocimiento: null,
        departamento: "",
        nombreJefeDepto: "",
        // cetro: "",
        // tipoPuesto: null,
        textoAclarativo: "",
        todosCamposCorrectos: "",
        cargaGlobal: [],
        nivelEducativo: {},
        horasFrenteAlGrupo: null,

    };
    const { fetchCargaGlobal, } = useCargaHorariaStore();
    const fecha = useStoredFecha();
    const displayDate = fecha?.rangoFecha || "2024-2025";

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
    const [isVisible, setIsVisible] = useState(false);
    const [jefes, setJefes] = useState([])
    const [sexo, setSexo] = useState();
    const [idTipoParticipacion, setIdTipoParticipacion] = useState()


    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        axios
            .get(API_URL_MUNICIPIOS, {
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                const sortedMunicipios = response.data.sort((a, b) =>
                    a.municipio.localeCompare(b.municipio, 'es', { sensitivity: 'base' })
                );
                setMunicipios(sortedMunicipios);
            })
            .catch(error => console.error("Error fetching municipios: ", error));
    }, []);


    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        axios.get(API_URL_GRADO, {
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                setGrados(response.data)
            })
            .catch(error => console.error("Error fetching grados: ", error))
    }, [])



    useState(() => {
        const token = localStorage.getItem('accessToken');

        axios.get(API_URL_PRELLENADO, {
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const data = response.data;
                const sortedCargaGlobal = (data.cargaGlobal || []).sort((a, b) => {
                    const order = ['BACHILLERATO', 'LICENCIATURA', 'POSGRADO'];
                    return order.indexOf(a.nivel) - order.indexOf(b.nivel);
                });
                // Set form data with the pre-filled values
                console.log("pesto en prellando ", data.directivo)
                setSexo(data.generoJefe)
                setIdTipoParticipacion(data.idTipoParticipacion)

                setFormData({
                    ...initialState,
                    id: data.id || null,
                    codigo: data.codigo || null,
                    nombre: data.nombre || "",
                    apellidoPaterno: data.apellidoPaterno || "",
                    apellidoMaterno: data.apellidoMaterno,
                    rfc: data.datosSep.rfc || "",
                    CURP: data.curp || "",
                    ultimogrado: data.grado || null,
                    nombreUltimoGradoEstudios: data.nombrePosgrado || "",
                    institucionOtorgante: data.institucionOtorgante || "",
                    correo: data.email || "",
                    correoProesde: data.emailProesde || "",
                    telefono: data.telefono || "",
                    ext: data.ext || "",
                    telefonoMovil: data.movil || "",
                    nacionalidad: data.nacionalidad || "",
                    entidadFederativa: data.estadonac || "",
                    dependencia: data.dependencia || "",
                    municipio: data.municipio || null,
                    fechaDeIngreso: data.fechaIngresoFormato || null,
                    antiguedad: data.antiguedad || null,
                    PuestoDirectivo: data.directivo,
                    areaConocimiento: data.datosSep.idAreaConocimiento || null,
                    departamento: data.departamento || "",
                    nombreJefeDepto: data.nombreJefeDepto || "",
                    cargaGlobal: sortedCargaGlobal,
                    nivelEducativo: data.datosSep.nivelEducativo || {},
                    todosCamposCorrectos: "",
                    nombramiento: data.nombramiento.id,
                    textoAclarativo: "",
                    horasFrenteAlGrupo: data.horasFrenteGrupo
                });
                fetchCargaGlobal(data.codigo || null);

                setTotal(data.cargaGlobal.reduce((total, item) => {
                    return total + parseFloat(item.cargaHoraria || 0);
                }, 0))

                if (!data.datosSep.idAreaConocimiento) setAreaEditable(true)
            })
            .catch(error => {
                const status = error?.response?.status || 400;

                if (status === 401) {
                    setError("Usuario no autorizado")
                } else if (status === 403) {
                    setError("Convocatoria no valida")
                }
            })
    }, [])




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
    useState(() => {
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
    useState(() => {
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
    /* useEffect(() => {
         if (nombramientos && nombramientos.length === 1) {
             setFormData((prevData) => ({
                 ...prevData,
                 nombramiento: nombramientos[0].id,
             }));
         }
     }, [nombramientos]);*/



    //dependencias
    useState(() => {
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
                const result = departamentos.map((departamento, index) => ({
                    id: index + 1,
                    departamento: departamento
                }));
                const resultJefes = jefesDepartamento.map((jefe, index) => ({
                    id: index + 1,
                    jefe: jefe
                }));
                setJefes(resultJefes)
                setDepartamentos(result)
                setDependencias(dependencias)

            })
            .catch(error => console.error("Error fetching dependencias: ", error))
    }, [])

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


    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Validar campos
    const validateFields = () => {
        let hasError = [];

        Object.keys(formData).forEach((key) => {
            if (
                key !== "textoAclarativo" &&
                key !== "ext" &&
                key !== "apellidoMaterno" &&
                key !== "correoProesde" && // Exclude correoProesde from validation
                (formData[key] === "" ||
                    formData[key] === null ||
                    formData[key] === undefined)
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
        const hasError = validateFields();
        if (hasError.length > 0 || !formData.todosCamposCorrectos) {

            const formattedErrors = hasError.map(error =>
                error
                    .replace(/([a-z])([A-Z])/g, "$1 $2") // Separa palabras camelCase con espacios
                    .replace(/^\w/, c => c.toUpperCase()) // Capitaliza la primera letra
            );
            setError(`Todos los campos son obligatorios. Campos con error: ${formattedErrors.join(", ")}`);
        } else {
            setError("");
            let emailProesde = ""
            if(formData.textoAclarativo !== ""){
                emailProesde = formData.textoAclarativo
            }else if(formData.textoAclarativo === "" &&  formData.correoProesde !== "" ){
                emailProesde = formData.correoProesde
            }else{
                emailProesde = formData.correo
            }

            const requestData = {

                id: formData.id,
                datosSep: {
                    idAreaConocimiento: Number(formData.areaConocimiento),
                },
                idNombramiento: Number(formData.nombramiento),
                idMunicipio: Number(formData.municipio),
                idDependencia: Number(formData.dependencia),
                nombrePosgrado: formData.nombreUltimoGradoEstudios,
                institucionOtorgante: formData.institucionOtorgante,
                nombreJefeDepto: formData.nombreJefeDepto,
                ext: formData.ext,
                estadonac: formData.entidadFederativa,
                departamento: formData.departamento,
                email: emailProesde


            };

            const token = localStorage.getItem('accessToken');
            axios.put(API_URL_SOLICITUD, requestData, {
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    setIsVisible(!isVisible);
                    setFormData((prevData) => ({
                        ...prevData,
                        correoProesde: emailProesde
                    }));
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
        setError("");
        window.location.reload();
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

            <div className={styles.solicitudContainer}>
                <h2 className={styles.titulo}>PROGRAMA DE ESTIMULOS AL DESEMPEÑO DOCENTE {displayDate}</h2>
                <p> Revise que su información sea correcta antes de suscribir la solicitud.</p>

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
                            <InputField label={<>Nombre del último grado de estudios <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="nombreUltimoGradoEstudios" value={formData.nombreUltimoGradoEstudios} onChange={handleChange} styles={styles} />
                            <InputField label={<>Institución otorgante <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="institucionOtorgante" value={formData.institucionOtorgante} onChange={handleChange} styles={styles} />
                            <SelectField label={<>Área de conocimiento conforme a PRODEP <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="areaConocimiento" value={formData.areaConocimiento} onChange={handleChange} options={areas} propertyName={""} styles={styles} />
                            <InputField label={<>Correo Electrónico<span className={styles.tooltipIcon}><FontAwesomeIcon icon={faQuestionCircle} /><span className={styles.tooltipText} >la información aquí añadida es única y exclusivamente para seguimiento de su solicitud de PROESDE, para actualizar cualqueir dato de manera definitiva favor de dirigirse a la Coordinación de Personal de su dependencia de adscripción</span></span></>} readOnly id="correo" value={formData.correo} onChange={handleChange} type="email" styles={styles} />
                            <div className={styles.inputContainer}>
                                <label htmlFor="todosCamposCorrectos (Editable)"><>¿Estás de acuerdo con el correo electrónico para   notificaciones?  <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></></label>
                                <select id="todosCamposCorrectos" value={formData.todosCamposCorrectos} onChange={handleChange}>
                                    <option value="">Seleccione</option>
                                    <option value="true">Si</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                            {formData.todosCamposCorrectos === "false" && (
                                <InputField label={<>Todas las notificaciones de este sistema serán remitidas a este correo electrónico, en caso de que requiera actualizarse, favor de dirigirse a la Coordinación de Personal de su dependencia de adscripción. <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="textoAclarativo" value={formData.textoAclarativo} onChange={handleChange} styles={styles} />
                            )}
                            {formData.todosCamposCorrectos === "true" && (
                                <InputField label={<>Correo Electrónico Proesde<span className={styles.tooltipIcon}></span></>} readOnly id="correoProesde" value={formData.correoProesde ?? ""} onChange={handleChange} type="email" styles={styles} />
                            )}
                            <InputField label="Teléfono" id="telefono" value={formData.telefono} readOnly type="tel" styles={styles} />
                            {/*<InputField label={<>Ext. <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="ext" value={formData.ext} onChange={handleChange} styles={styles} />*/}
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
                            <InputField label="Teléfono Móvil" id="telefonoMovil" value={formData.telefonoMovil} readOnly type="tel" styles={styles} />
                            <InputField label="Nacionalidad" id="nacionalidad" value={formData.nacionalidad} readOnly type="text" styles={styles} />
                            <InputField label={<>Entidad Federativa  <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="entidadFederativa" value={formData.entidadFederativa} onChange={handleChange} styles={styles} />                 
                        </div>
                    </form>

                    <h2 className={styles.titulo}> Datos de nombramiento o contrato actual </h2>
                    <form className={styles.form} id="informacionAcademicaForm">
                        <div className={styles.form_data}>
                            {/*<ConditionalSelectOrInput label="Nombramiento" id="nombramiento" value={formData.nombramiento} options={nombramientos} propertyName={"nombramiento"} onChange={handleChange} styles={styles} />*/}
                            <div className={styles.inputContainer}>
                                <label htmlFor="nombramiento"><>Nombramiento</></label>
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
                                <label htmlFor="Dependencia"><>Dependencia</></label>
                                {dependencias && dependencias.length === 1 ? (
                                    <input
                                        type="text"
                                        id="nombramiento"
                                        value={dependencias[0].dependencia}
                                        readOnly
                                    />

                                ) : (
                                    <select id="dependencia" value={formData.dependencia?.id} onChange={handleChange} >
                                        <option value="">Select</option>
                                        {dependencias && dependencias.length > 0 &&
                                            dependencias.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.dependencia}
                                                </option>
                                            ))}
                                    </select>
                                )}
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="Departamento"><>Departamentos</></label>
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
                                                <option key={item.id} value={item.id}>
                                                    {item.departamento}
                                                </option>
                                            ))}
                                    </select>
                                )}
                            </div>
                            {/*<InputField label="Nombre del Jefe del Departamento" id="nombreJefeDepto" value={formData.nombreJefeDepto} onChange={handleChange} styles={styles} />*/}
                            <div className={styles.inputContainer}>
                                <label htmlFor="Nombre Jefe Departamento">
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
                            <SelectField label={<>Municipio  <span style={{ color: 'red', fontWeight: 'bold' }}>(editable)</span></>} id="municipio" value={formData.municipio?.id} onChange={handleChange} options={municipios} propertyName={"municipio"} styles={styles} />
                            <InputField label="Fecha de Ingreso" id="fechaDeIngreso" value={formData.fechaDeIngreso} readOnly styles={styles} />
                            <InputField label="Antigüedad" id="antiguedad" value={formData.antiguedad} readOnly styles={styles} />
                            <div className={styles.inputContainer}>
                                {console.log("Puesto directivo ", formData.PuestoDirectivo)}
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

                    {isVisible && (
                        <Alert typeAlert={'success'}>
                            <p>Se ha guardo con éxito</p>
                        </Alert>
                    )}

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
            </div>


        </>
    );
};