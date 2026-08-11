import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import ReorderableList from "./ListOrder";
import styles from "./styles/ModalEditar.module.css";

const Modal = ({ isOpen, onClose, title = "Editar Actividad", ActividadPrincipal, selectedActividad, onSave }) => {
  const [formValues, setFormValues] = useState({
    nombreActividad: "",
    nombreCorto: "",
    alias: "",
  });

  const [actividadesSec, setActividadesSec] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedActividad) {
      setFormValues({
        nombreActividad: selectedActividad.actividad || "",
        nombreCorto: selectedActividad.nombreCorto || "",
        alias: selectedActividad.alias || "",
      });

      const secWithOrder = selectedActividad.submenus?.map((submenu, index) => ({
        ...submenu,
        orden: submenu.orden ?? index + 2,
      })) || [];

      setActividadesSec(secWithOrder);
    }
  }, [selectedActividad]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedSubmenus = actividadesSec
      .sort((a, b) => a.orden - b.orden)
      .map((submenu, index) => {
        if (submenu.actividad === "DELETE") {
          return { id: submenu.id, actividad: "DELETE", nombreCorto: submenu.nombreCorto };
        }
        return { ...submenu, orden: index + 2 };
      });

    const requestData = {
      menus: [
        {
          id: selectedActividad.id,
          actividad: formValues.nombreActividad,
          alias: formValues.alias,
          orden: selectedActividad.orden,
          menuPrimario: ActividadPrincipal,
          nombreCorto: formValues.nombreCorto,
          fechaInicio: selectedActividad.fechaInicio,
          fechaFin: selectedActividad.fechaFin,
          submenus: updatedSubmenus,
        },
      ],
    };

    await onSave(requestData);
    setIsSaving(false);
  };


  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            <div className={styles.fullWidth}>
              <Input
                type="text"
                label="Nombre de actividad"
                name="nombreActividad"
                value={formValues.nombreActividad}
                onChange={handleInputChange}
                placeholder="Nombre actividad"
              />
            </div>

            <div className={styles.inputGroup}>
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

            <ReorderableList items={actividadesSec} setActividadesSec={setActividadesSec} actividadPrincipalId={selectedActividad?.id}
              onSave={onSave} />
          </div>

          <div className={styles.submit}>
            <button type="button" className={styles.btn} onClick={onClose} disabled={isSaving}>
              Cerrar
            </button>
            <button type="submit" className={styles.btn} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
