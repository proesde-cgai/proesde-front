import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchStore } from "../../../store/useSearchStore";
import "../../../reutilizable/styles/FormModal.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_DEPENDENCIAS = `${API_BASE_URL}/api/v1/dependencia/admingral`;
const API_URL_CRITERIO_BUSQUEDA = `${API_BASE_URL}/api/v1/criterio-busqueda/all`;
const API_URL_PARTICIPACION = `${API_BASE_URL}/api/v1/tipo-participacion/all`;

function addSpacesToCamelCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/Ã¡/g, "á")
    .toLowerCase();
}

const AdvancedSearchModal = ({ show, onHide, baseList = [], onApply }) => {
  const { formData, setFormData, clearFormData, loading } = useSearchStore((state) => ({
    formData: state.formData,
    setFormData: state.setFormData,
    clearFormData: state.clearFormData,
    loading: state.loading,
  }));

  const [dependencias, setDependencias] = useState([]);
  const [apellidoPaternoCondicion, setApellidoPaternoCondicion] = useState([]);
  const [nombreCondicion, setnombreCondicion] = useState([]);
  const [participaciones, setParticipaciones] = useState([]);
  const [apellidoMaternoCondicion, setApellidoMaternoCondicion] = useState([]);
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
      .get(API_URL_CRITERIO_BUSQUEDA, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const { apellidoPaternoCondicion, nombreCondicion } = response.data.criterios;
        setApellidoPaternoCondicion(apellidoPaternoCondicion);
        setApellidoMaternoCondicion(apellidoPaternoCondicion);
        setnombreCondicion(nombreCondicion);
      })
      .catch((error) => console.error("Error fetching criterios: ", error));
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
        setDependencias(response.data.dependenciasADMINGRAL);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "codigo") {
      const onlyNumbers = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: onlyNumbers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const criteria = {};
    if (formData.codigo) criteria.codigo = formData.codigo;

    if (formData.apellidoPaternoInput) {
      const condicion = formData.apellidoPaterno || apellidoPaternoCondicion[0] || "contiene";
      if (condicion === "noContiene") {
        criteria.apellidoPaternoExcluye = formData.apellidoPaternoInput;
      } else {
        criteria.apellidoPaterno = formData.apellidoPaternoInput;
      }
    }

    if (formData.apellidoMaternoInput) {
      const condicion = formData.apellidoMaterno || apellidoMaternoCondicion[0] || "contiene";
      if (condicion === "noContiene") {
        criteria.apellidoMaternoExcluye = formData.apellidoMaternoInput;
      } else {
        criteria.apellidoMaterno = formData.apellidoMaternoInput;
      }
    }

    if (formData.nombreInput) {
      const condicion = formData.nombre || nombreCondicion[0] || "contiene";
      if (condicion === "noContiene") {
        criteria.nombreExcluye = formData.nombreInput;
      } else {
        criteria.nombre = formData.nombreInput;
      }
    }
    if (formData.dependencia) criteria.idDependencia = formData.dependencia;
    if (formData.tipoDeParticipacion) criteria.idTipoParticipacion = formData.tipoDeParticipacion;

    if (onApply) {
      onApply(criteria);
    }
  };

  const handleReset = () => {
    clearFormData();
  };

  if (!show) return null;

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
              <p className="p-style">
                Filtros (Deje Vacío para no aplicar el filtro)
              </p>
            </div>

            {userRol === "secretaria_admin_sems" ||
            userRol === "admin_convocatoria" ? (
              <div className="form-group">
                <label>Dependencia</label>
                <select
                  name="dependencia"
                  onChange={handleChange}
                  value={formData.dependencia || ""}
                >
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
            ) : null}

            <div className="form-group">
              <label>Código</label>
              <input
                type="text"
                name="codigo"
                onChange={handleChange}
                value={formData.codigo || ""}
              />
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
                  {apellidoMaternoCondicion.map((cond, index) => (
                    <option key={index} value={cond}>
                      {addSpacesToCamelCase(cond)}
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
                <select
                  name="nombre"
                  onChange={handleChange}
                  value={formData.nombre || ""}
                  className="fixed-width-select"
                >
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
              <label>Tipo de Participación</label>
              <select
                name="tipoDeParticipacion"
                onChange={handleChange}
                value={formData.tipoDeParticipacion || ""}
              >
                <option value="">Todos</option>
                {participaciones.map((participacion) => (
                  <option key={participacion.id} value={participacion.id}>
                    {participacion.desciptcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="button submit-button"
                onClick={onHide}
              >
                Cerrar
              </button>
              <button
                type="button"
                className="button submit-button"
                onClick={handleReset}
              >
                Borrar
              </button>

              <button type="submit" className="button submit-button" disabled={loading}>
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchModal;

