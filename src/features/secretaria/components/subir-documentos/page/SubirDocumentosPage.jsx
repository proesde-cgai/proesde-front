import React, { useState } from "react";

import styles from "../styles/SubirDocumentosPage.module.css";
import SubirDocumentosTable from "../components/SubirDocumentosTable";

const SubirDocumentosPage = ({ userInfo }) => {
  const [materias, setMaterias] = useState([]);

  return (
    <div>
      <article>
        <header>
          <h3 className={styles.constancia_title}>
            Subir documentos
          </h3>
        </header>

        <SubirDocumentosTable
          materias={materias}
          setMaterias={setMaterias}
          userInfo={userInfo}
        />

      </article>
    </div>
  );
};

export default SubirDocumentosPage;
