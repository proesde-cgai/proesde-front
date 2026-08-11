import React, { useState, useEffect,  } from "react";
import Loading from "../../../../../reutilizable/Loading";

import styles from "./styles/TablaConvocatoria.module.css";

const TablaConvocatoria = ({
    currentItems = [],
    changes,
}) => {
  const [isLoading, setIsLoading] = useState();

  const [idSolicitud, setIdSolicitud] = useState(null);

  return (
    <div>
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>NOMBRE CORTO</th>
                    <th>FECHA INICIO</th>
                    <th>FECHA FINAL</th>
                    <th>ACTIVIDAD ASOCIADA</th>
                    <th>EDITAR</th>
                    <th>ELIMINAR</th>
                </tr>
            </thead>
            <tbody>
            {currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                return (
                    <tr key={index}>
                    <td>{item.nombreCorto}</td>
                    <td>{item.fechaInicio}</td>
                    <td>{item.fechaFinal}</td>
                    <td>{}</td>

                    <td>
                        <button
                        className={`${styles.button}`}
                        >
                        Editar
                        </button>
                    </td>
                    <td>
                        <button
                        className={`${styles.button} ${item.actividades === "0" ? styles.buttonDisabled : ""}`}
                        >
                        Eliminar
                        </button>
                    </td>
                    </tr>
                );
                })
            ) : (
                <tr>
                <td colSpan="15">No hay actividades</td>
                </tr>
            )}
            </tbody>
      </table>

    </div>
  );
};

export default TablaConvocatoria;
