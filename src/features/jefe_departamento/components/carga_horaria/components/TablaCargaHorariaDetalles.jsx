import React, { useEffect, useState } from "react";
import styles from "../styles/TablaCargaHorariaDetalles.module.css";
import ModalDetailsCargaHoraria from "./ModalDetailsCargaHoraria";
import useGenerateOficios from "../hooks/useGenerateOficios";

const TablaCargaHorariaDetalles = ({
  currentItems,
  cicloDisponible,
  municipios,
  getSortIcon,
  handleSort,
  fetchMaterias,
  userInfo,
  fetchDocentes,
  selectedMunicipio,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const [editMode, setEditMode] = useState(new Array(currentItems.length).fill(false));
  const [noOficioValues, setNoOficioValues] = useState(currentItems.map((item) => item.noOficio || ""));
  const [changes, setChanges] = useState(new Array(currentItems.length).fill(false)); // Para trackear cambios
  const [processingIndex, setProcessingIndex] = useState(null); // Para trackear el índice de la fila en proceso

  const [hiddenButtons, setHiddenButtons] = useState(new Array(currentItems.length).fill(false)); // Para controlar los botones

  const { fetchAltaOficio, fetchConsultaOficio, fetchActualizarOficio, fetchEliminarOficio, isLoading } =
    useGenerateOficios();

  useEffect(() => {
    setNoOficioValues((prev) => {
      return currentItems.map((item, index) => {
        return changes[index] ? prev[index] : item.noOficio || "";
      });
    });
  }, [currentItems, changes]);

  const handleGenerarOActualizarPDF = async (materia, index) => {
    let materias = materia.materia && materia.materia.length > 0 ? materia.materia : [];
    if (materias.length === 0) {
      const dataMaterias = await fetchMaterias(materia.codigoProfesor, materia.idQr, materia.cicloEscolar);
      materias = dataMaterias.length > 0 ? dataMaterias : ["Sin asignatura"];
    }

    if (!noOficioValues[index] || !selectedMunicipio || materias.length === 0) {
      alert("Por favor, completa todos los datos requeridos antes de continuar.");
      return;
    }

    const payload = {
      idQr: materia.idQr,
      nombreProfesor: materia.nombreProfesor,
      codigoProfesor: materia.codigoProfesor,
      noOficio: noOficioValues[index],
      cicloEscolar: materia.cicloEscolar,
      ubicacion: selectedMunicipio,
      nombreJefe: materia.nombreJefe,
      cargoJefe: materia.cargoJefe,
      codigoEmpleado: userInfo,
      correoProfesor: materia.correoProfesor,
      materia: materias,
    };

    try {
      if (materia.marcado === "0") {
        const response = await fetchAltaOficio(payload);
        console.log(response);
        if (response === "Success") {
          alert("Oficio generado exitosamente.");
        } else {
          alert("Hubo un problema al procesar la solicitud, profesor sin asignaturas");
          return;
        }

        // Ocultar solo el botón de esa fila
        const updatedHiddenButtons = [...hiddenButtons];
        updatedHiddenButtons[index] = true;
        setHiddenButtons(updatedHiddenButtons);

        // Actualizamos el estado local sin volver a hacer fetchDocentes
        const updatedItems = [...currentItems];
        updatedItems[index].marcado = "1";
        updatedItems[index].noOficio = noOficioValues[index];
        setNoOficioValues(updatedItems.map((item) => item.noOficio));
        setEditMode(new Array(updatedItems.length).fill(false)); // Deshabilitamos el modo edición
      } else {
        await fetchActualizarOficio(payload);
        alert("Oficio actualizado exitosamente.");

        // Ocultar solo el botón de esa fila
        const updatedHiddenButtons = [...hiddenButtons];
        updatedHiddenButtons[index] = true;
        setHiddenButtons(updatedHiddenButtons);

        // Actualizamos el estado local sin volver a hacer fetchDocentes
        const updatedItems = [...currentItems];
        updatedItems[index].noOficio = noOficioValues[index];
        setNoOficioValues(updatedItems.map((item) => item.noOficio));
        setEditMode(new Array(updatedItems.length).fill(false)); // Deshabilitamos el modo edición
      }
    } catch (error) {
      alert("Hubo un problema al procesar la solicitud.");
      console.error(error);
    }
  };

  const handleEliminarOficio = async (idQr, index) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este oficio? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await fetchEliminarOficio(idQr);

      const updatedItems = [...currentItems];
      updatedItems[index].marcado = "0";
      updatedItems[index].noOficio = "";

      setNoOficioValues(updatedItems.map((item) => item.noOficio));
      setEditMode(new Array(updatedItems.length).fill(false));

      alert("El oficio ha sido eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el oficio:", error);
      alert("Hubo un problema al eliminar el oficio. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDescargarPDF = async (idQr) => {
    try {
      const response = await fetchConsultaOficio(idQr);
      console.log(response);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      alert("Hubo un problema al descargar el PDF.");
    }
  };

  const getMunicipioName = (ubicacion) => {
    if (!ubicacion) return "No disponible";

    const municipio = municipios.find(
      (m) => m.id === Number(ubicacion) || m.municipio.toString() === ubicacion.toString()
    );
    return municipio ? municipio.municipio : "No disponible";
  };

  const handleRowClick = (materia, index, event) => {
    if (!editMode[index]) {
      console.log("Modo edición deshabilitado, habilitelo para abrir el modal");
      return;
    }

    const ignoredColumnIndexes = [2, 5, 6, 7, 8];
    const clickedCell = event.target.closest("td");

    if (!clickedCell) return;
    const columnIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell);

    if (ignoredColumnIndexes.includes(columnIndex)) {
      return;
    }

    setSelectedData({
      profesor: materia.nombreProfesor,
      codigoProfesor: materia.codigoProfesor,
      noOficio: noOficioValues[index] || "N/A",
      idQr: materia.idQr,
      cicloEscolar: materia.cicloEscolar,
    });
    setModalOpen(true);
  };
  const handleNoOficioChange = (index, value) => {
    console.log(value.length);
    const updatedNoOficioValues = [...noOficioValues];
    updatedNoOficioValues[index] = value;
    setNoOficioValues(updatedNoOficioValues);

    // Verificar si el valor está vacío
    if (value === "") {
        const originalValue = currentItems[index].noOficio;
        updatedNoOficioValues[index] = originalValue; 
        setNoOficioValues(updatedNoOficioValues); 

        const updatedChanges = [...changes];
        updatedChanges[index] = false; 
        setChanges(updatedChanges);

        const updatedHiddenButtons = [...hiddenButtons];
        updatedHiddenButtons[index] = true; 
        setHiddenButtons(updatedHiddenButtons);
    } else {
        const updatedChanges = [...changes];
        updatedChanges[index] = value !== currentItems[index].noOficio;
        setChanges(updatedChanges);

        const updatedHiddenButtons = [...hiddenButtons];
        updatedHiddenButtons[index] = false;
        setHiddenButtons(updatedHiddenButtons);
    }
};


  const toggleEditMode = (index) => {
    const updatedEditMode = [...editMode];
    updatedEditMode[index] = !updatedEditMode[index];
    setEditMode(updatedEditMode);
  };

  const handleSaveRow = (index) => {
    const updatedItems = [...currentItems];
    updatedItems[index].noOficio = noOficioValues[index];

    const updatedEditMode = [...editMode];
    updatedEditMode[index] = false;
    setEditMode(updatedEditMode);

    const updatedChanges = [...changes];
    updatedChanges[index] = false;
    setChanges(updatedChanges);
  };

  // // Evitar que `useEffect` sobrescriba el valor guardado
  // useEffect(() => {
  //     setNoOficioValues((prev) =>
  //         currentItems.map((item, index) => {
  //             return changes[index] ? prev[index] : item.noOficio || "";
  //         })
  //     );
  // }, [currentItems, changes]);

  useEffect(() => {
    // detectar ESC key para cancelar edición
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setNoOficioValues(currentItems.map((item) => item.noOficio || ""));
        setEditMode(new Array(currentItems.length).fill(false));
        setChanges(new Array(currentItems.length).fill(false));
      }
      if (event.key === "Enter") {
        const updatedItems = [...currentItems];
        updatedItems.forEach((item, index) => {
          if (changes[index]) {
            updatedItems[index].noOficio = noOficioValues[index];
          }
        });

        setNoOficioValues(updatedItems.map((item) => item.noOficio));
        setEditMode(new Array(updatedItems.length).fill(false));
        setChanges(new Array(updatedItems.length).fill(false));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentItems, changes, noOficioValues]);

  console.log(currentItems);
  console.log(selectedMunicipio);

  return (
    <>
      <h2 className={styles.instruccionesTitle}>
        {editMode && editMode.some((value) => value)
          ? "Haga click en el nombre para ver la lista de materias"
          : "Haga doble click en cualquier fila para editarla, para guardar los cambios presione 'ENTER', para cancelar presione 'ESC'"}
      </h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort("codigoProfesor")}>CÓDIGO PROFESOR {getSortIcon("codigoProfesor")}</th>
            <th onClick={() => handleSort("nombreProfesor")}>NOMBRE DOCENTE {getSortIcon("nombreProfesor")}</th>
            <th>NO. OFICIO</th>
            <th>MUNICIPIO</th>
            <th>CICLO ESCOLAR</th>
            <th>GENERAR/ACTUALIZAR</th>
            <th>DESCARGAR</th>
            <th>EDITAR</th>
            <th>ELIMINAR</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((materia, index) => {
              console.log(`hiddenButtons[${index}]`, hiddenButtons[index]);
              console.log(`changes[${index}]`, changes[index]);
              console.log(`materia.marcado[${index}]`, materia.marcado);
              console.log(`materia.statusMunicipio[${index}]`, materia.statusMunicipio);
              console.log(`getMunicipioName(selectedMunicipio)`, getMunicipioName(selectedMunicipio));
              console.log(`materia.ubicacion[${index}]`, materia.ubicacion);
              console.log(`noOficioValues[${index}]`, noOficioValues[index]);
              return (
                <tr
                  key={index}
                  onClick={(event) => {
                    handleRowClick(materia, index, event);
                  }}
                  onDoubleClick={() => toggleEditMode(index)}
                  className={editMode[index] ? styles.clickableRow : ""}
                  style={{ cursor: "pointer" }}
                  title={editMode[index] ? "Haz clic para abrir el modal" : ""}
                >
                  <td>{materia.codigoProfesor}</td>
                  <td>{materia.nombreProfesor}</td>
                  <td>
                    {editMode[index] ? (
                      <input
                        type="text"
                        value={noOficioValues[index]}
                        onChange={(e) => handleNoOficioChange(index, e.target.value)}
                      />
                    ) : (
                      noOficioValues[index]
                    )}
                  </td>
                  <td>{getMunicipioName(selectedMunicipio) || materia.ubicacion}</td>
                  <td>{materia.cicloEscolar}</td>
                  <td>
                    {(changes[index] && materia.marcado === "1") ||
                    (getMunicipioName(selectedMunicipio) !== materia.ubicacion && materia.marcado === "1") ||
                    (materia.statusMunicipio === "0" && materia.marcado === "1") ||
                    (!noOficioValues[index] && materia.marcado === "1") ? (
                      <button
                        className={`${styles.button} ${styles.buttonChanged}`}
                        onClick={async () => {
                          setProcessingIndex(index);
                          await handleGenerarOActualizarPDF(materia, index);
                          setProcessingIndex(null);
                        }}
                        disabled={isLoading || !noOficioValues[index] || processingIndex === index}
                        hidden={hiddenButtons[index]}
                      >
                        {processingIndex === index ? "Actualizando..." : "Actualizar PDF"}
                      </button>
                    ) : materia.marcado === "0" && materia.statusMunicipio === "0" && changes[index] ? (
                      <button
                        className={`${styles.button} ${styles.buttonChanged}`}
                        onClick={async () => {
                          setProcessingIndex(index);
                          await handleGenerarOActualizarPDF(materia, index);
                          setProcessingIndex(null);
                        }}
                        disabled={!noOficioValues[index] || !materia.ubicacion || processingIndex === index}
                      >
                        {processingIndex === index ? "Generando..." : "Generar PDF"}
                      </button>
                    ) : null}
                  </td>

                  <td>
                    {materia.marcado === "1" ? (
                      <button
                        className={styles.button}
                        onClick={() => handleDescargarPDF(materia.idQr)}
                        disabled={isLoading || materia.marcado === "0"}
                      >
                        Descargar PDF
                      </button>
                    ) : (
                      <button className={styles.button} disabled={true}>
                        No disponible
                      </button>
                    )}
                  </td>
                  <td>
                    <button className={styles.button} onClick={() => toggleEditMode(index)}>
                      {editMode[index] ? "Cerrar" : "Editar"}
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.button}
                      onClick={() => handleEliminarOficio(materia.idQr, index)}
                      disabled={isLoading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9">No hay datos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ModalDetailsCargaHoraria
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        profesor={selectedData.profesor}
        codigoProfesor={selectedData.codigoProfesor}
        noOficio={selectedData.noOficio}
        idQr={selectedData.idQr}
        cicloEscolar={selectedData.cicloEscolar}
        fetchMaterias={fetchMaterias}
      />
    </>
  );
};

export default TablaCargaHorariaDetalles;
