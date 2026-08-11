import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Table.module.css";
import {
  faFilePdf,
  faMagnifyingGlass,
  faPrint,
  faSquarePen,
} from "@fortawesome/free-solid-svg-icons";

export const Table = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <label htmlFor="search-input">Buscar:</label>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Teclee su búsqueda..."
          />
          <button className={styles.searchIcon}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>

          <span className={styles.searchText}>en</span>
          <select className={styles.searchSelect}>
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
            <option value="opcion3">Opción 3</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Ed.</th>
              <th>Código</th>
              <th>APELLIDO(S) Nombre(s)</th>
              <th>Nivel</th>
              <th>Dependencia</th>
              <th>Pts.</th>
              <th>Calidad</th>
              <th>Hrs.</th>
              <th>Antigüedad</th>
              <th>Grado</th>
              <th>¿Dir?</th>
              <th>¿Baja?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <button className={styles.buttonEdit}>
                  <FontAwesomeIcon icon={faSquarePen} />
                </button>
              </td>
              <td>456789</td>
              <td>Juan Pérez</td>
              <td><span className={styles.numberIcon}>III</span></td>
              <td>Facultad de Ciencias</td>
              <td>45</td>
              <td>Alta</td>
              <td>10</td>
              <td>5 años</td>
              <td>Doctorado</td>
              <td>No</td>
              <td>No</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.buttonContainer}>
          <button className={styles.optionButton}>
            Generar PDF <FontAwesomeIcon icon={faFilePdf} />
          </button>
          <button className={styles.optionButton}>
            Imprimir <FontAwesomeIcon icon={faPrint} />
          </button>
        </div>
      </div>
    </>
  );
};
