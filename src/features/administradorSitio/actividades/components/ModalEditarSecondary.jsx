import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import styles from "./styles/ModalEditar.module.css";

const ModalEditarSecondary = ({ isOpen, onClose, title, actividadPrincipalId, selectedActividad, onSave }) => {
  const [formValues, setFormValues] = useState({
    nombreActividad: "",
    nombreCorto: "",
    alias: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedActividad) {
      setFormValues({
        nombreActividad: selectedActividad.actividad || "",
        nombreCorto: selectedActividad.nombreCorto || "",
        alias: selectedActividad.alias || "",
      });
    }
  }, [selectedActividad]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);

    const requestData = {
   
              id: selectedActividad.id,
              actividad: formValues.nombreActividad,
              alias: formValues.alias,
              nombreCorto: formValues.nombreCorto,
              fechaInicio: selectedActividad.fechaInicio,
              fechaFin: selectedActividad.fechaFin,
              orden: selectedActividad.orden,
        }

    await onSave(requestData);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.formContainer}>
          <Input
            type="text"
            label="Nombre de actividad"
            name="nombreActividad"
            value={formValues.nombreActividad}
            onChange={handleInputChange}
            placeholder="Nombre actividad"
          />
          <Input
            type="text"
            label="Nombre corto"
            name="nombreCorto"
            value={formValues.nombreCorto}
            onChange={handleInputChange}
            placeholder="Nombre corto"
          />
          <Input
            type="text"
            label="Alias"
            name="alias"
            value={formValues.alias}
            onChange={handleInputChange}
            placeholder="Alias"
          />
        </div>

        <div className={styles.submit}>
          <button type="button" className={styles.btn} onClick={onClose} disabled={isSaving}>
            Cerrar
          </button>
          <button type="button" className={styles.btn} onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarSecondary;
