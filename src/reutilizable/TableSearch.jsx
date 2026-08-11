import React, { useState } from 'react';
import './styles/FormModal.css';
import styles from './styles/TableSearch.module.css';
import iconAmarillo from '../assets/images/note-edit-icon_amarillo.png';
import icon from '../assets/images/note-edit-icon.png';

const getNodoIdBySigla = (participante, letter) => {
  const archivo = participante.archivos.find(item => item.sigla === letter);
  return archivo ? '•' : '-';
};

const TableSearch = ({ participantes }) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = participantes.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(participantes.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <table className={styles.tableContainer}>
        <p className={styles.intrucciones}>A: REQUISITOS DE PARTICIPACIÓN B:DOCUMENTOS PARA EVALUACIÓN(ART. 26) A2: REQUISITOS DE PARTICIPACIÓN. DOCUMENTOS REQUERIDOS EN ETAPA DE SUPERVISIÓN (1RA)</p>
        <p className={styles.intrucciones}>B2: DOCUMENTOS PARA EVALUACIÓN(ART. 26) DOCUMENTOS REQUERIDOS EN ETAPA DE SUPERVISIÓN (1RA) D: ETAPA DE SUPERVISIÓN D: TABLA PUNTAJE</p>
        <p className={styles.intrucciones}>I: RECURSO INCONFORMIDAD D:DICTAMEN INCONFORMIDAD E:DICTAMEN FINAL</p>
        <thead>
          <tr>
            <th>#</th>
            <th>APELLIDO(S) Nombre(s)</th>
            <th>TIPO</th>
            <th>DEPENDENCIA</th>
            <th>NIVEL</th>
            <th>CALIDAD</th>
            <th>PTS</th>
            <th>A</th>
            <th>B1</th>
            <th>B2</th>
            <th>B3</th>
            <th>B4</th>
            <th>C</th>
            <th>I</th>
            <th>E</th>
            <th>D</th>
            <th>F</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((participante, index) => (
            <tr key={participante.id}>
              <td>{indexOfFirstRow + index + 1}</td>
              <td>{participante.apellidoPaterno} {participante.apellidoMaterno} {participante.nombre} {participante?.inconformidad ? <span className={styles.inc}>[INC]</span> : ''} 
              {participante.comentario && (
                <>
                  {participante.revisado ? (
                    <img src={icon} alt="Icon" />
                  ) : (
                    <img src={iconAmarillo} alt="Icon" />
                  )}
                  </>
                
              )}
              </td>
              <td>{participante.nombreParticipacion}</td>
              <td>{participante.siglasDependencia}</td>
              <td
                className={participante.inconformidad ?
                  (participante.respuestaInconformidad ? 
                    styles.eAtendido
                    : styles.eVacio)
                  : (participante.nivelRomano ? 
                    styles.eEvaluado
                    : styles.eVacio)
                }
              >
                {participante.nivelRomano || '-'}
              </td>

              <td>{participante?.calidad || '0'}</td>
              <td>{participante?.puntuacion || '0'}</td>
              <td>{getNodoIdBySigla(participante, 'A')}</td>
              <td>{getNodoIdBySigla(participante, 'B1')}</td>
              <td>{getNodoIdBySigla(participante, 'B2')}</td>
              <td>{getNodoIdBySigla(participante, 'B3')}</td>
              <td>{getNodoIdBySigla(participante, 'B4')}</td>
              <td>{getNodoIdBySigla(participante, 'C')}</td>
              <td>{getNodoIdBySigla(participante, 'I')}</td>
              <td>{getNodoIdBySigla(participante, 'E')}</td>
              <td>{getNodoIdBySigla(participante, 'D')}</td>
              <td>{getNodoIdBySigla(participante, 'F')}</td>
            </tr>
          ))}
          <div className={styles.pagination}>
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              {"<"}
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              {">"}
            </button>
          </div>
        </tbody>
      </table>

    </>
  );
};

export default TableSearch;
