import React, { useState } from "react";
import { validarQRToken } from "../../qrService";
import styles from "../components/QRValidator.module.css";

const QRValidatorPage = () => {
  const [token, setToken] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleTokenChange = (event) => {
    setError(null);
    setToken(event.target.value);
  };

  const handleValidation = async () => {
    const trimmedToken = token.replace(/\s+/g, '');
    console.log(trimmedToken);
    try {
      const res = await validarQRToken(trimmedToken);
      setResponse(res);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("No se encontro el documento asociado al idQr");
      setResponse(null);
    }
  };

  const tipoCarta = [
    { tipo: "1", nombre: "Desempeño Docente" },
    { tipo: "2", nombre: "Evaluación Estudiantes" },
    { tipo: "3", nombre: "Carga Horaria" },
    { tipo: "4", nombre: "Cumplimiento PT" },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Validador C&oacute;digo QR</h2>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={token}
          onChange={handleTokenChange}
          placeholder="Ingresar token QR"
          className={styles.input}
        />
        <button onClick={handleValidation} className={styles.button}>
          Validar Token
        </button>
      </div>
      {response && response?.status && response?.tipo ? (
        <div className={styles.resultContainer}>
          <h3 className={styles.successMessage}>QR Encontrado</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                {response.id && <th>ID</th>}
                {response.tipo && <th>Tipo</th>}
                {response.idQr && <th>ID QR</th>}
                {response.noOficio && <th>No Oficio</th>}
                {response.crn && <th>CRN</th>}
                {response.nombreProfesor && <th>Nombre Profesor</th>}
                {response.cicloEscolar && <th>Ciclo Escolar</th>}
                {response.jefeDepartamento && <th>Jefe Departamento</th>}
                {response.calificacion && <th>Calificación</th>}
                {response.ubicacion && <th>Ubicación</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                {response.id && <td>{response.id}</td>}
                {response.tipo && (
                  <td>{tipoCarta.find((tipo) => tipo.tipo === response.tipo)?.nombre || "Desconocido"}</td>
                )}
                {response.idQr && <td>{response.idQr}</td>}
                {response.noOficio && <td>{response.noOficio}</td>}
                {response.crn && <td>{response.crn}</td>}
                {response.nombreProfesor && <td>{response.nombreProfesor}</td>}
                {response.cicloEscolar && <td>{response.cicloEscolar}</td>}
                {response.jefeDepartamento && <td>{response.jefeDepartamento}</td>}
                {response.calificacion && <td>{response.calificacion}</td>}
                {response.ubicacion && <td>{response.ubicacion}</td>}
              </tr>
            </tbody>
          </table>
        </div>
      ) : response ? (
        <div className={styles.resultContainer}>
          <h3 className={styles.successMessage}>QR Encontrado</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>No Oficio</th>
                <th>Nombre Profesor</th>
                <th>Ciclo Escolar</th>
                <th>Jefe Departamento</th>
                <th>Ubicación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{response?.idQr}</td>
                <td>Validaci&oacute;n PT</td>
                <td>{response?.status_municipio}</td>
                <td>{response?.noOficio}</td>
                <td>{response?.nombreProfesor}</td>
                <td>{response?.cicloEscolar}</td>
                <td>{response?.jefeDepartamento}</td>
                <td>{response?.ubicacion}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <h3 className={styles.errorTitle}>Error</h3>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      ) : null}
    </div>
  );
};

export default QRValidatorPage;
