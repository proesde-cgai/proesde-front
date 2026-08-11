import React, { useState, useEffect } from "react";
import Table from "../../../../reutilizable/Table";
import Modal from "../../../../reutilizable/Modal";
import ViewerPDF from "../../../../reutilizable/ViewerPDF";
import { obtenerItemsDeCriteriosExpediente } from "../services/criteriosExpedienteService";
import RowTablaItemCriterio from "./RowTablaItemCriterio";
import useStatusStore from "../../../../store/useStatusStore";
import styles from "./styles/TablaItemsEvaluacion.module.css";

/**
 * Componente que retorna la tabla con la lista de criterios del expediente
 * @param {Object} params - Props objeto de parametros que necesita para obtener el listado de criterios
 * @param {number} params.idSolicitud - Identificador de la solicitud.
 * @param {number} params.idMenu - Identificador del menú.
 * @param {number} params.idSubMenu - Identificador del submenú.
 */
const TablaItemsEvaluacion = ({ params }) => {
  const { requestStatus } = useStatusStore();
  const [uploadedDocs, setUploadedDocs] = useState(new Set());
  const [itemsEvaluacion, setItemsEvaluacion] = useState([]);
  const [itemsCriterios, setItemsCriterios] = useState([]);
  const [urlPdf, setUrlPdf] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const SOLICITUD_ENVIADA = 3
  // Permite cargar/eliminar si requestStatus < 3 o requestStatus === 7
  const puedeCargarEliminar = requestStatus < SOLICITUD_ENVIADA || requestStatus === 7;
  
  let cabecerasTable = [
    // { id: 1, labelCabecera: "Item" },
    { id: 2, labelCabecera: "Descripcion Actividad", center: false },
    { id: 3, labelCabecera: "Documento Probatorio (evidencia)", center: false   },
    { id: 4, labelCabecera: "Puntaje que puede obtener", center: true },
    { id: 5, labelCabecera: "Cargar Evidencia", center: true },
  ];

  if (puedeCargarEliminar) cabecerasTable = [...cabecerasTable, { id: 6, labelCabecera: "Eliminar" }];

  useEffect(() => {
    if (!params) return;

    setItemsCriterios([]);
    obtenerItemsDeCriteriosExpediente(params)
      .then((response) => {
        console.log("response items criterios ", response?.data)
        setItemsCriterios(response?.data);
      })
      .catch((error) => console.error("Error al obtener los items del criterio para expediente ", error));
  }, [params, uploadedDocs]);

  useEffect(() => {
    if (!itemsCriterios || !itemsCriterios.arbol) return;
    console.log("arbol ", itemsCriterios?.arbol)
    setItemsEvaluacion(itemsCriterios?.arbol);
  }, [itemsCriterios]);

  const handleUploadSuccess = (idExpediente) => {
    setUploadedDocs((prev) => {
      const newSet = new Set(prev);
      newSet.add(idExpediente);
      return newSet;
    });
  };

  const handleDeleteSuccess = (idExpediente) => {
    setUploadedDocs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(idExpediente);
      return newSet;
    });
  };

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);


  
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ViewerPDF urlPdf={urlPdf} />
      </Modal>

      <div className={styles.leftAlignedTable}>
        <Table cabecerasTable={cabecerasTable}>
          {itemsEvaluacion?.map((itemEvaluacion) => {
            // Desestructuracion del objeto
            const { id, subCriterios } = itemEvaluacion;
            const { id: idExpediente } = itemEvaluacion.criterio;

            return (
              <RowTablaItemCriterio
                key={idExpediente}
                item={itemEvaluacion}
                uploadedDocs={uploadedDocs}
                idExpediente={idExpediente}
                idSolicitud={params.idSolicitud}
                openModal={openModal}
                setUrlPdf={setUrlPdf}
                handleDeleteSuccess={handleDeleteSuccess}
                handleUploadSuccess={handleUploadSuccess}
              />
            );
          })}
        </Table>
      </div>
    </>
  );
};

export default TablaItemsEvaluacion;
