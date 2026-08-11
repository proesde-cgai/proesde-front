import React, { useState, useEffect } from "react";
import styles from "../styles/ModalCargaHoraria.module.css";

const ModalDetailsCargaHoraria = ({
  isOpen,
  onClose,
  profesor,
  codigoProfesor,
  noOficio,
  idQr,
  fetchMaterias,
  cicloEscolar,
}) => {
  const [cargaHorariaData, setCargaHorariaData] = useState([]);
  const [totalCargaHoraria, setTotalCargaHoraria] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && idQr) {
      const fetchData = async () => {
        setIsLoading(true);
        setCargaHorariaData([]);
        setTotalCargaHoraria(0);

        const data = await fetchMaterias(codigoProfesor, idQr, cicloEscolar);
        setCargaHorariaData(data);

        const total = data.reduce((sum, item) => sum + parseFloat(item.cargaHoraria || 0), 0);
        setTotalCargaHoraria(total);

        setIsLoading(false);
      };

      fetchData();
    }
  }, [isOpen, idQr, fetchMaterias, cicloEscolar, codigoProfesor]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h3>PROFESOR: {profesor}</h3>
          <p>CÓDIGO PROFESOR: {codigoProfesor}</p>
          <p>NO. OFICIO: {noOficio}</p>
        </div>
        <div className={styles.tableContainer}>
          {isLoading ? (
            <p>Cargando...</p>
          ) : cargaHorariaData.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Asignatura</th>
                  <th>CRN</th>
                  <th>Clave Asignatura</th>
                  <th>Carga Horaria</th>
                </tr>
              </thead>
              <tbody>
                {cargaHorariaData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.asignatura || "N/A"}</td>
                    <td>{item.crn}</td>
                    <td>{item.clave}</td>
                    <td>{parseFloat(item.cargaHoraria).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No se encontraron datos de carga horaria.</p>
          )}
        </div>
        <p className={styles.total}>TOTAL CARGA HORARIA: {totalCargaHoraria.toFixed(2)}</p>
        <button className={styles.closeButton} onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default ModalDetailsCargaHoraria;
