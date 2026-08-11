import React, { useState, useEffect } from "react";
import styles from "./EvaluationTableComponent.module.css";
import { obtenerMaterias } from "../../materiasService";
import { obtenerMunicipios } from "../../municipiosService";

const EvaluationTableComponent = () => {
  const [materias, setMaterias] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [changes, setChanges] = useState({});
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cicloEscolar, setCicloEscolar] = useState("2023A");

  // Opciones de ciclos escolares
  const options = [
    { value: "2021A", label: "2021" },
    { value: "2022A", label: "2022" },
    { value: "2023A", label: "2023" },
    { value: "2024A", label: "2024" },
  ];

  // Obtener la lista de municipios al montar el componente
  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const data = await obtenerMunicipios();
        setMunicipios(data);
      } catch (error) {
        console.error("Error al obtener municipios:", error);
        setError("No se pudo obtener la lista de municipios. Intente nuevamente más tarde.");
      }
    };
    fetchMunicipios();
  }, []);

  // Obtener materias cuando cambia el ciclo escolar
  useEffect(() => {
    const fetchMaterias = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await obtenerMaterias("XXSAFS3", cicloEscolar, "Evaluación de Estudiantes");
        console.log("Materias recibidas:", data); // Verificación de los datos recibidos
        setMaterias(data);
      } catch (error) {
        console.error("Error al obtener las materias:", error);
        setError("Hubo un problema al cargar las materias. Intente nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterias();
  }, [cicloEscolar]);

  // Función para manejar cambios en los campos de cada materia
  const handleInputChange = (index, field, value) => {
    const updatedMaterias = [...materias];
    updatedMaterias[index][field] = value || "";
    setMaterias(updatedMaterias);

    // Track changes cuando se está editando
    if (materias[index].marcado === "1") {
      setChanges((prevChanges) => ({
        ...prevChanges,
        [index]: true,
      }));
    }
  };

  // Función para alternar el modo edición
  const toggleEditMode = (index) => {
    if (materias[index].marcado === "0") return; // No permitir edición si marcado es 0

    setEditMode((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));

    // Mantener tracking de los cambios después de guardar la edición
    if (!editMode[index]) {
      setChanges((prevChanges) => ({
        ...prevChanges,
        [index]: true,
      }));
    }
  };

  // Función para descargar PDF
  const handleDescargarPDF = async (materia) => {
    if (materia.marcado === "0") {
      console.log("Carta de Desempeño no disponible para descargar.");
      return;
    }
    try {
      // Aquí usas la lógica para descargar el PDF (mantén la lógica anterior)
      console.log("Descargando PDF para:", materia);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
    }
  };

  // Función para eliminar una materia
  const onEliminar = (index) => {
    const updatedMaterias = materias.filter((_, i) => i !== index);
    setMaterias(updatedMaterias);
  };

  return (
    <div className={styles.container}>
      <div className={styles.fields}>
        <span className={styles.field_container}>
          <span className={styles.field_label}>CICLO ESCOLAR:</span>
          <span className={styles.field_select}>
            <select
              value={cicloEscolar}
              onChange={(e) => setCicloEscolar(e.target.value)}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
        </span>
      </div>

      {loading ? (
        <p>Cargando materias...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>NOMBRE DOCENTE</th>
              <th>MATERIA</th>
              <th>CRN</th>
              <th>CLAVE</th>
              <th>PROGRAMA EDUCATIVO</th>
              <th>CARGA HORARIA</th>
              <th>NO. OFICIO</th>
              <th>CALIFICACIÓN</th>
              <th>MUNICIPIO</th>
              <th>CICLO ESCOLAR</th>
              <th>GENERAR</th>
              <th>DESCARGAR</th>
              <th>EDITAR</th>
              <th>ELIMINAR</th>
            </tr>
          </thead>
          <tbody>
            {materias.length > 0 ? (
              materias.map((materia, index) => (
                <tr key={index}>
                  <td>{materia.nombreProfesor || "N/A"}</td>
                  <td>{materia.asignatura || "N/A"}</td>
                  <td>{materia.crn || "N/A"}</td>
                  <td>{materia.clave || "N/A"}</td>
                  <td>{materia.programaEducativo || "N/A"}</td>
                  <td>{materia.cargaHoraria || "N/A"}</td>
                  <td>
                    {editMode[index] ? (
                      <input
                        type="text"
                        value={materia.noOficio || ""}
                        onChange={(e) => handleInputChange(index, "noOficio", e.target.value)}
                      />
                    ) : (
                      materia.noOficio || "N/A"
                    )}
                  </td>
                  <td>
                    {editMode[index] ? (
                      <select
                        value={materia.calificacion}
                        onChange={(e) => handleInputChange(index, "calificacion", e.target.value)}
                      >
                        <option value="BUENO">BUENO</option>
                        <option value="EXCELENTE">EXCELENTE</option>
                        <option value="NO APLICA">NO APLICA</option>
                      </select>
                    ) : (
                      materia.calificacion || "N/A"
                    )}
                  </td>
                  <td>
                    {editMode[index] ? (
                      <select
                        value={materia.ubicacion || ""}
                        onChange={(e) => handleInputChange(index, "ubicacion", e.target.value)}
                      >
                        <option value="">Seleccione una ubicación</option>
                        {municipios.map((municipio) => (
                          <option key={municipio.id} value={municipio.municipio}>
                            {municipio.municipio}
                          </option>
                        ))}
                      </select>
                    ) : (
                      materia.ubicacion || "No Disponible"
                    )}
                  </td>
                  <td>{materia.cicloEscolar || "N/A"}</td>
                  <td>
                    <button
                      className={styles.link}
                      onClick={() => console.log("Generar PDF", materia)}
                      disabled={materia.marcado === "1" && !changes[index]}
                    >
                      Generar {materia.marcado === "0" ? "Nuevo" : ""} PDF
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.link}
                      onClick={() => handleDescargarPDF(materia)}
                      disabled={materia.marcado === "0"}
                    >
                      {materia.marcado === "0" ? "No Disponible" : "Descargar PDF"}
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.link}
                      onClick={() => toggleEditMode(index)}
                      disabled={materia.marcado === "0"}
                    >
                      {editMode[index] ? "Guardar" : "Editar"}
                    </button>
                  </td>
                  <td>
                    <button className={styles.link} onClick={() => onEliminar(index)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14">No hay materias disponibles para evaluar.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EvaluationTableComponent;
