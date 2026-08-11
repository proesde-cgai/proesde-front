import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faSave } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/Dictamen.module.css';
import Search from '../../../reutilizable/Search';
import Table from '../../../reutilizable/Table';

const Dictamen = () => {
  const [bodyTable, _] = useState([
    {
      id: 1,
      num: 1,
      nombre: 'Badillo Camacho Jessica',
      tipo: 'Evaluación',
      nivel: '-',
      calidad: 0,
      pts: 0
    },
    {
      id: 2,
      num: 2,
      nombre: 'Cabrera Gonzales Jose Luis',
      tipo: 'Evaluación',
      nivel: '-',
      calidad: 0,
      pts: 0
    },
    {
      id: 3,
      num: 3,
      nombre: 'Gutierrez Morales Livier Emmanuel',
      tipo: 'Evaluación',
      nivel: 'V',
      calidad: 460,
      pts: 620
    },
    {
      id: 4,
      num: 4,
      nombre: 'Sanchez Martinez Araceli',
      tipo: 'Evaluación',
      nivel: 'III',
      calidad: 325,
      pts: 535
    },
    {
      id: 5,
      num: 5,
      nombre: 'Sanchez Ortiz Claudia',
      tipo: 'Evaluación',
      nivel: 'VI',
      calidad: 289,
      pts: 615
    },
  ]);

  const CABECERAS_TABLA = [
    {
      id: 1,
      labelCabecera: 'input'
    },
    {
      id: 2,
      labelCabecera: '#'
    },
    {
      id: 3,
      labelCabecera: 'Apellido(S) Nombre(s)'
    },
    {
      id: 4,
      labelCabecera: 'Tipo'
    },
    {
      id: 6,
      labelCabecera: 'Nivel'
    },
    {
      id: 7,
      labelCabecera: 'Calidad'
    },
    {
      id: 8,
      labelCabecera: 'Pts.'
    },
  ];

  const handleSelectRow = (id) => {
    console.log('Seleccionando fila: ', id);
  };

  return (
    <div className={styles.container}>
      <p className={styles.title_page}>Dictamen</p>

      <div className={styles.container_parrafo}>
        <p className={styles.p_instrucciones}>
          <FontAwesomeIcon icon={faAngleRight} color={'yellow'} /> Instrucciones
        </p>

        <p className={styles.parrafo_instrucciones}>
          Seleccione de la tabla los acádemicos para los cuales se vaya a generar el reporte. Elija los que desee
          usando las casillas <br /> correspondientes, o todos los de la tabla haciendo clic en la casilla de la cabecera. <br />
          También puede realizar búsquedas especificas por nombre, apellido, código, tipo de participación u otros
          datos del académico. <br /> Si se desea hacer búsquedas por nivel (I-IX), habrá que especificarlo de la siguiente
          forma: "n=I", o "n=II", etc. <br />
          Cuando haya terminado, haga clic en "Generar PDF <FontAwesomeIcon icon={faSave} color={'cyan'} />".
        </p>
      </div>

      <div className={styles.container_table}>
        <div className={styles.container_filtros_tabla}>
          <div>
            <p>Buscar:</p>
            <Search placeholder={'Teclee su búsqueda'} /> {/* Pendiente pasar las props de este componente */}
          </div>
          
        </div>
        <Table cabecerasTable={CABECERAS_TABLA} bodyTable={bodyTable} withHeader={true}>
          {bodyTable.map(dataBody => (
            <tr key={dataBody.id}>
              <td className={styles.td_checkbox}>
                <input
                  type="checkbox"
                  onClick={() => handleSelectRow(dataBody.id)}
                />
              </td>
              <td className={`${styles.td} ${styles.td_textCenter}`}>{dataBody.id}</td>
              <td className={`${styles.td} ${styles.td_nombre}`}>{dataBody.nombre}</td>
              <td className={`${styles.td} ${styles.td_textCenter}`}>{dataBody.tipo}</td>
              <td className={`${styles.td} ${styles.td_textCenter}`}>{dataBody.nivel}</td>
              <td className={`${styles.td} ${styles.td_textCenter}`}>{dataBody.calidad}</td>
              <td className={`${styles.td} ${styles.td_textCenter}`}>{dataBody.pts}</td>
            </tr>
          ))}
        </Table>
      </div>

      <div className={styles.container_buttons}>
        <button
          type="button"
          placeholder='Limpiar'
          className='texto_con_icono'
        >
          Generar PDF <FontAwesomeIcon icon={faSave} color='cyan' />
        </button>
      </div>
    </div>
  )
}

export default Dictamen
