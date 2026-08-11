import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchStore } from "../store/useSearchStore";
import "./styles/FormModal.css";

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Concatenar el contexto y el servicio/recurso
const API_URL_DEPENDENCIAS = `${API_BASE_URL}/api/v1/dependencia/admingral`;
const API_URL_GRADOS = `${API_BASE_URL}/api/v1/grado/all`;
const API_URL_CRITERIO_BUSQUEDA = `${API_BASE_URL}/api/v1/criterio-busqueda/all`;
const API_URL_MUNICIPIOS = `${API_BASE_URL}/api/v1/dependencia/municipio/all`;
const API_URL_PARTICIPACION = `${API_BASE_URL}/api/v1/tipo-participacion/all`;
const API_URL_SEARCH = `${API_BASE_URL}/api/v1/solicitud/lista`;
const API_URL_ESTADO_SOLICITUD = `${API_BASE_URL}/api/v1/expediente/catalogos/estados-solicitud`;

function addSpacesToCamelCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/Ã¡/g, "á")
    .toLowerCase();
}

const sortPaginadoDesc = (paginadoArray) => {
  return [...paginadoArray].sort((a, b) => b - a);
};

const FormModal = ({ show, onHide, aliasActividad }) => {
  const { formData, setFormData, clearFormData } = useSearchStore((state) => ({
    formData: state.formData,
    setFormData: state.setFormData,
    clearFormData: state.clearFormData,
  }));

  const [dependencias, setDependencias] = useState([]);
  const [estadosSolicitud, setEstadosSolicitud] = useState([]);
  const [grados, setGrados] = useState([]);
  const [apellidoMaternoCondicion, setApellidoMaternoCondicion] = useState([]);
  const [apellidoPaternoCondicion, setApellidoPaternoCondicion] = useState([]);
  const [nombreCondicion, setnombreCondicion] = useState([]);
  const [detalleConcursanteCondicion, setDetalleConcursanteCondicion] = useState([]);
  const [paginadoCondicion, setPaginadoCondicion] = useState([]);
  const [ordenarPorCondicion, setOrdenarPorCondicion] = useState([]);
  const [codigoCondicion, setCodigoCondicion] = useState([]);
  const [tipoOrdenCondicion, setTipoOrdenCondicion] = useState(["asc"]);
  const [municipios, setMunicipios] = useState([]);
  const [participaciones, setParticipaciones] = useState([]);
  const userRol = localStorage.getItem("rol");
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_PARTICIPACION, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setParticipaciones(response.data);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_MUNICIPIOS, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setMunicipios(response.data.municipios);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_CRITERIO_BUSQUEDA, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const {
          apellidoMaternoCondicion,
          apellidoPaternoCondicion,
          nombreCondicion,
          detalleConcursanteCondicion,
          paginadoCondicion,
          ordenarPorCondicion,
          codigoCondicion,
          tipoOrdenCondicion,
        } = response.data.criterios;
        console.log("criterios", response.data.criterios);

        setApellidoMaternoCondicion(apellidoMaternoCondicion);
        setApellidoPaternoCondicion(apellidoPaternoCondicion);
        setnombreCondicion(nombreCondicion);
        setDetalleConcursanteCondicion(detalleConcursanteCondicion);
        setPaginadoCondicion(paginadoCondicion);
        setOrdenarPorCondicion(ordenarPorCondicion);
        setCodigoCondicion(codigoCondicion);
        setTipoOrdenCondicion(tipoOrdenCondicion);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_GRADOS, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setGrados(response.data);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_ESTADO_SOLICITUD, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setEstadosSolicitud(response.data);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_DEPENDENCIAS, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("response.data", response.data);
        setDependencias(response.data.dependenciasADMINGRAL);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si el campo es 'codigo', solo permitir números
    if (name === "codigo") {
      // Filtrar solo los dígitos
      const onlyNumbers = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: onlyNumbers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("accessToken");
    const criterios = {};

    if (formData.mostrar) criterios.paginadoCondicion = formData.mostrar;
    if (formData.codigo) criterios.codigo = formData.codigo;
    if (formData.codigo) criterios.codigoCondicion = "igual";
    if (formData.apellidoMaternoInput) criterios.apellidoMaternoCondicion = formData.apellidoMaterno;
    if (formData.apellidoMaternoInput) criterios.apellidoMaterno = formData.apellidoMaternoInput;
    if (formData.apellidoPaternoInput) criterios.apellidoPaternoCondicion = formData.apellidoPaterno;
    if (formData.apellidoPaternoInput) criterios.apellidoPaterno = formData.apellidoPaternoInput;
    if (formData.nombreInput) criterios.nombreCondicion = formData.nombre;
    if (formData.nombreInput) criterios.nombre = formData.nombreInput;
    if (formData.grado) criterios.idGrado = formData.grado;
    if (formData.dependencia) criterios.idDependencia = formData.dependencia;
    if (formData.nombramiento) criterios.idNombramiento = formData.nombramiento;
    console.log("formData.municipio", formData.municipio);
    if (formData.municipio) criterios.municipio = formData.municipio;
    if (formData.tipoDeParticipacion) criterios.idTipoParticipacion = formData.tipoDeParticipacion;
    if (formData.concursante && formData.concursante !== "Todos")
      criterios.detalleConcursanteCondicion = formData.concursante;
    if (formData.deManera) {
      criterios.tipoOrdenCondicion = formData.deManera;
    }

    const data = {
      "pagina": 0,
      "paginadoCondicion": 7,
      "status": (aliasActividad === "inconformidad" || aliasActividad === "inconformidades" || aliasActividad === "lista_inconformidades") ? 6 : formData.idStatusSolicitud,
      "criterios": criterios,
      "orden": "ASC",
      "campoOrden": "nombre"
    }

    const body = { ...data };
    console.log("body ", body);
    try {
      useSearchStore.getState().setLoading(true);
      useSearchStore.getState().setHasSearched(true);
      useSearchStore.getState().setLastSearchBody(body);

      const response = await axios.post(API_URL_SEARCH, body, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response)

      if (response.data) {
        console.log("Storing academicos data", response.data);
        useSearchStore.getState().setAcademicos(response.data.content);
        useSearchStore.getState().setPaginationRecords(response.data);
      }
    } catch (error) {
      console.error("Error making POST request:", error);
      useSearchStore.getState().setLoading(false);
    }
  };

  const handleReset = () => {
    clearFormData();
  };

  if (!show) return null;

  console.log("estadosSolicitud", estadosSolicitud);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Búsqueda Avanzada</h2>
            <button className="close-button" onClick={onHide}>
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-header">
              <p className="p-style">Filtros (Deje Vacío para no aplicar el filtro)</p>
            </div>
          
            {userRol === "secretaria_admin_sems" || userRol === "admin_convocatoria" ? (
            <div className="form-group">
              <label>Dependencia</label>
              <select name="dependencia" onChange={handleChange} value={formData.dependencia || ""}>
                  <option value="">Todas</option>
                  {Array.isArray(dependencias) && dependencias.length > 0 ? (
                    dependencias.map((dependencia) => (
                      <option key={dependencia.id} value={dependencia.id}>
                        {dependencia.dependencia}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Dependencias en formato incorrecto
                    </option>
                  )}
                </select>
              </div>
            ) : (
              <></>
            )}

            {(aliasActividad !== "inconformidad" && aliasActividad !== "inconformidades" && aliasActividad !== "lista_inconformidades") && (
              <div className="form-group">
                <label>Estatus</label>
                <select name="idStatusSolicitud" onChange={handleChange} value={formData.idStatusSolicitud || ""}>
                  <option value="">Todos</option>
                  {estadosSolicitud?.map((estado, index) => (
                    <option key={index} value={estado.id}>
                      {estado.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Código</label>
              <input type="text" name="codigo" onChange={handleChange} value={formData.codigo || ""} />
            </div>

            
            <div className="form-group">
              <label>Apellido Paterno</label>
              <div className="input-group">
                <select
                  name="apellidoPaterno"
                  onChange={handleChange}
                  value={formData.apellidoPaterno || ""}
                  className="fixed-width-select"
                >
                  {apellidoPaternoCondicion.map((apellido, index) => (
                    <option key={index} value={apellido}>
                      {addSpacesToCamelCase(apellido)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="apellidoPaternoInput"
                  placeholder="Apellido paterno"
                  onChange={handleChange}
                  value={formData.apellidoPaternoInput || ""}
                  className="fixed-width-input"
                />
              </div>
            </div>

            
            <div className="form-group">
              <label>Apellido Materno</label>
              <div className="input-group">
                <select
                  name="apellidoMaterno"
                  onChange={handleChange}
                  value={formData.apellidoMaterno || ""}
                  className="fixed-width-select"
                >
                  {apellidoMaternoCondicion.map((apellido, index) => (
                    <option key={index} value={apellido}>
                      {addSpacesToCamelCase(apellido)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="apellidoMaternoInput"
                  placeholder="Apellido materno"
                  onChange={handleChange}
                  value={formData.apellidoMaternoInput || ""}
                  className="fixed-width-input"
                />
              </div>
            </div>

          
            <div className="form-group">
              <label>Nombre(s)</label>
              <div className="input-group">
                <select name="nombre" onChange={handleChange} value={formData.nombre || ""} className="fixed-width-select">
                  {nombreCondicion.map((nombre, index) => (
                    <option key={index} value={nombre}>
                      {addSpacesToCamelCase(nombre)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="nombreInput"
                  placeholder="Ingrese nombre(s)"
                  onChange={handleChange}
                  value={formData.nombreInput || ""}
                  className="fixed-width-input"
                />
              </div>
            </div>

    
            <div className="form-group">
              <label>Grado</label>
              <select name="grado" onChange={handleChange} value={formData.grado || ""}>
                <option value="">Todos</option>
                {grados.map((grado) => (
                  <option key={grado.index} value={grado.id}>
                    {grado.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Municipio</label>
              <select name="municipio" onChange={handleChange} value={formData.municipio || ""}>
                <option value="">Todos</option>
                {municipios.map((municipio, index) => (
                  <option key={index} value={municipio}>
                    {municipio}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tipo de Participación</label>
              <select name="tipoDeParticipacion" onChange={handleChange} value={formData.tipoDeParticipacion || ""}>
                <option value="">Todos</option>
                {participaciones.map((participacion) => (
                  <option key={participacion.id} value={participacion.id}>
                    {participacion.desciptcion}
                  </option>
                ))}
              </select>
            </div>

      
            <div className="form-group">
              <label>Concursante</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="concursante"
                    value="Todos"
                    checked={formData.concursante === "Todos" || formData.concursante === null}
                    onChange={handleChange}
                  />
                  Todos
                </label>

                {detalleConcursanteCondicion.map((concursante, index) => (
                  <label key={index}>
                    <input
                      type="radio"
                      name="concursante"
                      value={concursante}
                      checked={formData.concursante === concursante}
                      onChange={handleChange}
                    />
                    {concursante === "si" ? "Solo concursantes" : "Solo no concursantes"}
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-header">
              <p className="p-style">
                Orden (Ascendente significa del registro más antiguo o menor al más reciente o mayor)
              </p>
            </div>
        
            <div className="form-group">
              <label>Por</label>
              <select name="por" onChange={handleChange} value={formData.por || ""}>
                <option value="">defecto</option>
                {ordenarPorCondicion.map((por, index) => (
                  <option key={index} value={por}>
                    {addSpacesToCamelCase(por)}
                  </option>
                ))}
              </select>
            </div>

    
            <div className="form-group">
              <label>De manera</label>
              <div className="radio-group">
                {tipoOrdenCondicion.map((orden, index) => (
                  <label key={index}>
                    <input
                      type="radio"
                      name="deManera"
                      value={orden}
                      checked={formData.deManera === orden}
                      onChange={handleChange}
                    />
                    {orden === "asc" ? "Ascendente" : "Descendente"}
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-header">
              <p className="p-style">Opciones de paginado</p>
            </div>
            
            <div className="form-group">
              <label>Mostrar Por Paginación</label>
              <select name="mostrar" onChange={handleChange} value={formData.mostrar || ""}>
                <option value="" disabled>
                  Seleccione una opción
                </option>
                {sortPaginadoDesc(paginadoCondicion).map((paginado, index) => (
                  <option key={index} value={paginado}>
                    {paginado}
                  </option>
                ))}
              </select>
            </div>

          
            <div className="modal-footer">
              <button type="button" className="button submit-button" onClick={onHide}>
                Cerrar
              </button>
              <button type="button" className="button submit-button" onClick={handleReset}>
                Borrar
              </button>

              <button type="submit" className="button submit-button">
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
