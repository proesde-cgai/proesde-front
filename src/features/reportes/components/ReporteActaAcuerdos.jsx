import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { faBrush, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Alert from "../../../reutilizable/Alert";
import AsideInstrucciones from "./AsideInstrucciones";
import SelectField from "../../../reutilizable/SelectField";
import styles from "./styles/ReporteActaAcuerdos.module.css";
import useStoredFecha from "../../useStoredFecha";

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Concatenar el contexto y el servicio/recurso
const API_URL = `${API_BASE_URL}/api/v1/acta-instalacion`;
const API_URL_MUNICIPIOS = `${API_BASE_URL}/api/v1/dependencia/municipio/all`;
const API_URL_COMISION = `${API_BASE_URL}/api/v1/comision/comision-usuario`;
const API_URL_MIEMBROS = `${API_BASE_URL}/api/v1/comision/miembros`;

const ReporteActaAcuerdos = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      acta: "",
      horaFecha: "",
      lugarReunion: "",
      razon: "",
      textDoc: "",
      horaTerminacion: "",
      rollo: "",
      municipio: "",
      fechaReunion: "",
    },
  });
  const fecha = useStoredFecha();
  const displayDate = fecha?.rangoFecha || "2024-2025";  

  const [error, setError] = useState("");
  const [municipios, setMunicipios] = useState([]);
  const [comsion, setComision] = useState("");
  const [miembros, setMiembros] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_MIEMBROS, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("miembros ", response.data)
        setMiembros(response.data)
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);



  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_MUNICIPIOS, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setMunicipios(response.data.municipios);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_COMISION, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setComision(response.data);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);

  const handleClickLimpiar = () => reset();

  const handleClickCancelar = () => {
    console.log("cancelando");
  };

  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmitActaAcuerdos = async (data) => {
    console.log("sumbit form");
    const camposVacios = Object.values(data).some((value) => value === "");
    /*if (camposVacios) {
      setError('Todos los campos son obligatorios');
      return;
    }*/

    const [year, month, day] = data.fechaReunion.split("-");

    const monthsInSpanish = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    const mes = monthsInSpanish[parseInt(month, 10) - 1];

    const body = {
      acta: data.acta,
      hora: data.horaFecha,
      dia: day.padStart(2, "0"),
      mes: mes.charAt(0).toUpperCase() + mes.slice(1),
      anio: year,
      sala: data.lugarReunion,
      rollo: data.rollo,
      horasfin: data.horaTerminacion,
      sede: data.municipio,
    };
    console.log("body ", body);

    try {
      const token = localStorage.getItem("accessToken");
      console.log("API_URL", API_URL);
      const response = await axios.post(API_URL, body, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      });

      generateActaInstalacionPdf(response.data)
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Please check the data");
    }
  };

  const generateActaInstalacionPdf = (response) => {
    const blob = new Blob([response], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ACTA_INSTALACION.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.containerActaAcuerdos}>
      <div className={styles.containerAside}>
        <AsideInstrucciones />
      </div>

      <div className={styles.containerContent}>
        <div>
          <h2 className={styles.titulo}>IMPRIMIR ACTA DE INSTALACIÓN</h2>
        </div>

        <div className={styles.parrafoInfo}>
          <form action="" onSubmit={handleSubmit(handleSubmitActaAcuerdos)}>
            <div>
              <p className={styles.tituloParrafo}>
                <input
                  type="text"
                  name="acta"
                  {...register("acta", { required: true })}
                  id="acta"
                  placeholder="1a"
                  className={
                    errors.acta ? `${styles.inputError} ${styles.inputSmall}` : `${styles.input} ${styles.inputSmall}`
                  }
                />
                ACTA DE INSTALACIÓN DE LA {comsion.replace(/\bnull\b/g, "").replace(/\(.*?\)/g, "").trim()}
              </p>

              <p className={styles.parrafoInfo}>
                Siendo las
                <input
                  type="text"
                  name="horaFecha"
                  {...register("horaFecha", { required: true })}
                  id="horaFecha"
                  placeholder="hh:mm"
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/[^0-9]/g, "");
                    if (value.length > 2) {
                      value = value.slice(0, 2) + ":" + value.slice(2);
                    }
                    if (value.length > 5) {
                      value = value.slice(0, 5);
                    }

                    const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
                    if (regex.test(value) || value.length === 0) {
                      e.target.value = value;
                    } else {
                      e.target.value = value;
                    }
                  }}
                  className={
                    errors.horaFecha
                      ? `${styles.inputError} ${styles.inputSmall}`
                      : `${styles.input} ${styles.inputSmall}`
                  }
                />{" "}
                hrs. del día
                <input
                  type="date"
                  name="fechaReunion"
                  id="fechaReunion"
                  className={styles.input}
                  {...register("fechaReunion")}
                />
                , en
                <input
                  type="text"
                  name="lugarReunion"
                  {...register("lugarReunion", { required: true })}
                  id="lugarReunion"
                  placeholder="<la sala de juntas>"
                  className={errors.lugarReunion ? `${styles.inputError} ${styles.input}` : styles.input}
                />
                , ubicada en
                <select
                  id="municipio"
                  {...register("municipio", { required: true })}
                  className={errors.municipio ? `${styles.input_error} ${styles.select}` : styles.select}
                >
                  <option value="">Seleccione</option>
                  {municipios.map((municipio, index) => (
                    <option key={index} value={municipio}>
                      {municipio === "CihuatlÃ¡n" ? "Cihuatlán" : municipio}
                    </option>
                  ))}
                </select>
                , Jalisco, se reunieron miembros de la {comsion.replace(/\bnull\b/g, "").replace(/\(.*?\)/g, "").trim() + " "}
                del Programa de Estímulos del Departamento Docente Promoción {displayDate}.
              </p>
            </div>

            <div className={styles.containerListMiembros}>
              <p>Los miembros de la comisión son:</p>
              <ul className={styles.ulMiembros}>
                {Object.entries(miembros).map(([key, miembro]) => (
                  <li key={key} className={styles.listItem}>
                    {miembro.nombre} <span className={styles.spanListItem}>({miembro?.nombreCargo})</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.containerRestForm}>
              <textarea
                type="text"
                name="rollo"
                {...register("rollo", { required: true })}
                id="rollo"
                placeholder="<Área para texto>"
                className={errors.textDoc ? styles.inputError : ""}
              ></textarea>
              <p>
                La reunión se dio por terminada a las
                <input
                  type="text"
                  name="horaTerminacion"
                  {...register("horaTerminacion", { required: true })}
                  id="horaTerminacion"
                  placeholder="12:00"
                  className={
                    errors.horaTerminacion
                      ? `${styles.inputError} ${styles.inputSmall}`
                      : `${styles.input} ${styles.inputSmall}`
                  }
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/[^0-9]/g, "");
                    if (value.length > 2) {
                      value = value.slice(0, 2) + ":" + value.slice(2);
                    }
                    if (value.length > 5) {
                      value = value.slice(0, 5);
                    }

                    const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
                    if (regex.test(value) || value.length === 0) {
                      e.target.value = value;
                    } else {
                      e.target.value = value;
                    }
                  }}
                />
                hrs. del presente
              </p>

              {hasErrors && (
                <Alert typeAlert={"error"}>
                  <p>Todos los campos son obligatorios</p>
                </Alert>
              )}

              <div className={styles.containerButtons}>
                <button type="button" placeholder="Limpiar" onClick={handleClickLimpiar} className="texto_con_icono">
                  Limpiar <FontAwesomeIcon icon={faBrush} color="cyan" />
                </button>
                <button type="submit" placeholder="Imprimir" value="Imprimir" className="texto_con_icono">
                  Imprimir <FontAwesomeIcon icon={faSave} color="cyan" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReporteActaAcuerdos;
