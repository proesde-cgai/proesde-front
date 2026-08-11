import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles/SelectInconformidad.module.css";

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_DEPENDENCIA_CU = `${API_BASE_URL}/api/v1/dependencia/cu`;

const IoIosArrowDown = ({ size, width, height }) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      width={width || size || "1.1em"}
      height={height || size || "1.1em"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z"></path>
    </svg>
  );
};


const SelectInconformidad = ({
  placeholder = "Seleccione una opción",
  onChange,
  disabled = false,
  value = null,
  className = "",
}) => {
  const [isVisibleOptions, setIsVisibleOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || "");
  const [optionsData, setOptionsData] = useState([]);

  const handleSelectClick = () => {
    if (!disabled) {
      setIsVisibleOptions(!isVisibleOptions);
    }
  };

  const handleOptionClick = (option) => {
    if (disabled) return;
    
    // Usar dependencia como el texto a mostrar
    const optionText = option.dependencia || option.label || "";
    setSelectedOption(optionText);
    
    if (onChange) {
      onChange(option);
    }
    
    setIsVisibleOptions(false);
  };

  const handleClearSelection = () => {
    if (disabled) return;
    setSelectedOption("");
    if (onChange) {
      onChange(null);
    }
    setIsVisibleOptions(false);
  };

  // Cerrar el dropdown al hacer click fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isVisibleOptions && !event.target.closest(`.${styles.selectContainer}`)) {
        setIsVisibleOptions(false);
      }
    };

    if (isVisibleOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisibleOptions]);


  // Llamada a la API para obtener dependencias CU
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    axios.get(API_URL_DEPENDENCIA_CU, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        
        setOptionsData(response.data?.dependenciasCU);
      })
      .catch(error => {
        console.error("Error al obtener dependencias CU:", error);
      });
  }, []);


  const displayText = selectedOption || placeholder;

  return (
    <div className={`${styles.selectContainer} ${disabled ? styles.disabled : ""} ${className}`}>
      <div
        className={styles.selectBox}
        onClick={handleSelectClick}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      >
        <span className={styles.selectText}>{displayText}</span>
        <span className={`${styles.arrowIcon} ${isVisibleOptions ? styles.arrowUp : styles.arrowDown}`}>
          <IoIosArrowDown />
        </span>
      </div>

      {isVisibleOptions && !disabled && (
        <div className={styles.optionsContainer}>
          <div 
            className={styles.option} 
            onClick={handleClearSelection}
          >
            {placeholder}
          </div>
          {optionsData.length > 0 ? (
            optionsData.map((option) => (
              <div
                key={option.id}
                className={`${styles.option} ${
                  selectedOption === option.dependencia ? styles.selectedOption : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option.dependencia}
              </div>
            ))
          ) : (
            <div className={styles.optionDisabled}>No hay opciones disponibles</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectInconformidad;

