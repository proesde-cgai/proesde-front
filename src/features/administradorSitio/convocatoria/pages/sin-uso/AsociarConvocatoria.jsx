import React, { useState, useEffect, useCallback } from "react";
import FormField from "./FormPrincipal";
import SecondaryFormField from "./FormSecundaria";

import styles from "./AsociarConvocatoria.module.css";

const AsociarConvocatoria = () => {
  const [selectedActivityType, setSelectedActivityType] = useState("");
  const [actividadDone, setActividadDone] = useState(false);

  const [actividadesSec, setActividadesSec] = useState([
    { id: "1", name: "Actividad 1", active: "1", orden: "1", selected: "0", idPrincipal: "1", },
    { id: "2", name: "Actividad 2", active: "0", orden: "2", selected: "0", idPrincipal: "1", },
    { id: "3", name: "Actividad 3", active: "1", orden: "3", selected: "0", idPrincipal: "1", },
    { id: "4", name: "Actividad 4", active: "1", orden: "1", selected: "0", idPrincipal: "2", },
    { id: "5", name: "Actividad 5", active: "1", orden: "2", selected: "0", idPrincipal: "2", },
  ]);

  const [selectedActividades, setSelectedActividades] = useState([]);
  const [selectedSecActivity, setSelectedSecActivity] = useState(null);
  const [formValues, setFormValues] = useState({ fechaInicio: "", fechaFinal: "" });

  const handleReporteChange = (e) => {
    setSelectedActivityType(e.target.value);
    setActividadDone(false);
    setSelectedActividades([]);
  };

  const handleAccordionClick = (activity) => {
    setSelectedSecActivity(activity);
    setFormValues({ fechaInicio: "", fechaFinal: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (selectedSecActivity && formValues.fechaInicio && formValues.fechaFinal) {

      const newActivity = {
        id: selectedSecActivity.id,
        name: selectedSecActivity.name,
        fechaInicio: formValues.fechaInicio,
        fechaFinal: formValues.fechaFinal,
      };

      setSelectedActividades((prev) => [...prev, newActivity]);


      setActividadesSec((prev) =>
        prev.map((item) =>
          item.id === selectedSecActivity.id ? { ...item, selected: "1" } : item
        )
      );
      console.log("Added Activity:", newActivity);
      setSelectedSecActivity(null);
    }
  };


  const handleDeleteActivity = (id) => {
    if (window.confirm("Estas seguro de quitar la actividad?")) {
      setSelectedActividades((prev) => prev.filter((item) => item.id !== id));
      setActividadesSec((prev) =>
        prev.map((item) => (item.id === id ? { ...item, selected: "0" } : item))
      );
    }
  };

  const filteredActividades = actividadesSec.filter(
    (item) => item.idPrincipal === selectedActivityType
  );

  return (
    <div className={styles.container}>
      <article>
        <header>
          <h3 className={styles.inconformidad_title}>
            Asociar Actividad
          </h3>
        </header>

        <div className={styles.container_aside}>
          <div className={styles.aside}>
            {!actividadDone && (

              <div className={styles.column}>
                {/* Mostrar actividades principales */}
                <label htmlFor="reporte" className={styles.label}>
                  Actividad:
                </label>
                <select
                  id="reporte"
                  className={styles.select}
                  value={selectedActivityType}
                  onChange={handleReporteChange}
                >
                  <option value="">Seleccione una actividad</option>
                  <option value="1">Actividad Principal 1</option>
                  <option value="2">Actividad Principal 2</option>
                </select>
              </div>
            )}

            {actividadDone && (
              <div className={styles.accordion}>
                <label className={styles.label}>
                  Asociar Actividad:
                </label>

                {filteredActividades.map((item) => (
                  <div key={item.id}
                    className={`${styles.rowItem} ${selectedSecActivity?.id === item.id ? styles.outlined : ""
                      } `}

                    onClick={() => handleAccordionClick(item)}
                  >
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteActivity(item.id);
                      }}
                    >
                      X
                    </button>
                    <div className={styles.content}>
                      {item.name}
                    </div>
                    {selectedActividades.some((a) => a.id === item.id) && (
                      <span className={styles.checkmark}>✔</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className={styles.instructions}>
              <p>Debe seleccionar una actividad principal primero,
                después debe seleccionar las actividades secundarias
                que desea asociar y darle click en el button de + para
                asociar actividad.</p>
            </div>

          </div>
          <div className={styles.solicitudContainer}>
            {/* Main Form */}
            {!actividadDone && (
              <FormField
                onSubmit={(formData) => {
                  console.log("Main Activity API Response:", formData);
                  setActividadDone(true);
                }}
                selectedActivityId={selectedActivityType}
              />
            )}

            {/* Form actividad asociadas */}
            {actividadDone && selectedSecActivity && (
              <SecondaryFormField
                selectedSecActivity={selectedSecActivity}
                formValues={formValues}
                onInputChange={handleInputChange}
                onAddActivity={handleAddActivity}
              />
            )}

          </div>
        </div>


      </article>
    </div>
  );
};

export default AsociarConvocatoria;
