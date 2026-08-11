import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo } from "react";
import { useCargaHorariaStore } from "../../store/useCargaHorariaStore";
import Loading from "../Loading";
import styles from "./TablaCargaHoraria.module.css";

// Prioridad de ordenamiento para niveles (excluyendo "Total")
const prioridadNiveles = {
  TÉCNICO: 1,
  BACHILLERATO: 2,
  LICENCIATURA: 3,
  MAESTRÍA: 4,
  DOCTORADO: 5,
  POSGRADO: 6,
};

function TablaCargaHoraria(selectedAcademico) {
  const { cargaHorariaData, ciclosEscolares, isLoadingCargaHoraria, isErrorCargaHoraria, fetchCargaGlobal } = useCargaHorariaStore();
  const rol = localStorage.getItem("rol");

  console.log('Academico seleccionado ', selectedAcademico.selectedAcademico);
  
  useEffect(() => {
    if (selectedAcademico?.selectedAcademico) {
      fetchCargaGlobal(selectedAcademico.selectedAcademico);
    }
  }, [selectedAcademico?.selectedAcademico, fetchCargaGlobal]);

  // Separar los datos en niveles y total
  const { niveles, total } = useMemo(() => {
    if (!cargaHorariaData || cargaHorariaData.length === 0) {
      return { niveles: [], total: null };
    }

    const nivelesData = [];
    let totalData = null;

    cargaHorariaData.forEach((item) => {
      if (item.nivel && item.nivel.toUpperCase() === "TOTAL") {
        totalData = item;
      } else {
        nivelesData.push(item);
      }
    });

    // Ordenar niveles según prioridad
    nivelesData.sort((a, b) => {
      const nivelA = prioridadNiveles[a.nivel?.toUpperCase()] || 999;
      const nivelB = prioridadNiveles[b.nivel?.toUpperCase()] || 999;
      return nivelA - nivelB;
    });

    return { niveles: nivelesData, total: totalData };
  }, [cargaHorariaData]);

  if (isLoadingCargaHoraria) return <Loading />;
  if (isErrorCargaHoraria) return <p>{isErrorCargaHoraria}</p>;

  if (!cargaHorariaData || cargaHorariaData.length === 0) {
    return (
      <>
        <div className={styles.tituloContainer}>
          <h2 className={styles.titulo}><FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> Carga Global</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Nivel</th>
              {ciclosEscolares.map((ciclo) => (
                <th key={ciclo} className={styles.tableHeader}>{ciclo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className={styles.totalRow}>
              <td>Total</td>
              {ciclosEscolares.length > 0
                ? ciclosEscolares.map((ciclo) => <td key={ciclo}>0</td>)
                : <td>0</td>
              }
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  return (
    <>
      <div className={styles.tituloContainer}>
        <h2 className={styles.titulo}><FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> Carga Global</h2>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Nivel</th>
            {ciclosEscolares.map((ciclo) => (
              <th key={ciclo} className={styles.tableHeader}>
                {ciclo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Filas de niveles */}
          {niveles.map((item, index) => (
            <tr key={index}>
              <td>{item.nivel}</td>
              {ciclosEscolares.map((ciclo) => (
                <td key={ciclo}>{item[ciclo] ?? 0}</td>
              ))}
            </tr>
          ))}
          {/* Fila de Total */}
          {total && (
            <tr className={styles.totalRow}>
              <td>{total.nivel}</td>
              {ciclosEscolares.map((ciclo) => (
                <td key={ciclo}>{total[ciclo] ?? 0}</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>

      <h1 style={{ marginTop: "20px", color: "red" }}>
        <strong>IMPORTANTE</strong>
      </h1>
      <ul>
        {/* <li>La solicitud y la carta compromiso se genera automáticamente al hacerse el registro en línea.</li>
                                        <li>Si los datos contienen errores una vez impresos, puede acceder nuevamente al sistema y modificarlos.</li>
                                        <li>El sistema generará los documentos con los datos actualizados al finalizar las modificaciones.</li> */}
        <li>
          <strong>El sistema puede demorar algunos segundos en responder.</strong>
        </li>
      </ul>

      <ul className={styles.important}>
        <li>Los datos que aparecen en este formulario provienen directamente del sistema SIA-RH.</li>
        <li>
          En caso de que requiera modificar alguno de estos datos, favor de acudir a la Coordinación de Personal de
          su dependencia de adscripción para la actualización correspondiente.
        </li>
      </ul>
    </>
  );
}

export default TablaCargaHoraria;
