import React, { useState } from "react";
import { replaceBrWithNewline } from "../../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFolder, faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import styles from "./styles/RowTableCriteriosCotejo.module.css";
import useCotejoStore from "../../../store/useCotejoStore";
import CargarEvidencia from "../../academico/expediente/components/CargarEvidencia";
import { changeCriterio, changeCriterioCotejado } from "../services/cotejoCriteriosService";
import MessageModal from "../../../reutilizable/SucessModal";
import VisualizarArchivosCriterios from "./VisualizarArchivosCriterios";
import ActualizarEvidencia from "./ActualizarEvidencia";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const RowTableCriteriosCotejo = ({ item, openModal, setUrlPdf, register, statusCotejo, itemsCriterios }) => {
  const { nodo, criterio, cotejado, archivos, subCriterios } = item;
  console.log(item);
  const [showMessage, setShowMessage] = useState(false);

  const { id, nombre, documentos, valorFijo } = criterio;
  const { esCotejadoRubros, setUploadRubro, uploadRubro, idSolicitud } = useCotejoStore();
  const sinNombreDocumento = documentos === "";
  const sinPuntaje = valorFijo === null;
  const [uploadedDocs, setUploadedDocs] = useState(new Set());

  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({});

  const openAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
  const closeAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);

  console.log(item);
  console.log(criterio);

  const handleChecks = async (event) => {
    const { id } = event.target;
    let ids = [];
    if (item.archivos && item.archivos.length > 0) {
      for (const archivo of item.archivos) {
        ids.push(archivo.id);
      }
    }

    try {
      const body = { ids: ids, cotejado: !(item.archivos && item.archivos[0]?.cotejado) };
      await changeCriterioCotejado(body);
      console.log("Cambio exitoso");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2500);
    } catch (error) {
      console.error("Error al cambiar status de criterio para cotejo", error);
      alert("Error al cambiar status de criterio para cotejo");
    }
  };

  const handleCheckById = async (id) => {
    console.log(id);
    const element = document.getElementById(id);
    let ids = [];
    if (item.archivos && item.archivos.length > 0) {
      for (const archivo of item.archivos) {
        ids.push(archivo.id);
      }
    }

    try {
      const body = { ids: ids, cotejado: false };
      await changeCriterioCotejado(body);
      console.log("Cambio exitoso");
      element.checked = false;
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2500);
    } catch (error) {
      console.error("Error al cambiar status de criterio para cotejo", error);
      alert("Error al cambiar status de criterio para cotejo");
    }
  };

  const handleUploadSuccess = (idExpediente) => {
    setUploadedDocs((prev) => {
      const newSet = new Set(prev);
      newSet.add(idExpediente);
      return newSet;
    });
    setUploadRubro(!uploadRubro);
    console.log(idExpediente);
    handleCheckById(idExpediente);
  };

  const handleDeleteSuccess = (idExpediente) => {
    setUploadedDocs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(idExpediente);
      return newSet;
    });
  };

  const tieneArchivos = item.archivos && item.archivos.length > 0;

  // Si no hay archivos y no hay subcriterios, no renderizar la fila
  if (archivos === null && (!subCriterios || subCriterios.length === 0)) {
    return null;
  }

  return (
    <>
      <VisualizarArchivosCriterios
        isOpen={isAddFileModalOpen}
        onClose={() => setIsAddFileModalOpen(false)}
        nombre={nombre}
        documentos={documentos}
        puntaje={valorFijo}
        sinNombreDocumento={sinNombreDocumento}
        sinPuntaje={sinPuntaje}
        openModal={openModal}
        setUrlPdf={setUrlPdf}
        nodo={nodo}
        idExpediente={infoModal?.idExpediente}
        idSolicitud={idSolicitud}
        handleDeleteSuccess={handleDeleteSuccess}
        handleUploadSuccess={handleUploadSuccess}
        archivos={archivos}
        idCriterio={infoModal?.idCriterio}
        esCotejadoRubros={esCotejadoRubros}
      />
      {showMessage && (
        <MessageModal isOpen={showMessage} message={"Actualizado"} onClose={() => setShowMessage(false)} />
      )}

      {/* Fila del criterio principal */}
      <tr key={id}>
        <td
          colSpan={subCriterios?.length ? "100%" : undefined}
          className={subCriterios?.length ? styles.tdSubCriterio : null}
        >
          {replaceBrWithNewline(nombre)}
        </td>
        {!subCriterios?.length && (
          <>
            <td>
              {sinNombreDocumento ? (
                <p>Sin registro de documento probatorio</p>
              ) : (
                <label htmlFor={id} className={styles.label}>
                  {replaceBrWithNewline(documentos)}
                </label>
              )}
            </td>
            <td>{sinPuntaje ? <p>Sin puntaje registrado para este ítem</p> : <p>{valorFijo}</p>}</td>
            <td className={styles.tdEvidencia}>
              {tieneArchivos && item.archivos.length === 1 ? (
                <div className={styles.containerBtnPDF}>
                  <button
                    type="button"
                    className={styles.buttonPdf}
                    title="Ver PDF"
                    onClick={() => {
                      openModal();
                      setUrlPdf(item.archivos[0]?.nodo);
                    }}
                  >
                    <FontAwesomeIcon icon={faFilePdf} color="green" />
                  </button>
                </div>
              ) : tieneArchivos && item.archivos.length > 1 ? (
                <div className={styles.containerBtnPDF}>
                  <button
                    type="button"
                    className={styles.buttonPdf}
                    title="folder de archivos"
                    onClick={() => {
                      openAddFileModal();
                      setInfoModal({
                        ...infoModal,
                        descripcionActividad: replaceBrWithNewline(nombre),
                        nombreDocumento: sinNombreDocumento,
                        sinPuntaje: sinPuntaje,
                        puntaje: valorFijo,
                        idExpediente: item.criterio?.id,
                        idCriterio: item.criterio?.id,
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faFolder} color="green" />
                  </button>
                </div>
              ) : (
                <td></td>
              )}
            </td>
            {esCotejadoRubros && tieneArchivos && item.archivos.length === 1 ? (
              <td>
                <ActualizarEvidencia
                  idExpediente={item.criterio?.id}
                  idSolicitud={idSolicitud}
                  tipoUpload="criterio"
                  onUploadSuccess={() => handleUploadSuccess(item.criterio?.id)}
                  onDeleteSuccess={() => handleDeleteSuccess(item.archivos[0]?.id)}
                  archivoId={item.archivos[0]?.id}
                />
              </td>
            ) : esCotejadoRubros && tieneArchivos && item.archivos.length > 1 ? (
              <td></td>
            ) : (
              <></>
            )}
            <td className={styles.tdCheckCotejo}>
              {item.archivos?.every(a => a.generado) ? (
                <FontAwesomeIcon icon={faCheckCircle} color="green" title="Generado por sistema" size="lg" />
              ) : (
                <input
                  type="checkbox"
                  className="checkbox_green"
                  id={id}
                  {...register(`${id}`)}
                  disabled={statusCotejo >= 2}
                  onChange={handleChecks}
                  defaultChecked={tieneArchivos && item.archivos[0]?.cotejado}
                />
              )}
            </td>
          </>
        )}
      </tr>

      {/* Filas de subcriterios */}
      {subCriterios?.map((subCriterio) => (
        <RowTableCriteriosCotejo
          key={subCriterio.criterio.id}
          item={subCriterio}
          openModal={openModal}
          setUrlPdf={setUrlPdf}
          register={register}
          statusCotejo={statusCotejo}
        />
      ))}
    </>
  );
};

export default RowTableCriteriosCotejo;
