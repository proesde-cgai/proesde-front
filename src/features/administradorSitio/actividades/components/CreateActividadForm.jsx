import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import Modal from "./ModalSucess";
import styles from "./styles/CreateActividadForm.module.css";
import useCrearAct from "../hooks/useCrearAct";

const CreateActividadForm = ({ selectedActividad }) => {
  const { createActividad, isLoading } = useCrearAct();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    nombreActividad: "",
    nombreCorto: "",
    alias: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    const { nombreActividad, nombreCorto, alias } = formValues;
    setIsFormValid(
      nombreActividad.trim() && nombreCorto.trim() && alias.trim()
    );
  }, [formValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedActividad) {
      setErrorMessage("Debe seleccionar un tipo de actividad.");
      return;
    }

    const actividadData = {
      menus: [
        {
          actividad: formValues.nombreActividad,
          orden: 1,
          alias: formValues.alias,
          menuPrimario: selectedActividad === "true",
          nombreCorto: formValues.nombreCorto,
        },
      ],
    };

    try {
      const response = await createActividad(actividadData);

      if (response?.status === 200) {
        console.log("Actividad creada con éxito:", response);
        setIsModalOpen(true);
        setFormValues({
          nombreActividad: "",
          nombreCorto: "",
          alias: "",
        });
      } else {
        setErrorMessage("Error: No se pudo crear la actividad. Intenta nuevamente.");
        console.error("Respuesta no exitosa:", response);
      }
    } catch (error) {
      setErrorMessage("Error: Hubo un problema con la solicitud. Intenta nuevamente.");
      console.error("Error al crear actividad:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <div className={styles.fullWidth}>
            <Input
              type="text"
              label={"Nombre de actividad"}
              name="nombreActividad"
              value={formValues.nombreActividad}
              onChange={handleInputChange}
              placeholder="Nombre actividad"
            />
          </div>

          <div className={styles.inputGroup}>
            <Input
              type="text"
              label={"Nombre corto"}
              name="nombreCorto"
              value={formValues.nombreCorto}
              onChange={handleInputChange}
              placeholder="Nombre corto"
            />

            <Input
              type="text"
              label={"Alias"}
              name="alias"
              value={formValues.alias}
              onChange={handleInputChange}
              placeholder="Alias"
            />
          </div>
        </div>
  {/* {ActividadPrincipal && (
                  <div className={styles.row}>
                    <label
                      htmlFor="actividadPrincipalAsoc"
                      className={styles.label}
                    >
                      Actividad principal asociada:
                    </label>
                    <select
                      id="actividadPrincipalAsoc"
                      name="actividadPrincipalAsoc"
                      className={styles.selectAct}
                      value={formValues.actividadPrincipalAsoc}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione una actividad principal</option>
                      <option value="2024A">2024A</option>
                      <option value="2024B">2024B</option>
                      <option value="2023A">2023A</option>
                      <option value="2023B">2023B</option>
                    </select>
                  </div>
                )} */}
        <div className={styles.submit}>
          <button
            type="submit"
            className={styles.btn}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        message={"Actividad creada exitosamente"}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default CreateActividadForm;
