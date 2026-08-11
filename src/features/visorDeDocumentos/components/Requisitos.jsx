import { useState } from "react";
import styles from "./DatosParticipante.module.css";

export const Requisitos = () => {
  const [isConcursante, setIsConcursante] = useState(true);

  const handleRadioChange = (event) => {
    setIsConcursante(event.target.value === "concursante");
  };

  return (
    <>
      <div className={styles.container}>
        <form action="">
          <h1>Requisitos de participante</h1>

          <div className={styles.input}>
            <strong>I. </strong>
            <p className={styles.requisito}>
              Ser profesor de carrera o técnico académico de tiempo completo con
              categoría de titular o asociado en cualquiera de sus niveles.
            </p>
            <input type="checkbox" />
          </div>

          <div className={styles.input}>
            <strong>II. </strong>
            <p className={styles.requisito}>
              Haber impartido docencia en la universidad de Guadalajara, en
              ciclo 2023A al menos 4 cuatro horas semana mes y en el calendario
              2023B, al menos 8 ocho, en cursor curriculares y haber cumplido al
              menos el 90% de las asistencias durante el periodo a evaluar.
            </p>
            <input type="checkbox" />
          </div>

          <div className={styles.input}>
            <strong>III. </strong>
            <p className={styles.requisito}>
              Estar cubriendo actualmente una carga horaria de docencia
              curricular de por lo menos 8 horas semana mes en el ciclo escolar
              2024A.
            </p>
            <input type="checkbox" />
          </div>

          <div className={styles.input}>
            <strong>IV. </strong>
            <p className={styles.requisito}>
              Tener registrado en su plan de trabajo anual en el departamento de
              adscripción que inicia en enero de 2024, en el formato establecido
              para este fin, con el nombre y firma del jefe de departamento,
              Director de escuela de Sistema y sello respectivo.
            </p>
            <input type="checkbox" />
          </div>

          <div className={styles.input}>
            <strong>V. </strong>
            <p className={styles.requisito}>
              Haber cumplido en su totalidad con el plan de trabajo que presentó
              en la promoción anterior de este programa si fue beneficiado.
            </p>
            <input type="checkbox" />
          </div>

          <div className={styles.input}>
            <strong>VI. </strong>
            <p className={styles.requisito}>
              Contar por lo menos con grado académico de maestro o el diploma de
              especialidad de al menos 2 años, este último únicamente será
              aplicable para personal docente de las áreas de Ciencias de la
              Salud.
            </p>
            <input type="checkbox" />
          </div>

          <div className={styles.input}>
            <strong>VII. </strong>
            <p className={styles.requisito}>
              No trabajar más de 8 horas semanales prestando servicios
              personales, subordinados o independientes en instituciones o
              empresas propias o ajenas. Para demostrar lo anterior, el
              aspirante deberá firmar una carta compromiso y de exclusividad, en
              el formato establecido.
            </p>
            <input type="checkbox" />
          </div>

          <div className={styles.input}>
            <div className={styles.radio}>
              <p>Concursante</p>
              <input
                name="concursante"
                type="radio"
                value="concursante"
                onChange={handleRadioChange}
                checked={isConcursante}
              />
              <p>No Concursante</p>
              <input
                name="concursante"
                type="radio"
                value="noConcursante"
                onChange={handleRadioChange}
                checked={!isConcursante}
              />
            </div>
          </div>

          {/* Textarea para razones, visible solo si No Concursante */}
          {!isConcursante && (
            <>
              <p>Razones</p>
              <div className={styles.input}>
                <textarea
                  className={styles.razones}
                  name="razones"
                  id=""
                ></textarea>
              </div>
            </>
          )}

          <div className={styles.btnInput}>
            <button className={styles.btn}>Continuar</button>
          </div>
        </form>
      </div>
    </>
  );
};
