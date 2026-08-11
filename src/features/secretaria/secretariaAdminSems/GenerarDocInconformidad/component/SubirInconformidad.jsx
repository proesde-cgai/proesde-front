import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Alert from '../../../../../reutilizable/Alert';
import { useEvaluationStore } from '../../../../../store/useEvaluationStore';
import { useDatosInconformidad } from '../hooks/useDatosInconformidad';
import styles from './styles/SubirConformidad.module.css'
import useSubmitInconformidad from "../hooks/useSubmitInconformidad";

const SubirInconformidad = () => {
  const [formData, setFormData] = useState({
    recibida: "",
    fecha: "",
    area: "",
    documento: null,
    nombreDocumento: ""
  });
  const { selectedDataAcademico } = useEvaluationStore();
  const { submitInconformidad, isLoading, error: submitError, response } = useSubmitInconformidad();
  const [idSolicitud, setIdSolicitud] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const [mensajeAlerta, setMensajeAlerta] = useState({
    type: null,
    mensaje: null,
  });

  const { formData: hookData, isLoadingAcademico, error } = useDatosInconformidad(selectedDataAcademico?.codigo); // Pass the codigo here

  useEffect(() => {
    if (hookData) {
      setFormData({
        recibida: hookData.recibida || "",
        fecha: hookData.fecha || "",
        area: hookData.area || "",
        documento: hookData.documento || null,
        nombreDocumento: hookData.nombreDocumento || "",
      });
    }
  }, [hookData]); 

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      documento: file,
      nombreDocumento: file?.name || "",
    }));
  };

  useEffect(() => {
    const isValid =
      formData.recibida.trim() &&
      formData.fecha.trim() &&
      formData.area.trim() &&
      formData.documento !== null;
    setIsFormValid(isValid);
  }, [formData]);

  useEffect(() => {
    if (!selectedDataAcademico) return;
    setIdSolicitud(selectedDataAcademico.id);
  }, [selectedDataAcademico])


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse dates and prepare request data
    const parseDateString = (dateString) => {
      const [year, month, day] = dateString.split('-');
      return { year, month, day };
    };

    const { year, month, day } = parseDateString(formData.recibida);
    const { year: yearInc, month: monthInc, day: dayInc } = parseDateString(formData.fecha);

    const requestData = {
      idSolicitud: idSolicitud,
      filedata: formData.documento,
      fechaRecibido: formData.recibida,
      fechaInconformidad: formData.fecha,
      razones: formData.area,
    };

    console.log("Resquest data:", requestData)
    // Call the submitInconformidad function from the custom hook
    
    await submitInconformidad(requestData);

    // Optionally handle response or errors here
    if (response) {
      console.log("Response data:", response);
    }
    if (submitError) {
      console.error("Submit error:", submitError);
    }
  };

  return (
    <div className={styles.containerNotas}>
      <p className={styles.tituloNotas}>
        <FontAwesomeIcon icon={faAngleRight} color={'yellow'} /> {''}
        Subir documento de inconformidad
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.containerAgregarEntrada}>
        
          <div className={styles.dateInput}>
              <p className={styles.info}>Documento que sustenta la inconformidad</p>
              <label className={styles.labelFile} htmlFor="documento">
                Examinar
              </label>
              <input
                id="documento"
                className={styles.file}
                type="file"
                onChange={handleFileChange}
              />
              <input
                id="nombreDocumento"
                name="nombreDocumento"
                type="text"
                value={formData.nombreDocumento}
                readOnly
              />
          </div>

          <div className={styles.buttonsTextareaEntrada}>
            <button type='submit' className={styles.btnAgregarComentario} disabled={!isFormValid || isLoading}>
              {isLoading ? 'Subiendo...' : 'Subir'}
            </button>            
            <button type='button' className={styles.btnCancelar}>Cancelar</button>
          </div>
        </div>
      </form>
      {submitError && <p className="error-message">{submitError}</p>}

    </div>
  );
};

export default SubirInconformidad;