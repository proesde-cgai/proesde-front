import React, { useState, useEffect } from 'react';
import RowTablaItemCriterio from './RowTablaItemCriterio';
import { obtenerItemsDeCriteriosExpediente } from '../../academico/expediente/services/criteriosExpedienteService';
import ViewerPDF from '../../../reutilizable/ViewerPDF';
import Modal from '../../../reutilizable/Modal';
import Table from '../../../reutilizable/Table';
import Alert from '../../../reutilizable/Alert';

/** 
 * Componente que retorna la tabla con la lista de criterios del expediente
 * @param {Object} params - Props objeto de parametros que necesita para obtener el listado de criterios
 * @param {number} params.idSolicitud - Identificador de la solicitud.
 * @param {number} params.idMenu - Identificador del menú.
 * @param {number} params.idSubMenu - Identificador del submenú.
 */
const TablaItemsEvaluacion = ({ params }) => {


  const [uploadedDocs, setUploadedDocs] = useState(new Set());
  const [itemsEvaluacion, setItemsEvaluacion] = useState([]);
  const [itemsCriterios, setItemsCriterios] = useState([]);
  const [urlPdf, setUrlPdf] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cabecerasTable, _] = useState([
    // {
    //   id: 1,
    //   labelCabecera: 'Item'
    // },
    {
      id: 2,
      labelCabecera: 'Descripcion Actividad'
    },
    {
      id: 3,
      labelCabecera: 'Documento Probatorio (evidencia)'
    },
    {
      id: 4,
      labelCabecera: 'Puntos'
    },
    {
      id: 5,
      labelCabecera: 'Visualizar Evidencia'
    }
  ]);

  useEffect(() => {
    if (!params) return;
    setItemsCriterios([]);
    console.log(params)
    obtenerItemsDeCriteriosExpediente(params)
      .then(response => { 
        console.log(response)
        setItemsCriterios(response?.data)
       })
      .catch(error => console.error('Error al obtener los items del criterio para expediente ', error))
  }, [params, uploadedDocs])

  useEffect(() => {
    setItemsEvaluacion([]);
    if (!itemsCriterios || !itemsCriterios.arbol) return;
    setItemsEvaluacion(itemsCriterios?.arbol);
  }, [itemsCriterios, params]);

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

  if (itemsEvaluacion.length <= 0) {
    return (
      <Alert typeAlert='warning'>
        <p>Sin criterios</p>
      </Alert>
    );
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ViewerPDF urlPdf={urlPdf} />
      </Modal>

      <Table cabecerasTable={cabecerasTable}>
        {itemsEvaluacion?.map(itemEvaluacion => {
          // Desestructuracion del objeto
          const { id, subCriterios } = itemEvaluacion
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
        })
        }
      </Table>
    </>
  );
};

export default TablaItemsEvaluacion;
