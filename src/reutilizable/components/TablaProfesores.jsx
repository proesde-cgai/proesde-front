import React from "react";
import Loading from "../Loading";
import styles from "./TablaProfesores.module.css";

const TablaProfesores = ({
  listaProfesores,
  isLoadingProfesores,
  headers,
  rows,
}) => {
  console.log(listaProfesores);
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>
          {!isLoadingProfesores &&
            listaProfesores.map((profesor, index) => {
              return <tr key={index}>{rows(profesor)}</tr>;
            })}
        </tbody>
      </table>
      {isLoadingProfesores && <Loading />}
    </>
  );
};

export default TablaProfesores;
