import React, { useState, useEffect, useCallback } from "react";

import styles from "./GenerarReporte.module.css";
import DynamicField from "../component/DynamicField";
import useGenerateReport from "../hook/useGenerateReport";
import useConvocatorias from "../hook/useConvocatorias";
import Alert from "../../../../reutilizable/Alert";

const GenerarReportePage = () => {
    const initialState = {
        formato: "",
        reporte: "",
        contra: "",
        convocatoria: "",
    }
    const [generarReporte, setGenerarReporte] = useState({
      cumple: false,
      mensaje: "",
    });

    const [isVisible, setIsVisible] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const { convocatorias, loading: loadingConvocatorias, error: errorConvocatorias } = useConvocatorias();
    const { generateReport, loading, error } = useGenerateReport();

    useEffect(() => {
      const { formato, reporte, contra, convocatoria } = formData;
  
      const isValid =
      formato && reporte && convocatoria && (reporte !== "6" ? true : contra);

      setIsFormValid(isValid);
    }, [formData]);

    const handleChange = (e) => {
      const { id, value, type } = e.target;
  
      if (type === "radio") {
        setFormData({ ...formData, formato: value });
      } else if (id === "reporte") {
      // resetear convo al cambiar tipo reporte
      setFormData({ ...formData, reporte: value, convocatoria: "", contra: "" });
      }else {
        setFormData({ ...formData, [id]: value });
      }
    };

    const handleDynamicChange = (fieldId, value) => {
      setFormData({ ...formData, [fieldId]: value });

    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Form submitted", formData);
      const { formato, reporte, contra, convocatoria  } = formData;

      try {
        const result = await generateReport({ formato, reporte, contra, convocatoria });
        console.log("Reporte generado exitosamente:", result);
        setIsVisible(!isVisible);
        setGenerarReporte({
          cumple: true,
          mensaje: "Reporte generado exitosamente",
        });
        resetForm();

        setTimeout(() => {
          console.log("Cerrando modal despues de 4 seg.");
          setIsVisible(false);
          setGenerarReporte({
            cumple: true,
            mensaje: "",
          });
        }, 3000);

      } catch (err) {
        setIsVisible(true);
        setGenerarReporte({
          cumple: false,
          mensaje:
            "Sucedio un error al generar el reporte, intente más tarde",
        });
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      }
    };

    const resetForm = () => {
      setFormData(initialState);
    };

    useEffect(() => {
      setIsVisible(false);
    }, []);

  return (
    <div className={styles.container}>
        <header>
          <h3 className={styles.inconformidad_title}>
            Generar
          </h3>
        </header>

        <div className={styles.container_aside}>
            <div className={styles.aside}>
                <p>
                  Para generar un reporte debe seleccionar los campos correspondientes
                </p>
            </div>
            <div className={styles.solicitudContainer}>
            <form className={styles.form}>
              <h4 className={styles.formTitle}>Generar Reporte</h4>
              {/*Seleccionar formato*/}
              <div className={styles.row}>
                <label htmlFor="format" className={styles.label}>
                  Formato:
                </label>
                <div className={styles.radioButtons}>
                  <input type="radio" id="pdf" name="format" value="pdf" onChange={handleChange}
                    checked={formData.formato === "pdf"}
                    className="inpt_radio_green"
                  />
                  <label htmlFor="pdf">PDF</label>

                  <input type="radio" id="excel" name="format" value="xlsx" onChange={handleChange}
                  checked={formData.formato === "xlsx"}
                  className="inpt_radio_green"
                  />
                  <label htmlFor="excel">Excel</label>
                </div>
              </div>

              <div className={styles.row}>
                <label htmlFor="reporte" className={styles.label}>
                  Reporte:
                </label>
                <select 
                  id="reporte" 
                  className={styles.select} 
                  value={formData.reporte}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Seleccione un reporte</option>
                  <option value="1">Comparación convocatoria actual (niveles)</option>
                  <option value="2">Documentos digitalizados pendientes</option>
                  <option value="3">Miembros de comisión dictaminadoras</option>
                  <option value="4">Nuevos acádemicos participantes en el programa</option>
                  <option value="5">Recursos de inconformidad presentados</option>
                  <option value="6">Solicitudes evaluadas por comisión especial</option>
                  <option value="7">Total de solicitudes registradas</option>
                </select>
              </div>

              <div className={styles.row}>
                <label htmlFor="convocatoria" className={styles.label}>
                  Convocatoria:
                </label>
                <select 
                id="convocatoria" 
                className={styles.select} 
                value={formData.convocatoria}
                onChange={(e) => handleDynamicChange("convocatoria", e.target.value)}
                disabled={loading || loadingConvocatorias}
                >
                  <option value="">Seleccione una convocatoria</option>
                  {convocatorias.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
                {errorConvocatorias && <p className={styles.error}>{errorConvocatorias}</p>}
              </div>

              <DynamicField 
                reportType={formData.reporte} 
                onDynamicChange={handleDynamicChange}              
              />

              {generarReporte && isVisible && (
                <Alert typeAlert={generarReporte.cumple ? "success" : "error"}>
                  <p>{generarReporte.mensaje}</p>
                </Alert>
              )}

              <div className={styles.submit}>
                  <button 
                    className={styles.btn} 
                    type="submit" 
                    onClick={handleSubmit} 
                    disabled={!isFormValid || loading}
                  >
                  {loading ? "Generando" : "Imprimir"}

                  </button>
              </div>

            </form>

            </div>
        </div>
    </div>
  );
};

export default GenerarReportePage;
