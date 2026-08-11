import React, { useState, useEffect } from "react";
import { fetchAllParametros, updateParametro } from "../services/configurationService";
import styles from "./styles/configuracion.module.css";

const Configuracion = () => {
  const [parametros, setParametros] = useState([]);
  const [selectedParametro, setSelectedParametro] = useState(null);
  const [formValues, setFormValues] = useState({
    inputValue: "",
    selectValue: "",
    inputDescripcion: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchParametros = async () => {
      try {
        const data = await fetchAllParametros();
        setParametros(data);
      } catch (error) {
        alert("Error al cargar parámetros. Intente nuevamente.");
      }
    };

    fetchParametros();
  }, []);

  const handleSelectChange = (event) => {
    const selectedClave = event.target.value;
    const parametro = parametros?.find((param) => param?.clave === selectedClave);

    setSelectedParametro(parametro || null);
    setFormValues({
      selectValue: selectedClave,
      inputValue: parametro?.valor || "",
      inputDescripcion: parametro?.descripcion || "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!selectedParametro) {
      alert("Por favor, seleccione un parámetro válido.");
      return;
    }

    const userConfirmed = window.confirm("¿Está seguro de que desea actualizar este parámetro?");
    if (!userConfirmed) return;

    setIsLoading(true);

    try {
      const response = await updateParametro({
        id: selectedParametro?.id,
        descripcion: formValues?.inputDescripcion,
        valor: formValues?.inputValue,
      });

      if (response?.status === 200) {
        alert("Parámetro actualizado correctamente.");
      } else {
        alert(`Error al actualizar el parámetro. Código de estado: ${response?.status}`);
      }
    } catch (error) {
      alert("Error al actualizar el parámetro. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formValues.inputValue.trim() !== "" &&
    formValues.selectValue.trim() !== "" &&
    formValues.inputDescripcion.trim() !== "";

  if (isLoading) {
    return <div className={styles.container}><p>Cargando parámetros...</p></div>;
  }

  if (parametros.length === 0) {
    return <div className={styles.container}><p>No hay parámetros disponibles.</p></div>;
  }

  return (
    <div className={styles.container}>
      <header>
        <h3 className={styles.inconformidad_title}>Configurar Parámetros</h3>
      </header>

      <div className={styles.configContainer}>
        <div className={styles.row}>
          <div className={styles.fieldContainer}>
            <label htmlFor="activity-select" className={styles.label}>
              Parámetros
            </label>
            <select
              id="activity-select"
              name="selectValue"
              className={styles.select}
              value={formValues.selectValue}
              onChange={handleSelectChange}
              disabled={isLoading}
            >
              <option value="">Seleccione una opción</option>
              {parametros.map((param) => (
                <option key={param.id} value={param.clave}>
                  {param.clave}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldContainer}>
            <label className={styles.label}>Descripción</label>
            <input
              type="text"
              id="text-input-json"
              name="inputDescripcion"
              value={formValues.inputDescripcion}
              onChange={handleInputChange}
              className={styles.input}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.fieldContainer}>
          <label className={styles.labelTxtArea}>Valor</label>
          <textarea
            id="text-area"
            name="inputValue"
            value={formValues.inputValue}
            onChange={handleInputChange}
            className={styles.textArea}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          type="submit"
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? "Actualizando..." : "Modificar Parámetro"}
        </button>
      </div>
    </div>
  );
};

export default Configuracion;
