import React, { useEffect, useState } from "react";
import styles from "./styles/Select.module.css";
import axios from "axios";
import { useSearchStore } from "../store/useSearchStore";
import { useDependenciaStore } from "../store/useDependenciaStore";
// import { IoIosArrowDown } from "react-icons/io";

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
/**
 * Componente Select
 * @param {Object} props
 * @param {Array} props.options - Opciones del select
 * @param {String} props.placeholder - Placeholder del select
 * @param {Object} props.form - form de react-hook-form
 * @param {String} props.name - Nombre del campo del form
 *
 * @example
 * const form = useForm();
 * const options = [{ value: 1, label: "Opción 1" }, { value: 2, label: "Opción 2" }];
 *
 * <Select options={options} form={form} name="campo" />
 *
 */

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Concatenar el contexto y el servicio/recurso
const API_URL_SELECCIONE = `${API_BASE_URL}/api/v1/dependencia/admingral`;
const API_URL_SEARCH = `${API_BASE_URL}/api/v1/solicitud/lista-participantes`;

const Select = ({
  options,
  placeholder = "Seleccione una opción",
  form,
  name,
  disabled = false,
  onSelectParticipants,
  aliasActividad
}) => {
  const [isVisibleOptions, setIsVisibleOptions] = useState(false);
  const [dependencias, setDependencias] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

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

  const handleSelectClick = () => {
    if (!disabled) {
      setIsVisibleOptions(!isVisibleOptions);
    }
  };

  const handleOptionClick = async (option) => {
    useDependenciaStore.getState().setDependencia({ idDependencia: option.id, palabraClave: option.siglas });
    if (disabled) return;
    setSelectedOption(option.siglas);
    const token = localStorage.getItem("accessToken");

    const body = {
      idDependencia: option.id.toString(),
      palabraClave: option.siglas || "",
    };

    try {
      const response = await axios.post(
        API_URL_SEARCH,
        {
          idDependencia: option.id,
          palabraClave: "",
          aliasActividad,
        },
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        console.log("Storing academicos data", response);
        useSearchStore.getState().setAcademicos(response.data);
        onSelectParticipants(response.data);
      }
    } catch (error) {
      console.error("Error making POST request:", error);
    }
    if (form) {
      form.setValue(name, option.dependencia);
    }
    setIsVisibleOptions(false);
  };

  return (
    <div className={`${styles.selectContainer} ${disabled ? styles.disabled : ""}`}>
      <div
        className={styles.selectBox}
        onClick={handleSelectClick}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      >
        {selectedOption || placeholder}
        {isVisibleOptions ? <IoIosArrowDown /> : <IoIosArrowDown />}
      </div>

      {isVisibleOptions && !disabled && (
        <div className={styles.optionsContainer}>
          <div className={styles.option} onClick={() => setIsVisibleOptions(false)}>
            {placeholder}{" "}
          </div>
          {dependencias?.map((option) => (
            <div key={option.id} className={styles.option} onClick={() => handleOptionClick(option)}>
              {option.dependencia}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
