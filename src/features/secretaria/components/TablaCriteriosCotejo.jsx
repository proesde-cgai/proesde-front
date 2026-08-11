import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../reutilizable/Modal";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import Table from "../../../reutilizable/Table";
import Alert from "../../../reutilizable/Alert";
import RowTableCriteriosCotejo from "./RowTableCriteriosCotejo";
import { cotejarCriterios, obtenerItemsDeCriteriosCotejo } from "../services/cotejoCriteriosService";
import { ERROR_MESSAGES_GENERICS_API } from "../../../utils/messagesFromAPI";
import styles from "./styles/TablaCriteriosCotejo.module.css";
import useCotejoStore from "../../../store/useCotejoStore";

const TablaCriteriosCotejo = ({ params, onCriteriosChange }) => {
  console.log(params);
  const [statusCotejo, setStatusCotejo] = useState(null);
  const { esCotejadoRubros, uploadRubro } = useCotejoStore();
  const [itemsEvaluacion, setItemsEvaluacion] = useState([]);
  const [itemsCriterios, setItemsCriterios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cotejado, setCotejado] = useState(false);
  const [urlPdf, setUrlPdf] = useState(null);
  const [mensajeCotejado, setMensajeCotejado] = useState({
    type: "success",
    mensaje: "Requisitos cotejados correctamente",
  });
  const [mensaje, setMensaje] = useState({
    type: null,
    mensaje: null,
  });
  let cabecerasTable = [
    // { id: 1, labelCabecera: "Item" },
    { id: 2, labelCabecera: "Descripcion Actividad" },
    { id: 3, labelCabecera: "Documento Probatorio (evidencia)" },
    { id: 4, labelCabecera: "Puntos" },
    { id: 5, labelCabecera: "Ver Evidencia" },
    { id: 7, labelCabecera: "Reemplazar Evidencia" },
    { id: 6, labelCabecera: "Cotejar" },
  ];

  if (!esCotejadoRubros) cabecerasTable = cabecerasTable.filter((cabecera) => cabecera.id !== 7);

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    setMensaje(null);
    if (!params) return;
    
    console.log("se actualizan criterios");
  
    setItemsCriterios([]);
    setItemsEvaluacion([]); 
  
    obtenerItemsDeCriteriosCotejo(params)
      .then((response) => {
        console.log(response?.data);
        setItemsCriterios(response?.data);
        setStatusCotejo(response?.data?.statusCotejo);
      })
      .catch((error) => {
        console.error("Error al obtener los items del criterio para cotejo ", error);
        if (error.response) {
          const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
          setMensaje({
            mensaje: message,
            type: "error",
          });
        }
      });
  }, [params, cotejado, uploadRubro]);
  

  useEffect(() => {
    onCriteriosChange(itemsEvaluacion); // Notifica al padre sobre el estado actual.

  }, [itemsEvaluacion, onCriteriosChange]);

  useEffect(() => {
    if (!itemsCriterios || !itemsCriterios.arbol) return;
    setItemsEvaluacion(itemsCriterios?.arbol);
    console.log("itemsCriterios", itemsCriterios?.arbol);
  }, [itemsCriterios, cotejado]);

  // const handleCotejarCriterios = async (data) => {
  //   setMensaje(null);

  //   // Transformamos la data para un formato valido para el body
  //   const criteriosId = Object.entries(data)
  //     .filter(([_, value]) => value === true)
  //     .map(([key]) => parseInt(key));

  //   const body = {
  //     idSolicitud: params.idSolicitud,
  //     criterios: criteriosId
  //   };

  //   await cotejarCriterios(body)
  //     .then(response => {
  //       if (response.status === 200 || 204) {
  //         setMensajeCotejado({
  //           type: 'success',
  //           mensaje: 'Cotejo realizado correctamente'
  //         });

  //         setCotejado(!cotejado);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error al cotejar los criterios: ', error);
  //       if (error.response) {
  //         const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
  //         setMensaje({
  //           mensaje: message,
  //           type: 'error'
  //         });
  //       }
  //     })
  // };

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

  /* console.log(itemsCriterios)
  console.log(params) */

  if (itemsEvaluacion.length <= 0) {
    return (
      <Alert typeAlert="warning">
        <p>Sin criterios para cotejar</p>
      </Alert>
    );
  }

  if (mensaje) {
    return (
      <Alert typeAlert={mensaje.type}>
        <p>{mensaje.mensaje}</p>
      </Alert>
    );
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ViewerPDF urlPdf={urlPdf} />
      </Modal>

      <Table cabecerasTable={cabecerasTable}>
        {itemsEvaluacion?.map((itemEvaluacion) => {
          console.log("item ", itemEvaluacion);
          console.log(itemsCriterios);
          const { id } = itemEvaluacion.criterio;
          return (
            <RowTableCriteriosCotejo
              key={id}
              item={itemEvaluacion}
              setUrlPdf={setUrlPdf}
              openModal={openModal}
              register={register}
              statusCotejo={statusCotejo}
              itemsCriterios={itemsCriterios}
            />
          );
        })}
      </Table>

      {cotejado && mensajeCotejado && (
        <Alert typeAlert={mensajeCotejado.type}>
          <p>{mensajeCotejado.mensaje}</p>
        </Alert>
      )}
    </>
  );
};

export default TablaCriteriosCotejo;
