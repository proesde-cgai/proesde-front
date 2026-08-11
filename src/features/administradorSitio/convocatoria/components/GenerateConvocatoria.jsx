import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import Textarea from "../../components/TextArea";
import Modal from "./ModalSucess";
import styles from "../styles/FormField.module.css";
import useConvocatoria from "../hooks/useConvocatoria";

const convertDateFormat = (date) => {
  if (!date) return "";
  return date.replace(/\//g, "-");
};

const formatToResponseDate = (date) => {
  if (!date) return "";
  return date.split("-").join("/");
};

const GenerateConvocatoria = ({ convocatoria }) => {
  const { createConvocatoria, updateExistingConvocatoria, isLoading } = useConvocatoria();

  const [isFormValid, setIsFormValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(!!convocatoria);
  const [formValues, setFormValues] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFinal: "",
    fechaCiclo: "",
    fechaCicloB: "",
    comentarios: "",
  });

  useEffect(() => {
    if (convocatoria) {
      setFormValues({
        nombre: convocatoria.nombre || "",
        fechaInicio: convertDateFormat(convocatoria.fechaInicio),
        fechaFinal: convertDateFormat(convocatoria.fechaFin),
        fechaCiclo: convertDateFormat(convocatoria.fechaCiclo),
        fechaCicloB: convertDateFormat(convocatoria.fechaCicloB),
        comentarios: convocatoria.comentarios || "",
      });
    }
  }, [convocatoria]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "fechaFinal" && formValues.fechaInicio) {
      if (new Date(value) < new Date(formValues.fechaInicio)) {
        alert("❌ La fecha final no puede ser menor que la fecha de inicio.");
        return;
      }
    }

    if (name === "fechaCicloB" && formValues.fechaCiclo) {
      if (new Date(value) < new Date(formValues.fechaCiclo)) {
        alert("❌ La fecha ciclo B no puede ser menor que el ciclo A.");
        return;
      }
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    const { nombre, fechaInicio, fechaFinal, fechaCiclo, fechaCicloB, comentarios } = formValues;

    const isFormValid =
      nombre.trim() &&
      fechaInicio &&
      fechaFinal &&
      fechaCiclo &&
      fechaCicloB &&
      comentarios.trim();

    setIsFormValid(isFormValid);
  }, [formValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedValues = {
      ...formValues,
      fechaInicio: formatToResponseDate(formValues.fechaInicio),
      fechaFin: formatToResponseDate(formValues.fechaFinal),
      fechaCiclo: formatToResponseDate(formValues.fechaCiclo),
      fechaCicloB: formatToResponseDate(formValues.fechaCicloB),
    };

    try {
      if (isEditing) {
        await updateExistingConvocatoria(convocatoria.id, formattedValues);
        setIsModalOpen(true);
      } else {
        await createConvocatoria(formattedValues);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error al enviar convocatoria:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <Input
            type="text"
            label={"Nombre"}
            name="nombre"
            value={formValues.nombre}
            onChange={handleInputChange}
            placeholder="Nombre de convocatoria"
          />

          <Input
            type="date"
            label={"Fecha Inicial"}
            name="fechaInicio"
            value={formValues.fechaInicio}
            onChange={handleInputChange}
          />

          <Input
            type="date"
            label={"Fecha Final"}
            name="fechaFinal"
            value={formValues.fechaFinal}
            onChange={handleInputChange}
            disabled={!formValues.fechaInicio}
          />

          <Input
            type="date"
            label={"Fecha Ciclo"}
            name="fechaCiclo"
            value={formValues.fechaCiclo}
            onChange={handleInputChange}
          />

          <Input
            type="date"
            label={"Fecha Ciclo B"}
            name="fechaCicloB"
            value={formValues.fechaCicloB}
            onChange={handleInputChange}
          />

          <Textarea
            label={"Comentarios"}
            name="comentarios"
            value={formValues.comentarios}
            placeholder={"Notas especiales de convocatoria"}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.submit}>
          <button type="submit" className={styles.btn} disabled={!isFormValid}>
            {isEditing ? "Editar convocatoria" : "Crear convocatoria"}
          </button>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        message={isEditing ? "Convocatoria editada exitosamente" : "Convocatoria creada exitosamente"}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default GenerateConvocatoria;
