import React, { useEffect, useState } from "react";
import styles from "../page/GenerarReporte.module.css";
import style from "../styles/DynamicField.module.css"
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SELECCIONE = `${API_BASE_URL}/api/v1/dependencia/admingral`;

const DynamicField = ({ reportType, onDynamicChange  }) => {
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [dependencias, setDependencias] = useState([]);

    useEffect(() => {
      const token = localStorage.getItem("accessToken");
  
      axios
        .get(API_URL_SELECCIONE, {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setDependencias(response.data.dependenciasADMINGRAL);
        })
        .catch((error) => console.error("Error fetching dependencias: ", error));
    }, []);

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const updatedCheckboxes = checked
          ? [...selectedCheckboxes, value]
          : selectedCheckboxes.filter((item) => item !== value);
        setSelectedCheckboxes(updatedCheckboxes);
        onDynamicChange("contra", updatedCheckboxes); 
    };

    const handleSelectChange = (e) => {
        
        onDynamicChange("contra", e.target.value); 
    };

    // if (reportType === "2") {
    //     return (
    //     <div className={styles.row}>
    //         <label className={styles.label}>Documentos:</label>
    //         <div className={styles.checkboxes}>
    //         <label>
    //             <input type="checkbox" value="doc1" onChange={handleCheckboxChange}/> Documento 1
    //         </label>
    //         <label>
    //             <input type="checkbox" value="doc2" onChange={handleCheckboxChange}/> Documento 2
    //         </label>
    //         <label>
    //             <input type="checkbox" value="doc3" onChange={handleCheckboxChange}/> Documento 3
    //         </label>
    //         <label>
    //             <input type="checkbox" value="doc4" onChange={handleCheckboxChange}/> Documento 4
    //         </label>
    //         </div>
    //     </div>
    //     );
    // }

  if (reportType === "6") {
    return (
      <div className={styles.row}>
        <label htmlFor="dependencias" className={styles.label}>
          Dependencias:
        </label>
        <select id="dependencias" className={style.selectDep} onChange={handleSelectChange}>
          <option value="">Seleccione una dependencia</option>
          {dependencias?.map((option) => (
            <option key={option.id} value={option.id} >
              {option.dependencia}
            </option>
          ))}
        </select>
      </div>
    );
  }

};

export default DynamicField;
