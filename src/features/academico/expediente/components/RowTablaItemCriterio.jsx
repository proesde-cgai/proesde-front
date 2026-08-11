import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFolder, faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import EliminarEvidencia from "./EliminarEvidencia";
import CargarEvidencia from "./CargarEvidencia";
import { replaceBrWithNewline } from "../../../../utils";
import styles from "./styles/RowTablaItemCriterio.module.css";
import useStatusStore from "../../../../store/useStatusStore";
import AgregarArchivo from "./AgregarArchivo";

const RowTablaItemCriterio = ({
  item,
  openModal,
  uploadedDocs,
  setUrlPdf,
  idSolicitud,
  handleUploadSuccess,
  handleDeleteSuccess,
}) => {
  const { requestStatus } = useStatusStore();
  const { criterio, nodo, subCriterios, archivos } = item;
  const { id: idExpediente, nombre, documentos, valorFijo } = criterio;
  const SOLICITUD_ENVIADA = 3;
  // Permite cargar/eliminar si requestStatus < 3 o requestStatus === 7
  const puedeCargarEliminar = requestStatus < SOLICITUD_ENVIADA || requestStatus === 7;
  const existeDocumento = nodo !== null || uploadedDocs.has(idExpediente);
  const sinNombreDocumento = !documentos || documentos === "";
  const sinPuntaje = valorFijo === null;

  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({});

  const openAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
  const closeAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);

  console.log("requestStatus ", requestStatus)
  return (
    <>
      <AgregarArchivo
        isOpen={isAddFileModalOpen}
        onClose={() => setIsAddFileModalOpen(false)}
        nombre={nombre}
        documentos={documentos}
        puntaje={valorFijo}
        sinNombreDocumento={sinNombreDocumento}
        sinPuntaje={sinPuntaje}
        existeDocumento={existeDocumento}
        openModal={openModal}
        setUrlPdf={setUrlPdf}
        nodo={nodo}
        requestStatus={requestStatus}
        SOLICITUD_ENVIADA={SOLICITUD_ENVIADA}
        idExpediente={idExpediente}
        idSolicitud={idSolicitud}
        handleDeleteSuccess={handleDeleteSuccess}
        handleUploadSuccess={handleUploadSuccess}
        archivos={archivos}
      />

      {/* Renderizar el nombre del criterio en una fila completa si tiene subcriterios */}
      {subCriterios?.length > 0 ? (
        <>
          <tr>
            <td colSpan="5" className={styles.fullRow}>
              {replaceBrWithNewline(nombre)}
            </td>
          </tr>
          {subCriterios.map((subCriterio) => (
            <RowTablaItemCriterio
              key={subCriterio.criterio.id}
              item={subCriterio}
              openModal={openModal}
              uploadedDocs={uploadedDocs}
              setUrlPdf={setUrlPdf}
              idSolicitud={idSolicitud}
              handleUploadSuccess={handleUploadSuccess}
              handleDeleteSuccess={handleDeleteSuccess}
            />
          ))}
        </>
      ) : (
        // Si no hay subcriterios, renderizar la fila normal
        <tr>
          <td>{replaceBrWithNewline(nombre)}</td>
          <td>{sinNombreDocumento ? <p>Sin registro de documento probatorio</p> : replaceBrWithNewline(documentos)}</td>
          <td style={{ textAlign: "center" }}>{sinPuntaje ? <p>Sin puntaje registrado para este ítem</p> : <p>{valorFijo}</p>}</td>
          <td className={styles.tdEvidencia}>
            {archivos?.length === 1 && puedeCargarEliminar ? (
              <div className={styles.containerBtnPDF}>
                <button
                  type="button"
                  className={styles.buttonPdf}
                  title="Ver PDF"
                  onClick={() => {
                    openModal();
                    setUrlPdf(archivos[0]?.nodo);
                  }}
                >
                  <FontAwesomeIcon icon={faFilePdf} color='green' />
                </button>

                <button
                  type="button"
                  className={styles.buttonPdf}
                  tile="agregar archivo"
                  onClick={() => {
                    openAddFileModal();
                    setInfoModal({ ...infoModal, descripcionActividad: replaceBrWithNewline(nombre), nombreDocumento: sinNombreDocumento, sinPuntaje: sinPuntaje, puntaje: valorFijo });
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} color="green" />
                </button>
              </div>
            ) : archivos?.length === 1 ? (
              <div className={styles.containerBtnPDF}>
                <button
                  type="button"
                  className={styles.buttonPdf}
                  title="Ver PDF"
                  onClick={() => {
                    openModal();
                    setUrlPdf(archivos[0]?.nodo);
                  }}
                >
                  <FontAwesomeIcon icon={faFilePdf} color='green' />
                </button>
              </div>
            ) : archivos?.length > 1 ? (
              <div className={styles.containerBtnPDF}>
                <button
                  type="button"
                  className={styles.buttonPdf}
                  tile="folder de archivos"
                  onClick={() => {
                    openAddFileModal();
                    setInfoModal({ ...infoModal, descripcionActividad: replaceBrWithNewline(nombre), nombreDocumento: sinNombreDocumento, sinPuntaje: sinPuntaje, puntaje: valorFijo });
                  }}
                >
                  <FontAwesomeIcon icon={faFolder} color="green" />
                </button>
              </div>
            ) : puedeCargarEliminar ? (
              <CargarEvidencia
                tipoUpload="criterio"
                idExpediente={Number(idExpediente)}
                idSolicitud={idSolicitud}
                onUploadSuccess={() => handleUploadSuccess(idExpediente)}
              />
            ) : (<></>)}
          </td>
          {puedeCargarEliminar && archivos?.length === 1 ? (
            <td className={styles.tdEliminarEvidencia}>
              <EliminarEvidencia
                tipoDelete="criterio"
                idExpediente={archivos[0]?.id}
                idSolicitud={idSolicitud}
                activo={existeDocumento}
                onDeleteSuccess={() => handleDeleteSuccess(idExpediente)}
              />
            </td>
          ) : puedeCargarEliminar ? (
            <td className={styles.tdEliminarEvidencia}>
              <button
                type='button'
                disabled={true}
                className={styles.buttonPdf}
                onClick={openModal}
              >
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  cursor={true ? 'not-allowed' : 'pointer'}
                  color={true ? 'gray' : 'red'}
                  size='3x'
                  title={true ? 'No hay documento a eliminar' : 'Eliminar documento'}
                />
              </button>
            </td>
          ) : (<></>)}
        </tr>
      )}
    </>
  );
};

export default RowTablaItemCriterio;