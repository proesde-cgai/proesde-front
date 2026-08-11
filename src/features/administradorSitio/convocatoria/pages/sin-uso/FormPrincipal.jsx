
import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Modal from "../../components/ModalSucess";
import styles from "./styles/FormPrincipal.module.css";

const FormField = ({onSubmit, selectedActivityId }) => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [formValues, setFormValues] = useState({
      fechaInicio: "",
      fechaFinal: "",
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
        ...prevValues,
      [name]: value,
    }));
  }

  useEffect(() => {
    const {fechaInicio, fechaFinal } = formValues;

    const FormFieldValid =
      fechaInicio &&
      fechaFinal;

    const isFechaFinalValid =
      !fechaInicio || !fechaFinal || new Date(fechaFinal) >= new Date(fechaInicio);

    setIsFormValid(FormFieldValid && isFechaFinalValid);
  }, [formValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormValid) {
      const payload = {
        id: selectedActivityId,
        fechaInicio: formValues.fechaInicio,
        fechaFinal: formValues.fechaFinal,
      };

      console.log("Main Activity Submitted:", payload);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSubmit(payload);
    }
  };

  return (
    <>
        <form onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
                <Input
                type="date"
                label={"Fecha Inicial"}
                name="fechaInicio"
                value={formValues.fechaInicio}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                />

                <Input
                type="date"
                label={"Fecha Final"}
                name="fechaFinal"
                value={formValues.fechaFinal}
                onChange={handleInputChange}
                min={formValues.fechaInicio || new Date().toISOString().split("T")[0]}
                disabled={!formValues.fechaInicio}
                />
            
            </div> 

            <div className={styles.submit}>
                <button 
                type="submit" 
                className={styles.btn}
                disabled={!isFormValid}
                >
                    Guardar
                </button>       
            </div>
        </form>
         
    </>
  );
};

export default FormField;
