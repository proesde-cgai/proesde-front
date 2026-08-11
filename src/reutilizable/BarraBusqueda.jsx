import styles from "./styles/barraBusquda.module.css"

export const BarraBusqueda = () => {
  return (
    <>
      <div className={styles.searchBar}>
        <p className={styles.titleSearch}>Seleccionar</p>
        <div className={styles.searchContainer}>
          <div>
            <div className={styles.center}>
              <input
                className={styles.search}
                type="text"
                placeholder="Teclee su busqueda"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`${styles.size_6} size-6`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
