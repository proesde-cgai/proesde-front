import React, { useEffect, useState, useCallback } from "react";
import { Footer, Header } from "../../layout/components";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import { Evaluar } from "../../administracion/components/Evaluar";
import { InconformidadPage } from "../../inconformidad";

import {
  solicitudComisiones,
  solicitudCargo,
  solicitudMiembros,
  guardarComision,
} from "../../../features/miembrosService";
import dotsIcon from "../../../assets/images/dots.png";
import "./CommissionForm.css";
import { ActivarInactivarSolicitud } from "../../administracion/components/ActivarInactivarSolicitud";

const CommissionForm = () => {
  const [selectedCommission, setSelectedCommission] = useState("12000");
  const [selectedCommissionName, setSelectedCommissionName] = useState("");
  const [commissions, setCommissions] = useState({});
  const [cargos, setCargos] = useState({});
  const [isDeIngreso, setIsDeIngreso] = useState(false);
  const [idCommissionDefault, setIdCommissionDefault] = useState("ADMGRAL");
  const [miembros, setMiembros] = useState([]);
  const [newMembers, setNewMembers] = useState([]);

  const handleNewMemberChange = (e, index) => {
    const updatedNewMembers = [...newMembers];
    updatedNewMembers[index] = {
      ...updatedNewMembers[index],
      [e.target.name]: e.target.value,
    };
    setNewMembers(updatedNewMembers);
  };

  const handleAddMemberForm = () => {
    setNewMembers([
      ...newMembers,
      {
        idCargo: "",
        tratamiento: "",
        nombre: "",
        codigo: "",
        departamento: "",
      },
    ]);
  };

  const handleCargoChange = (index, newCargo) => {
    const updatedMiembros = [...miembros];
    updatedMiembros[index].idCargo = newCargo;
    setMiembros(updatedMiembros);
  };

  const getMiembros = useCallback(async () => {
    try {
      const miembrosData = await solicitudMiembros(selectedCommission);
      setMiembros(
        Array.isArray(miembrosData.miembros) ? miembrosData.miembros : []
      );
    } catch (error) {
      console.error("Error al buscar miembros:", error.message);
      setMiembros([]);
    }
  }, [selectedCommission]);

  const getComisiones = async () => {
    try {
      const comisiones = await solicitudComisiones();
      setCommissions(comisiones);
    } catch (error) {
      console.error("Error al buscar comisiones:", error.message);
    }
  };

  const getCargos = async () => {
    try {
      const cargos = await solicitudCargo();
      setCargos(cargos);
    } catch (error) {
      console.error("Error al buscar cargos:", error.message);
    }
  };

  const handleCommissionChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCommission(selectedId);
    let commissionName = "";

    Object.entries(commissions).forEach(([group, types]) => {
      if (Array.isArray(types)) {
        const selectedCommissionObject = types.find(
          (type) => String(type.id) === String(selectedId)
        );
        if (selectedCommissionObject) {
          commissionName = selectedCommissionObject.siglas;
          setSelectedCommissionName(commissionName);
        }
      }
    });
  };

  useEffect(() => {
    getComisiones();
    getCargos();
  }, []);

  useEffect(() => {
    getMiembros();
  }, [getMiembros]);

  const handleSave = async () => {
    try {
      const allMembers = [...miembros, ...newMembers];

      if (allMembers.length === 0) {
        console.error("No hay miembros para guardar.");
        return;
      }

      const result = await guardarComision(selectedCommission, allMembers);
      console.log("Datos guardados con éxito:", result);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  const menu = useMenu(
    [
      { label: "Página Principal", element: <p>Página principal</p> },
      { label: "Programas", element: <p>Programas</p> },
      { label: "Inconformidad", element: <InconformidadPage /> },
      { label: "Evaluación", element: <Evaluar /> },
      { label: "Reportes", element: <p>Reportes</p> },
      {
        label: "Activar / Inactivar solicitud",
        element: <ActivarInactivarSolicitud />,
      },
      { label: "Generar inconformidad", element: <p>Generar inconformidad</p> },
      { label: "Administración", element: <p>Administracion</p> },
    ],
    { selectedValue: "Desempeño docente", isVertical: false }
  );

  return (
    <div>
      <Header />
      <Menu menu={menu} />

      <div className="main-container">
        <div className="left-section">
          <h2 className="comision_label">
            <img src={dotsIcon} alt="dots-icon" className="dots_commition" />
            <div>
              <label htmlFor="commission-select">Seleccione la comisión:</label>
            </div>
          </h2>

          <div style={{ marginLeft: "10px" }}>
            <label htmlFor="ingreso">De Ingreso</label>
            <input
              type="checkbox"
              id="ingreso"
              checked={isDeIngreso}
              onChange={(e) => setIsDeIngreso(e.target.checked)}
            />
          </div>

          <select
            id="commission-select"
            className="commission-select"
            value={selectedCommission}
            onChange={handleCommissionChange}
          >
            {isDeIngreso && <option value="INGRESO">De Ingreso</option>}

            {Object.entries(commissions).map(([group, types]) => (
              <optgroup key={group} label={group}>
                {Array.isArray(types) &&
                  types
                    .filter((type) => type.siglas !== idCommissionDefault)
                    .map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.siglas}
                      </option>
                    ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="right-section">
          <div className="colorRed">
            {">"} Cambie los valores que desee actualizar y después asegúrese de
            oprimir el botón "Guardar".
          </div>
          <h3>
            <img src={dotsIcon} alt="dots-icon" className="dots_list" />
            Lista de miembros de comisión
          </h3>
          <div>Total de miembros {miembros.length}</div>
          <div className="table_label">
            {">"}Comisión Especial Dictaminadora, {selectedCommissionName}:
          </div>
          <table className="members-table">
            <thead>
              <tr>
                <th className="members-table-header-column">Cargo</th>
                <th className="members-table-header-column">Tratamiento</th>
                <th className="members-table-header-column">Nombre</th>
                <th className="members-table-header-column">Código</th>
                <th className="members-table-header-column">Departamento</th>
              </tr>
            </thead>
            <tbody>
              {miembros.length > 0 ? (
                miembros.map((miembro, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>
                      <select
                        value={miembro.idCargo}
                        onChange={(e) =>
                          handleCargoChange(index, e.target.value)
                        }
                        className="table_select"
                      >
                        {Object.entries(cargos).map(
                          ([cargoKey, cargoValue]) => (
                            <option key={cargoKey} value={cargoKey}>
                              {cargoValue.descripcion}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td>{miembro.tratamiento}</td>
                    <td>{miembro.nombre}</td>
                    <td>{miembro.codigo}</td>
                    <td>{miembro.departamento}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No hay miembros en esta comisión
                  </td>
                </tr>
              )}

              {/* Crear nuevos miembros */}
              {newMembers.map((member, index) => (
                <tr key={index + "new"}>
                  <td>
                    <select
                      name="idCargo"
                      value={member.idCargo}
                      onChange={(e) => handleNewMemberChange(e, index)}
                      className="table_select"
                    >
                      <option value="">Seleccionar Cargo</option>
                      {Object.entries(cargos).map(([cargoKey, cargoValue]) => (
                        <option key={cargoKey} value={cargoKey}>
                          {cargoValue.descripcion}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="tratamiento"
                      value={member.tratamiento}
                      onChange={(e) => handleNewMemberChange(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="nombre"
                      value={member.nombre}
                      onChange={(e) => handleNewMemberChange(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="codigo"
                      value={member.codigo}
                      onChange={(e) => handleNewMemberChange(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="departamento"
                      value={member.departamento}
                      onChange={(e) => handleNewMemberChange(e, index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="actions">
            <button className="btn-secondary" onClick={handleSave}>
              Guardar
            </button>
            <button className="btn-secondary" onClick={handleAddMemberForm}>
              Agregar
            </button>
            <button className="btn-secondary">Cancelar</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommissionForm;
