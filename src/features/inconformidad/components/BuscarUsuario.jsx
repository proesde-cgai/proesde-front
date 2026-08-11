import { useState } from "react";
import styles from "./styles/BuscarUsuario.module.css";

const mockData = [
  { nombre: "Alan Gonzalez" },
  { nombre: "David Diaz" },
  { nombre: "Alfredo Valenzuela" },
];

export const BuscarUsuario = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      const results = mockData.filter((user) =>
        user.nombre.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  const showInfoUser = (user) => {
    console.log(user);
  };

  return (
    <div className={styles.form_container}>
      <form className={styles.form}>
        <select className={styles.dependencia} defaultValue="">
          <option value="" disabled>
            Selecciona una dependencia
          </option>
          <option value="a">Dependencia A</option>
          <option value="b">Dependencia B</option>
          <option value="c">Dependencia C</option>
          <option value="d">Dependencia D</option>
        </select>
        <input
          type="text"
          className={styles.text_input}
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </form>

      <div className={styles.resultados_busqueda}>
        {filteredResults.length > 0 ? (
          filteredResults.map((user, index) => (
            <h4
              className={styles.result}
              key={index}
              onClick={() => showInfoUser(user)}
            >
              {user.nombre}
            </h4>
          ))
        ) : (
          <p className={styles.result}>No se encontraron resultados</p>
        )}
      </div>
    </div>
  );
};
