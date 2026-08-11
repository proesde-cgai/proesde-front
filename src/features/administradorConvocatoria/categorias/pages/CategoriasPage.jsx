import React from "react";
import styles from "../styles/CategoriaPage.module.css";
import CategoriaForm from "../components/CategoriaForm";

function CategoriasPage() {
  return (
    <>
      <article>
        <h3 className={styles.constancia_title}>Estadísticas</h3>
      </article>
      <div className={styles.container}>
        <section className={styles.instructions}>
          <h4>INSTRUCCIONES</h4>
          <p>
            Pueden imprimirse varios reportes: <br /> Sólo es posible ejecutar
            un reporte a la vez
          </p>
        </section>
        <div className={styles.form_section}>
          <CategoriaForm />
        </div>
      </div>
    </>
  );
}

export default CategoriasPage;
