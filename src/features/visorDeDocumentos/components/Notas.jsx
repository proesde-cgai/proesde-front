import styles from "./DatosParticipante.module.css";

export const Notas = () => {
  return (
    <>
      <div className={styles.main}>
        <h1>Agregar una nota</h1>
        <div className={styles.container}>
          <form action="">
            <textarea className={styles.txtArea} name="" id=""></textarea>

            <button className={styles.btn}>Guardar</button>
          </form>
        </div>

        <div>
          <h1>Notas realizadas</h1>
          <p>Mostrar notas</p>
        </div>
      </div>
    </>
  );
};
