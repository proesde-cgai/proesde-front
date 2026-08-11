import React, { useState } from "react";
import styles from "./styles/ReorderableList.module.css";
import ModalEditarSecondary from "./ModalEditarSecondary";

const ReorderableList = ({ items = [], setActividadesSec, onSave, actividadPrincipalId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState(null);

  const handleOpenModal = (actividad) => {
    setSelectedActividad(actividad);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActividad(null);
  };

  const moveUp = (index, event) => {
    event.preventDefault();
    if (index === 0) return;
    const updatedItems = [...items];
    [updatedItems[index - 1], updatedItems[index]] = [updatedItems[index], updatedItems[index - 1]];

    updatedItems.forEach((item, i) => {
      item.orden = i + 2;
    });

    setActividadesSec([...updatedItems]);
  };

  const moveDown = (index, event) => {
    event.preventDefault();
    if (index === items.length - 1) return;
    const updatedItems = [...items];
    [updatedItems[index], updatedItems[index + 1]] = [updatedItems[index + 1], updatedItems[index]];

    updatedItems.forEach((item, i) => {
      item.orden = i + 2;
    });

    setActividadesSec([...updatedItems]);
  };
  const markAsDeleted = (id, event) => {
    event.preventDefault();
    const confirmDelete = window.confirm("¿Estás seguro de eliminar esta actividad?");
    if (!confirmDelete) return;

    // Encontrar índice de la actividad eliminada
    const indexToDelete = items.findIndex((item) => item.id === id);
    if (indexToDelete === -1) return;

    // Marcar la actividad como "DELETE" y eliminar el campo "orden"
    const updatedItems = items.map((item) =>
      item.id === id ? { id: item.id, actividad: "DELETE", nombreCorto: item.nombreCorto } : item
    );

    // Filtrar actividades activas y reasignar los órdenes
    let filteredItems = updatedItems.filter((item) => item.actividad !== "DELETE");

    filteredItems = filteredItems.map((item, index) => ({
      ...item,
      orden: index + 2,
    }));

    const finalItems = [...filteredItems, ...updatedItems.filter(item => item.actividad === "DELETE")];

    setActividadesSec(finalItems);
  };


  return (
    <>
      <ModalEditarSecondary
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedActividad={selectedActividad}
        onSave={(updatedData) => {
          const updatedItems = items.map((item) =>
            item.id === updatedData.id ? { ...item, ...updatedData } : item
          );
          setActividadesSec(updatedItems);
          onSave({
            menus: [
              {
                id: actividadPrincipalId,
                submenus: [updatedData],
              },
            ],
          });
          handleCloseModal();
        }}
      />
      <ul className={styles.list}>
        {(items || [])
          .filter((item) => item.actividad !== "DELETE")
          .sort((a, b) => a.orden - b.orden)
          .map((item, index) => (
            <li key={item.id} className={styles.listItem}>
              <button className={styles.deleteButton} onClick={(event) => markAsDeleted(item.id, event)}>X</button>
              <span className={styles.itemName} onClick={() => handleOpenModal(item)}>
                {item.name || item.actividad || "Sin Nombre"} (Orden: {item.orden})
              </span>
              <div className={styles.actionButtons}>
                <button
                  className={styles.moveButton}
                  onClick={(event) => moveUp(index, event)}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  className={styles.moveButton}
                  onClick={(event) => moveDown(index, event)}
                  disabled={index === items.length - 1}
                >
                  ↓
                </button>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};

export default ReorderableList;
