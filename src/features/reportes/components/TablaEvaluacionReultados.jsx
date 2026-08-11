import React, { useState } from "react";
import styles from "./styles/TablaEvaluacionResultados.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faPrint,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { CABECERAS_TABLA } from "../utils/util";
import { useForm } from "react-hook-form";
import Search from "../../../reutilizable/Search";
import Select from "../../../reutilizable/Select";
import Table from "../../../reutilizable/Table";
import useFetchResultadoEvaluacionGenerarPDF from "../../../hooks/useFetchResultadoEvaluacionGenerarPDF";

function TablaEvaluacionReultados() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const [participantes, setParticipantes] = useState([]);
  const { evaluacionResultadoGeneratePdf } =
    useFetchResultadoEvaluacionGenerarPDF();

  const [bodyTable, _] = useState([
    {
      id: 1,
      num: 1,
      nombre: "Reynoso Alvarez Alejandro",
      tipo: "PRODEP",
      dependencia: "cucsh",
      nivel: "-",
      calidad: 430,
      pts: 630,
    },
    {
      id: 2,
      num: 1,
      nombre: "Cabrera Gonzales Jose Luis",
      tipo: "Evaluacion",
      dependencia: "prepa7",
      nivel: "-",
      calidad: 430,
      pts: 630,
    },
    {
      id: 3,
      num: 1,
      nombre: "Cabrera Gonzales Jose Luis",
      tipo: "Evaluacion",
      dependencia: "prepa7",
      nivel: "-",
      calidad: 430,
      pts: 630,
    },
  ]);

  const handleSelectRow = (id) => {
    const participanteSeleccionado = bodyTable.find((item) => item.id === id);

    setParticipantes((prev) => {
      // Verifica si el participante ya está en la lista
      const existe = prev.some((p) => p.id === id);

      if (existe) {
        // Si ya está, elimina el participante de la lista
        return prev.filter((p) => p.id !== id);
      } else {
        // Si no está, agrégalo
        return [...prev, participanteSeleccionado];
      }
    });
  };
  const handleSelectParticipants = (data) => {
    console.log(data);
    setParticipantes(data);
  };
  const handleGeneratePDF = async () => {
    console.log("Participantes seleccionados:", participantes);
    const response = await evaluacionResultadoGeneratePdf(participantes);
    console.log(response);
  };
  return (
    <>
      <div className={styles.container}>
        <p className={styles.title_page}>Tabla de resultados de evaluación</p>

        <div className={styles.container_parrafo}>
          <p className={styles.p_instrucciones}>
            <FontAwesomeIcon icon={faAngleRight} color={"yellow"} />{" "}
            Instrucciones
          </p>

          <p className={styles.parrafo_instrucciones}>
            Seleccione de la Tabla de resultados de evaluación los académicos
            para los cuales se vaya a generar el reporte. <br />
            Elija los que desee usando las casillas correspondientes, o todos
            los de la tabla haciendo clic en la casilla de la cabecera. <br />
            También puede realizar búsquedas especificas por nombre, apellido,
            código, tipo de participación u otros datos del académico. <br /> Si
            se desea hacer búsquedas por nivel (I-IX), habrá que especificarlo
            de la siguiente forma: "n=I", o "n=II", etc. <br />
            Cuando haya terminado, haga clic en "Generar PDF{" "}
            <FontAwesomeIcon icon={faSave} color={"cyan"} />
            ".
          </p>
        </div>
        <div className={styles.container_table}>
          <div className={styles.container_filtros_tabla}>
            <div>
              <p>Buscar:</p>
              <Search placeholder={"Teclee su búsqueda"} />{" "}
              {/* Pendiente pasar las props de este componente */}
            </div>
            <p>en</p>
            <div>
              <Select
                form={{ setValue, watch }}
                name="dependenciaSeleccionada"
                placeholder="Seleccione una dependencia"
                onSelectParticipants={handleSelectParticipants}
              />
            </div>
          </div>
          <Table
            cabecerasTable={CABECERAS_TABLA}
            bodyTable={bodyTable}
            withHeader={true}
          >
            {bodyTable.length > 0 ? (
              bodyTable.map((dataBody) => (
                <tr key={dataBody.id}>
                  <td className={`${styles.td_checkbox}`}>
                    <input
                      type="checkbox"
                      onClick={() => handleSelectRow(dataBody.id)}
                    />
                  </td>
                  <td className={`${styles.td} ${styles.td_textCenter}`}>
                    {dataBody.id}
                  </td>
                  <td className={`${styles.td} ${styles.td_nombre}`}>
                    {dataBody.nombre}
                  </td>
                  <td className={`${styles.td} ${styles.td_textCenter}`}>
                    {dataBody.tipo}
                  </td>
                  <td className={`${styles.td} ${styles.td_textCenter}`}>
                    {dataBody.dependencia}
                  </td>
                  <td className={`${styles.td} ${styles.td_textCenter}`}>
                    {dataBody.nivel}
                  </td>
                  <td className={`${styles.td} ${styles.td_textCenter}`}>
                    {dataBody.calidad}
                  </td>
                  <td className={`${styles.td} ${styles.td_textCenter}`}>
                    {dataBody.pts}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={CABECERAS_TABLA.length} className={styles.noData}>
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </Table>
        </div>
        <div className={styles.container_buttons}>
          <button
            type="button"
            placeholder="Limpiar"
            className="texto_con_icono"
            onClick={handleGeneratePDF}
          >
            Generar PDF <FontAwesomeIcon icon={faSave} color="cyan" />
          </button>
        </div>
      </div>
    </>
  );
}

export default TablaEvaluacionReultados;
