import Search from "../../../reutilizable/Search";
import styles from "./styles/Evaluacion.module.css";

export const Evaluar = () => {
  // form.
  return (
    <div>
      <span>
        {/* Constancia por ciclo escolar */}
        <div className={styles.fields}>
          {/* Docente search */}
          <span className={styles.field_container}>
            <span className={styles.field_label}>DOCENTE:</span>
            <Search
              onGetSuggestions={(query) => {
                return [
                  "Maria Gonzalez",
                  "Juan Perez",
                  "Pedro Perez",
                  "Alejandro Sebastian Lopez de la Cruz",
                ];
              }}
              onSearch={(query) => {
                console.log("Search", query);
              }}
            />
          </span>
        </div>
        <article>
          <h2>Evaluacion</h2>
        </article>
      </span>
    </div>
  );
};
