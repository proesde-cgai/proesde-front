import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TablaResultadosEvaluacion from "../../evaluacion/components/TablaResultadosEvaluacion";
import Loading from "../../../reutilizable/Loading";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import {
  datosEvaluacionInconformidad,
  evaluarInconformidad,
} from "../services/evaluacionInconformidadService";
import arbolCriteriosJson from "../services/arbolCriterios.json";
import { ERROR_MESSAGES_GENERICS_API } from "../../../utils/messagesFromAPI";
import Alert from "../../../reutilizable/Alert";
import Criterios from "./Criterios";
import styles from "./styles/FormEvaluacionInconformidad.module.css";
import { useInconformidadStore } from "../../../store/useInconformidadStore";
import { fetchStatus } from "../../secretaria/secretariaAdminSems/GenerarDocInconformidad/hooks/useFetchStatus";

const ALIAS_ACTIVIDAD = {
  inconformidad: "inconformidad",
  evaluacion: "evaluacion",
};

const FormEvaluacionInconformidad = () => {
  const { idSolicitud } = useEvaluationStore();
  const {
    setUltimoMiembro,
    statusInconformidad,
    selectedDataAcademicoFull,
    idSolicitudInconformidad,
    fetchStatusInconformidad,
  } = useInconformidadStore();
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [resultadosEvaluacion, setResultadosEvaluacion] = useState();
  const [nivel, setNivel] = useState();
  const [arbolCriterios, setArbolCriterios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [miembros, setMiembros] = useState([]);
  const [puntaje, setPuntaje] = useState({});
  const [mensaje, setMensaje] = useState({
    type: null,
    mensaje: null,
  });
  const [message, setMessage] = useState({
    type: null,
    mensaje: null,
  });
  
  const [codigoUsuario, setCodigoUsuario] = useState(null);

  const username = localStorage.getItem("userName" || "");

  const [selectedValue, setSelectedValue] = useState(0);
  const [respuestaAcademico, setRespuestaAcademico] = useState("");
  console.log("Info Full", selectedDataAcademicoFull);
  console.log("idSolicitud info: ", idSolicitudInconformidad);
  

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

    useEffect(() => {
      const subscription = watch((value) => {
        console.log("Valores del formulario: ", value);
        localStorage.setItem("formValues", JSON.stringify(value)); // Guardar los valores en el localStorage
      });
  
      if (localStorage.getItem("formValues")) {
        const storedValues = JSON.parse(localStorage.getItem("formValues"));
        Object.keys(storedValues).forEach((key) => {
          setValue(key, storedValues[key] || "");
        });
      }
  
      return () => subscription.unsubscribe(); // Limpiar la suscripción al desmontar
    }, [watch, setValue]);
    
  useEffect(() => {
    if (username) setCodigoUsuario(username);
  }, [username]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [idSolicitud]);

  const getData = async () => {
    setMensaje(null);
    const tipoParticipacion = ALIAS_ACTIVIDAD.inconformidad;

    if (idSolicitud) {
      setIsLoading(true);

      await datosEvaluacionInconformidad(idSolicitud, tipoParticipacion)
        .then((data) => {
          setMiembros(data.miembros);
          setArbolCriterios(data.arbolCriterios);
          setResultadosEvaluacion(data.tablaResultados);
          setPuntaje(data.puntaje);
          setNivel(data.nivelPrimerEvaluacion);
          setSelectedValue(data.ratificaModifica);
          setRespuestaAcademico(data.respuestaInconformidad);
          setUltimoMiembro(data.ultimoMiembro.nombre);
          
          // Inicializar todos los valores de criterios en el formulario
          // Esto asegura que React Hook Form capture todos los valores
          if (data.puntaje) {
            Object.keys(data.puntaje).forEach((key) => {
              const value = data.puntaje[key];
              setValue(key, value !== null && value !== undefined ? String(value) : "0");
            });
          }
          
          // Inicializar ratificaModifica si existe
          if (data.ratificaModifica !== null && data.ratificaModifica !== undefined) {
            setValue("ratificaModifica", data.ratificaModifica);
          }
        })
        .catch((error) => {
          if (error.response) {
            const message = error.response?.data?.mensaje
              ? "La Comisión de este integrante no está configurada"
              : ERROR_MESSAGES_GENERICS_API[error.response.status] ||
                ERROR_MESSAGES_GENERICS_API.default;
            setMensaje({
              mensaje: message,
              type: "error",
            });
          }
        })
        .finally(() => setIsLoading(false));
    }
    fetchStatusInconformidad();
  };

  useEffect(() => {
    setArbolCriterios(arbolCriteriosJson.arbolCriterios);
  }, []);

  useEffect(() => {
    setMiembros(arbolCriteriosJson.miembros);
  }, []);

  const handleSubmitEvaluacion = async (data) => {
    console.log("Datos del formulario recibidos:", data);
    
    const aliasActividad = ALIAS_ACTIVIDAD.inconformidad;
    const { idMiembro, ratificaModifica, ...rest } = data;
    const idMiembroToNumber = Number(idMiembro);

    // Filtrar solo los campos de criterios (excluir idMiembro y ratificaModifica)
    const valoresPuntajeData = rest;
    console.log("Valores de puntaje antes de procesar:", valoresPuntajeData);

    // Procesar valores: convertir a string y reemplazar valores vacíos/null/undefined con "0"
    const valoresPuntajeFormat = Object.keys(valoresPuntajeData).reduce(
      (acc, key) => {
        const value = valoresPuntajeData[key];
        // Si el valor está vacío, null, undefined o es un string vacío después de trim, usar "0"
        if (value === undefined || value === null || value === "" || String(value).trim() === "") {
          acc[key] = "0";
        } else {
          acc[key] = String(value).trim();
        }
        return acc;
      },
      {}
    );

    console.log("Valores de puntaje después de procesar:", valoresPuntajeFormat);

    // Verificar si hay campos que después del procesamiento siguen siendo problemáticos
    // Esto no debería ocurrir, pero lo verificamos por seguridad
    const problematicFields = Object.entries(valoresPuntajeFormat).filter(([key, value]) => {
      return value === "" || value === null || value === undefined;
    });

    if (problematicFields.length > 0) {
      console.error("Campos problemáticos encontrados después del procesamiento:", problematicFields);
      setMessage({
        mensaje: "Error al procesar los valores del formulario. Por favor, recargue la página e intente nuevamente.",
        type: "error",
      });

      setTimeout(() => {
        setMessage(null);
      }, 5000);

      return; 
    }

    const body = {
      idSolicitud,
      idMiembro: idMiembroToNumber,
      aliasActividad,
      valoresPuntaje: valoresPuntajeFormat,
      ratificaModifica: selectedValue,
      respuestaInconformidad: respuestaAcademico,
    };

    await evaluarInconformidad(body)
      .then((response) => {
        console.log(response);
        setMessage({
          mensaje: "Evaluación guardada correctamente. Puede realizar otra evaluación si lo desea.",
          type: "success",
        });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      })
      .catch((error) => {
        console.error("Error al evaluar la inconformidad: ", error);
        if (error.response) {
          const message =
            ERROR_MESSAGES_GENERICS_API[error.response.status] ||
            ERROR_MESSAGES_GENERICS_API.default;
          setMensaje({
            mensaje: message,
            type: "error",
          });
        }
      })
      .finally(() => {
        getData();
      });
  };

  const currentUser = miembros?.find(
    (miembro) => miembro.codigo.toString() === codigoUsuario
  );
  useEffect(() => {
    if (codigoUsuario) {
      setValue("idMiembro", currentUser?.id);
    }
  }, [currentUser, setValue, codigoUsuario]);
  if (isLoading) return <Loading />;

  if (mensaje) {
    return (
      <Alert typeAlert={mensaje.type}>
        <p>{mensaje.mensaje}</p>
      </Alert>
    );
  }

  console.log(currentUser);

  //if (!arbolCriterios || arbolCriterios.length === 0) return null;

  return (
    <form onSubmit={handleSubmit(handleSubmitEvaluacion)}>
      {message && (
        <Alert typeAlert={message.type}>
          <p>{message.mensaje}</p>
        </Alert>
      )}
      <div className={styles.formEvaluacion}>
        <Criterios
          criterios={arbolCriterios}
          puntaje={puntaje}
          register={register}
          watch={watch}
          setValue={setValue}
          pdfDraw={true}
          typeRadio={0}
        />
      </div>

      {/* Sección del resto del formulario */}
      <div className={styles.restForm}>
        <div className={styles.containerInputsSelectRadio}>
          <div className={styles.inputSelect}>
            <select
              disabled
              {...register("idMiembro")}
              value={watch("idMiembro") || ""}
              onChange={(e) => setValue("idMiembro", e.target.value)}
            >
              <option value="" disabled>
                -- Seleccione el nombre de la lista --
              </option>
              {miembros.map((miembro) => (
                <option key={miembro.codigo} value={miembro.id}>
                  {miembro.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputRadio}>
            <div>
              <input
                type="radio"
                name="ratificaModifica"
                {...register("ratificaModifica", {
                  required:
                    "Debes seleccionar alguna opcion entre Ratifica y Modifica.",
                })}
                value={0}
                checked={selectedValue === 0}
                onChange={(e) => {
                  setSelectedValue(Number(e.target.value));
                  setValue("ratificaModifica", Number(e.target.value)); // Sincronizar con react-hook-form
                }}
              />
              <label htmlFor="ratifica">Ratifica</label>
            </div>
            <div>
              <input
                type="radio"
                name="ratificaModifica"
                {...register("ratificaModifica", {
                  required:
                    "Debes seleccionar alguna opcion entre Ratifica y Modifica.",
                })}
                value={1}
                checked={selectedValue === 1}
                onChange={(e) => {
                  setSelectedValue(Number(e.target.value));
                  setValue("ratificaModifica", Number(e.target.value)); // Sincronizar con react-hook-form
                }}
              />
              <label htmlFor="modifica">Modifica</label>
            </div>
          </div>
          {errors.ratificaModifica && (
            <>
              <Alert typeAlert={"error"}>
                <p>{errors.ratificaModifica.message}</p>
              </Alert>
            </>
          )}
        </div>

        <div className={styles.textarea}>
          <label htmlFor="respuestaAcademico" style={{ marginBottom: 20 }}>
            Escriba la respuesta del académico
          </label>
          <textarea
            name="respuestaAcademico"
            value={respuestaAcademico}
            onChange={(e) => setRespuestaAcademico(e.target.value)}
          ></textarea>
        </div>

        <div className={styles.submit}>
          <button className={styles.submitButton} type="submit">Evaluar</button>
        </div>
        
        <div className={styles.submit}>
          <TablaResultadosEvaluacion
            resultados={resultadosEvaluacion}
            nivel={nivel}
          />
        </div>
      </div>
    </form>
  );
};

export default FormEvaluacionInconformidad;
