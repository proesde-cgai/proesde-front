import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import SecondaryActivitiesTable from "../components/SecondaryActivitiesTable";
import useActividades from "../hooks/useActividades";
import styles from "./styles/AsociarActividadPage.module.css";
import useConvocatoria from "../../convocatoria/hooks/useConvocatoria";

const normalizeDate = (dateString) => {
  const [year, month, day] = dateString.split("/");
  return new Date(`${year}-${month}-${day}`);
};

const formatDateToSlash = (date) => {
  if (!date) return "";
  return date.replace(/-/g, "/");
};

const AsociarActividadPage = () => {
  const { actividadesPrincipales: initialActividadesPrincipales, actividadesSecundarias: initialActividadesSecundarias, isLoading, saveAsociacion } = useActividades();
  const { fetchConvocatoriaActual, convocatoria, isLoading: isConvocatoriaLoading } = useConvocatoria();

  const [actividadesPrincipales, setActividadesPrincipales] = useState(initialActividadesPrincipales);
  const [actividadesSecundarias, setActividadesSecundarias] = useState(initialActividadesSecundarias);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [mainActivityDates, setMainActivityDates] = useState({
    fechaInicio: "",
    fechaFinal: "",
  });
  const [secondaryActivities, setSecondaryActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConvocatoriaActual();
  }, [fetchConvocatoriaActual]);

  useEffect(() => {
    setActividadesPrincipales(initialActividadesPrincipales);
    setActividadesSecundarias(initialActividadesSecundarias);
  }, [initialActividadesPrincipales, initialActividadesSecundarias]);


  useEffect(() => {
    if (actividadesPrincipales.length === 1) {
      const firstActivity = actividadesPrincipales[0];
      setSelectedActivityId(firstActivity.id.toString());
      setSecondaryActivities(
        actividadesSecundarias.map((activity) => ({
          ...activity,
          fechaInicio: "",
          fechaFinal: "",
          selected: false,
        }))
      );
    }
    const filteredActivities = actividadesPrincipales.filter((activity) =>
      activity.actividad.toLowerCase().includes(searchTerm)
    );

    if (filteredActivities.length > 0) {
      setSelectedActivityId(filteredActivities[0].id.toString());
    } else {
      setSelectedActivityId("");
    }

    setSecondaryActivities(
      actividadesSecundarias.map((activity) => ({
        ...activity,
        fechaInicio: "",
        fechaFinal: "",
        selected: false,
      }))
    );
  }, [actividadesPrincipales, actividadesSecundarias, searchTerm]);

  const handleMainActivityChange = (e) => {
    setSelectedActivityId(e.target.value);
    setMainActivityDates({ fechaInicio: "", fechaFinal: "" });
    setSecondaryActivities(
      actividadesSecundarias.map((activity) => ({
        ...activity,
        fechaInicio: "",
        fechaFinal: "",
        selected: false,
      }))
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleMainDateChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = value;

    if (convocatoria) {
      const convocatoriaInicio = normalizeDate(convocatoria.fechaInicio);
      const convocatoriaFin = normalizeDate(convocatoria.fechaFin);
      const selectedDate = new Date(formattedValue);

      if (selectedDate < convocatoriaInicio || selectedDate > convocatoriaFin) {
        const inicioFormateado = convocatoriaInicio.toISOString().split("T")[0];
        const finFormateado = convocatoriaFin.toISOString().split("T")[0];
        alert(
          `La fecha seleccionada para ${name} debe estar dentro del rango de la convocatoria: ${inicioFormateado} - ${finFormateado}`
        );
        return;
      }
      if (name === "fechaFinal" && mainActivityDates.fechaInicio) {
        const fechaInicioDate = new Date(mainActivityDates.fechaInicio);
        const fechaFinDate = new Date(value);

        if (fechaFinDate < fechaInicioDate) {
          alert("La fecha final no puede ser menor que la fecha de inicio.");
          return;
        }
      }
    }

    setMainActivityDates((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    const selectedSecondaries = secondaryActivities
      .filter((activity) => activity.selected)
      .map(({ id, fechaInicio, fechaFinal }) => ({
        id,
        fechaInicio: formatDateToSlash(fechaInicio),
        fechaFin: formatDateToSlash(fechaFinal),
      }));

    const requestData = {
      menus: [
        {
          id: parseInt(selectedActivityId),
          fechaInicio: formatDateToSlash(mainActivityDates.fechaInicio),
          fechaFin: formatDateToSlash(mainActivityDates.fechaFinal),
          submenus: selectedSecondaries,
        },
      ],
    };

    try {
      const response = await saveAsociacion(requestData);
      if (response?.status === 200) {
        setActividadesPrincipales((prev) =>
          prev.filter((activity) => activity.id !== parseInt(selectedActivityId))
        );

        const secondaryIds = selectedSecondaries.map((activity) => activity.id);
        setActividadesSecundarias((prev) =>
          prev.filter((activity) => !secondaryIds.includes(activity.id))
        );

        setSelectedActivityId("");
        setMainActivityDates({ fechaInicio: "", fechaFinal: "" });
        setSecondaryActivities([]);

        alert("Asociación guardada exitosamente");
      }
    } catch (error) {
      console.error("Error al guardar la asociación:", error);
      alert("Error al guardar la asociación");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredActivities = actividadesPrincipales.filter((activity) =>
    activity.actividad.toLowerCase().includes(searchTerm)
  );

  if (isLoading || isConvocatoriaLoading || isSaving) {
    return <div className={styles.container}><p>Cargando datos...</p></div>;
  }

  if (!convocatoria && actividadesPrincipales.length === 0 && actividadesSecundarias.length === 0) {
    return <div className={styles.container}><p>No hay datos disponibles.</p></div>;
  }

  if (actividadesPrincipales.length === 0) {
    return <div className={styles.container}><p>No hay actividades principales disponibles.</p></div>;
  }

  if (actividadesSecundarias.length === 0) {
    return <div className={styles.container}><p>No hay actividades secundarias disponibles.</p></div>;
  }

  return (
    <div className={styles.container}>
      <article>
        <header>
          <h3 className={styles.title}>Actividad a Asociar</h3>
        </header>

        <div className={styles.container_aside}>
          <div className={styles.aside}>
            <label className={styles.label}>Buscar Actividad:</label>
            <input
              type="text"
              placeholder="Buscar actividad..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <label className={styles.label}>Actividades Principales:</label>
            <select
              className={styles.select}
              value={selectedActivityId}
              onChange={handleMainActivityChange}
              size={filteredActivities.length > 1 ? 5 : 2}
            >
              {filteredActivities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.actividad}
                </option>
              ))}
            </select>

            <div className={styles.instructions}>
              <p>Seleccione una actividad principal y elija sus fechas dentro del rango permitido por la convocatoria actual. Luego, seleccione las actividades secundarias para asociar y ajuste sus fechas, asegurándose de que estén dentro del rango de la actividad principal.</p>
            </div>

          </div>

          <div className={styles.solicitudContainer}>
            {selectedActivityId && (
              <div className={styles.formContainer}>
                <Input
                  type="date"
                  label="Fecha Inicial"
                  name="fechaInicio"
                  value={mainActivityDates.fechaInicio}
                  onChange={handleMainDateChange}
                />
                <Input
                  type="date"
                  label="Fecha Final"
                  name="fechaFinal"
                  value={mainActivityDates.fechaFinal}
                  onChange={handleMainDateChange}
                />
              </div>
            )}

            {selectedActivityId && mainActivityDates.fechaInicio && mainActivityDates.fechaFinal && (
              <SecondaryActivitiesTable
                secondaryActivities={secondaryActivities}
                setSecondaryActivities={setSecondaryActivities}
                mainActivityDates={mainActivityDates}
                handleSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default AsociarActividadPage;
