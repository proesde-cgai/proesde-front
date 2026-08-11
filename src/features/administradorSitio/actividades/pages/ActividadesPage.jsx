import React, { useState, useEffect } from "react";
import TablaActividades from "../components/TablaActividades";
import useActividadesAsociadas from "../hooks/useActividadesAsociadas";
import styles from "./styles/Actividad.module.css";
import useStoredFecha from "../../../useStoredFecha";

const ActividadesPage = () => {
  const { actividades, isLoading, error, modifyActividad, eliminarAsociacion } = useActividadesAsociadas();
  const [localActividades, setLocalActividades] = useState([]);
  const fecha = useStoredFecha();
  const displayDate = fecha?.rangoFecha || "2024-2025";  

  useEffect(() => {
    setLocalActividades(actividades);
  }, [actividades]);

  const handleModifyActividad = async (updatedData) => {
    const success = await modifyActividad(updatedData);
    console.log(success)
    if (success) {
      setLocalActividades((prevActividades) =>
        prevActividades.map((actividad) => {
          if (actividad.id === updatedData.menus[0].id) {
            return {
              ...actividad,
              ...updatedData.menus[0],
              submenus: updatedData.menus[0].submenus.map((submenu, index) => ({
                ...submenu,
                orden: index + 2,
              })),
            };
          }
          return actividad;
        })
      );
    }
  };


  const handleEliminarAsociacion = async (idPrincipal, submenus) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar esta asociación?");
    if (!confirmDelete) return;

    const idSecundarias = submenus.map((submenu) => submenu.id);

    const success = await eliminarAsociacion(idPrincipal, idSecundarias);
    if (success) {
      setLocalActividades((prev) =>
        prev.filter((actividad) => actividad.id !== idPrincipal)
      );
    }
  };

  if (isLoading) {
    return <div className={styles.container}><p>Cargando actividades...</p></div>;
  }

  if (error) {
    return <div className={styles.container}><p>{error}</p></div>;
  }

  if (localActividades.length === 0) {
    return <div className={styles.container}><p>No hay actividades disponibles.</p></div>;
  }

  return (
    <div className={styles.container}>
      <article>
        <header>
          <h3 className={styles.inconformidad_title}>Convocatoria {displayDate}</h3>
        </header>
        <TablaActividades
          currentItems={localActividades}
          handleModifyActividad={handleModifyActividad}
          handleEliminarAsociacion={handleEliminarAsociacion}
        />
      </article>
    </div>
  );
};

export default ActividadesPage;
