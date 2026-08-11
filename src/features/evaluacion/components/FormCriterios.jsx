import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Alert from "../../../reutilizable/Alert";
import Loading from "../../../reutilizable/Loading";
import { useFormCriterios } from "../hooks/useFormCriterios";
import ProcesarCriterios from "./ProcesarCriterios";
import styles from "./styles/FormCriterios.module.css";
import TablaResultadosEvaluacion from "./TablaResultadosEvaluacion";
import { Spin } from "antd";
import { useEvaluationStore } from "../../../store/useEvaluationStore";

const FormCriterios = () => {
  const [codigoUsuario, setCodigoUsuario] = useState(null);
  const { fetchStatusEvaluacion, statusEvaluacion } = useEvaluationStore();
  const { idSolicitud } = useEvaluationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [criteriosDedicacion, setCriteriosDedicacion] = useState([]);
  const hasRestoredRef = useRef(false);
  const draftStorageKey = idSolicitud
    ? `evaluacion_formValues_${idSolicitud}`
    : "evaluacion_formValues";

  const username = localStorage.getItem("userName" || "");

  useEffect(() => {
    if (username) setCodigoUsuario(username);
  }, [username]);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  // Persistir valores en localStorage al cambiar
  useEffect(() => {
    hasRestoredRef.current = false;
  }, [draftStorageKey]);

  useEffect(() => {
    const subscription = watch((value) => {
      console.log("Valores del formulario: ", value);
      const serialized = JSON.stringify(value);
      localStorage.setItem(draftStorageKey, serialized);
      sessionStorage.setItem(draftStorageKey, serialized);
    });
    return () => subscription.unsubscribe();
  }, [watch, draftStorageKey]);

  const { miembros, arbolCriterios, resultadosEvaluacion, nivel, puntaje, isLoading, mensaje, onSubmitEvaluar } =
    useFormCriterios();

  // Restaurar desde localStorage solo cuando ya existen los criterios (campos registrados).
  // Así los radios de "Dedicación a la docencia" reciben correctamente el valor al volver a la pestaña.
  useEffect(() => {
    if (!arbolCriterios || hasRestoredRef.current) return;
    const stored = sessionStorage.getItem(draftStorageKey)
      || localStorage.getItem(draftStorageKey);
    if (!stored) return;

    const storedValues = JSON.parse(stored);
    Object.keys(storedValues).forEach((key) => {
      let value = storedValues[key];
      if (value === undefined || value === null) {
        value = "";
      } else if (value === 1 || value === "1" || value === 0 || value === "0") {
        value = String(value);
      }
      setValue(key, value, { shouldValidate: false });
    });
    hasRestoredRef.current = true;
  }, [arbolCriterios, setValue, draftStorageKey]);

  // Preselect the member when codigoUsuario is available
  const currentUser = miembros?.find((miembro) => miembro.codigo.toString() === codigoUsuario);
  useEffect(() => {
    if (codigoUsuario) {
      setValue("idMiembro", currentUser?.id);
    }
  }, [currentUser, setValue, codigoUsuario]);

  useEffect(() => {
    if (arbolCriterios) {
      const dedicacion = arbolCriterios[1].subCriterios;

      const criterios = [];
      for (const item of Object.values(dedicacion)) {
        criterios.push(item.criterio.id);
      }
      setCriteriosDedicacion(criterios);
    }
  }, [arbolCriterios]);

  const handleFormSubmit = async (data) => {
    // const criterios = [];
    // for (const item of Object.values(criteriosDedicacion)) {
    //   criterios.push(item.criterio.id);
    // }

    console.log("Criterios: ", criteriosDedicacion);
    console.log("Data: ", data);

    const hasEmptyValues = Object.values(data).some((value) => value === "");

    if (hasEmptyValues) return alert("No puede dejar un puntaje vacío");

    const isCriterioValid = criteriosDedicacion.some((id) => data[id] === "1");

    if (!isCriterioValid) {
      alert("Debe seleccionar un criterio de dedicación");
      return;
    }

    setIsSubmitting(true);
    await onSubmitEvaluar(data);
    fetchStatusEvaluacion();
    reset({ idMiembro: selectedMiembro });
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  if (isLoading) {
    return <Loading />;
  }

  const selectedMiembro = watch("idMiembro");

  // console.log("Lista de miembros: ", miembros);
  // console.log("Arbol criterios: ", arbolCriterios);
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {mensaje && (
        <Alert typeAlert={mensaje.type}>
          <p>{mensaje.mensaje}</p>
        </Alert>
      )}
      <div className={styles.formEvaluacion}>
        <ProcesarCriterios
          criterios={arbolCriterios}
          puntaje={puntaje}
          register={register}
          watch={watch}
          setValue={setValue}
          pdfDraw={true}
          typeRadio={0}
          criteriosDedicacion={criteriosDedicacion}
        />
      </div>

      {/* Sección del resto del formulario */}
      <div className={styles.restForm}>
        {console.log("codigoUsuario ", codigoUsuario)}
        <div className={styles.containerInputsSelectRadio}>
          <div className={styles.inputSelect}>
            <select
              disabled
              name="miembro"
              id="miembro"
              {...register("idMiembro", {
                required: {
                  value: true,
                  message: "Seleccione un miembro",
                },
              })}
              value={selectedMiembro || ""}
              onChange={(e) => setValue("idMiembro", e.target.value)} // Actualizamos el id seleccionado
            >
              <option value="" disabled>
                -- Seleccione el nombre de la lista --
              </option>
              {miembros &&
                miembros.map((miembro) => (
                  <option key={miembro.id} value={miembro.id}>
                    {miembro.nombre}
                  </option>
                ))}
            </select>
            {errors.idMiembro && <Alert typeAlert="error">{errors.idMiembro.message}</Alert>}
          </div>
        </div>

        <div className={styles.submit}>
          <button
            type="submit"
            disabled={isSubmitting || isLoading || statusEvaluacion === 9}
            className={statusEvaluacion === 9 ? styles.btnDisabled : ""}
          >
            {isLoading && <Spin style={{ marginRight: "10px" }} />}
            Evaluar
          </button>
          <TablaResultadosEvaluacion resultados={resultadosEvaluacion} nivel={nivel} />
        </div>
      </div>
    </form>
  );
};

export default FormCriterios;
