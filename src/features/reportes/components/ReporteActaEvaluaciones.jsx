import { faBrush, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../hooks/api";
import Alert from "../../../reutilizable/Alert";
import useStoredFecha from "../../useStoredFecha";
import AsideInstrucciones from "./AsideInstrucciones";
import styles from "./styles/ReporteActaEvaluaciones.module.css";

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Concatenar el contexto y el servicio/recurso
const API_URL = `${API_BASE_URL}/api/v1/acta-reporte-evaluados`;
const API_URL_MUNICIPIOS = `${API_BASE_URL}/api/v1/dependencia/municipio/all`;
const API_URL_COMISION = `${API_BASE_URL}/api/v1/comision/comision-usuario`;

const formatDate = (date, isEndDate = false) => {
  if (!date) return null;
  const time = isEndDate ? "23:59:59.999" : "00:00:00.000";
  return `${date} ${time}`;
};

const initialFormState = {
  defaultValues: {
    numActa: "",
    horaFecha: "",
    lugarReunion: "",
    horaTerminacion: "",
    tipoFechaImpresion: "",
    fechaDesde: "",
    fechaHasta: "",
    municipio: "",
    fechaReunion: "",
  },
}

const ReporteActaEvaluaciones = () => {
  const { handleSubmit, reset, register, watch, formState } = useForm(initialFormState);
  const fecha = useStoredFecha();
  const displayDate = fecha?.rangoFecha || "2024-2025";

  const { errors } = formState

  const [isActivoPeriodoFecha, setIsActivoPeriodoFecha] = useState(false);
  const [municipios, setMunicipios] = useState([]);
  const [comsion, setComision] = useState("");
  const [alertMessage, setAlertMessage] = useState({});
  const [isVisibleAlert, setIsVisibleAlert] = useState(false);

  useEffect(() => {
    api.get(API_URL_MUNICIPIOS)
      .then((response) => {
        setMunicipios(response.data.municipios);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);

  useEffect(() => {
    api.get(API_URL_COMISION)
      .then((response) => {
        setComision(response.data);
      })
      .catch((error) => console.error("Error fetching grados: ", error));
  }, []);

  const handleClickLimpiar = () => reset();

  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmitActaEvaluaciones = async (data) => {
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

    console.log("numActa", data.numActa);
    const body = {
      acta: data.numActa,
      hora: data.horaFecha,
      dia: day.padStart(2, "0"),
      mes: mes.charAt(0).toUpperCase() + mes.slice(1),
      anio: year,
      sala: data.lugarReunion,
      horasfin: data.horaTerminacion,
      inicioDate: formatDate(data.fechaDesde) || null,
      finDate: formatDate(data.fechaHasta, true) || null,
      sede: data.municipio,
    };

    console.log("body", body);

    try {
      const response = await api.post(API_URL, body, { responseType: "blob" })
      generateActaEvaluacionPdf(response.data)
    } catch (error) {
      console.error("Error during submission:", error);
      setAlertMessage({ type: 'error', msg: 'No se encontraron datos suficientes para la generacion del reporte.' });
      setIsVisibleAlert(true);
      setTimeout(() => {
        setIsVisibleAlert(false);
      }, 3000);
      // throw new Error("Please check the data");
    }
  };

  const periodoFecha = watch("tipoFechaImpresion");
  useEffect(() => {
    const activoPeriodoFecha = periodoFecha === "periodo";
    if (activoPeriodoFecha) {
      setIsActivoPeriodoFecha(true);
    } else {
      setIsActivoPeriodoFecha(false);
    }
  }, [isActivoPeriodoFecha, periodoFecha]);

  const generateActaEvaluacionPdf = (response) => {
    const blob = new Blob([response], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ACTA_EVALUACION.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerAside}>
        <AsideInstrucciones />
      </div>

      <div className={styles.containerContent}>
        <div>
          <h2 className={styles.titulo}>IMPRIMIR ACTA DE EVALUACIONES</h2>
        </div>

        <div className={styles.parafoInfo}>
          <form action="" onSubmit={handleSubmit(handleSubmitActaEvaluaciones)}>
            <div>
              <p className={styles.tituloParrafo}>
                <input
                  type="text"
                  name="numActa"
                  {...register("numActa", { required: true })}
                  id="numActa"
                  placeholder="1a"
                  className={
                    errors.acta ? `${styles.inputError} ${styles.inputSmall}` : `${styles.input} ${styles.inputSmall}`
                  }
                />
                ACTA DE ASIGNACIÓN DE NIVEL
              </p>

              <p className={styles.parrafo_info}>
                Siendo las
                <input
                  type="text"
                  name="horaFecha"
                  {...register("horaFecha", { required: true })}
                  id="horaFecha"
                  placeholder="hh:mm"
                  className={
                    errors.horaFecha
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
                  className={errors.lugarReunion ? `${styles.inputError}` : `${styles.input}`}
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
                del Programa de Estímulos del Departamento Docente Promoción {displayDate}, para la evaluación de
                expedientes.
              </p>

              <p>
                La reunión se dio por terminada a las
                <input
                  type="text"
                  name="horaTerminacion"
                  {...register("horaTerminacion", { required: true })}
                  id="horaTerminacion"
                  placeholder="hh:mm"
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
            </div>

            <div className={styles.containerOpciones}>
              <p>Hay dos opciones para imprimir el reporte de los expedientes evaluados:</p>

              <div>
                <div className={styles.inputRadio}>
                  <input
                    type="radio"
                    id="hoy"
                    value="hoy"
                    {...register("tipoFechaImpresion", { required: true })}
                    className={errors.tipoFechaImpresion ? styles.inputError : styles.input_radio}
                  />
                  <label htmlFor="hoy" className={styles.label}>
                    De hoy
                  </label>
                </div>
                <div className={styles.inputRadio}>
                  <input
                    type="radio"
                    id="periodo"
                    value="periodo"
                    {...register("tipoFechaImpresion", { required: true })}
                  />
                  <label htmlFor="periodo" className={styles.label}>
                    De un período entre dos fechas
                  </label>
                </div>

                <div>
                  {isActivoPeriodoFecha && (
                    <div className={styles.containerInputFechas}>
                      <div>
                        <label htmlFor="fechaDesde" className={styles.label}>
                          Desde:
                        </label>
                        <input
                          type="date"
                          name="fechaDesde"
                          id="fechaDesde"
                          className={styles.input}
                          {...register("fechaDesde")}
                        />
                      </div>
                      <div>
                        <label htmlFor="fechaHasta" className={styles.label}>
                          Hasta:
                        </label>
                        <input
                          type="date"
                          name="fechaHasta"
                          id="fechaHasta"
                          className={styles.input}
                          {...register("fechaHasta")}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              {hasErrors && (
                <Alert typeAlert={"error"}>
                  <p>Todos los campos son obligatorios</p>
                </Alert>
              )}
              {isVisibleAlert && (
                <Alert typeAlert={alertMessage.type}>
                  <p>{alertMessage.msg}</p>
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

export default ReporteActaEvaluaciones;
