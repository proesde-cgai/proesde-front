import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFolder, faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import EliminarEvidencia from "./EliminarEvidencia";
import CargarEvidencia from "./CargarEvidencia";
import styles from "./styles/RowTableExpedienteRequisitos.module.css";
import useStatusStore from "../../../../store/useStatusStore";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AgregarArchivoRequisito from "./AgregarArchivoRequisito";

const RowTableExpedienteRequisitos = ({
  requisito,
  existeDocumento,
  openModal,
  setUrlPDF,
  idSolicitud,
  handleUploadSuccess,
  handleDeleteSuccess,
  puedeCargarEliminar,
}) => {
  const { requestStatus } = useStatusStore();
  const SOLICITUD_ENVIADA = 3
  
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({});

  const openAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
  const closeAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
  return (
    <>
      <AgregarArchivoRequisito
        isOpen={isAddFileModalOpen}
        onClose={() => setIsAddFileModalOpen(false)}
        existeDocumento={existeDocumento}
        openModal={openModal}
        requestStatus={requestStatus}
        SOLICITUD_ENVIADA={SOLICITUD_ENVIADA}
        puedeCargarEliminar={puedeCargarEliminar}
        idSolicitud={idSolicitud}
        handleDeleteSuccess={handleDeleteSuccess}
        handleUploadSuccess={handleUploadSuccess}
        archivos={requisito?.archivos}
        nombre={requisito?.nombre}
        setUrlPdf={setUrlPDF}
        idExpediente={requisito.id}
      />

      <tr key={requisito.id}>
        <td>{requisito.orden}</td>
        <td className={styles.textLeft}>{requisito.nombre} {requisito.obligatorio ? (<span style={{ color: "red", fontWeight: "bold" }}> (Obligatorio) </span>) : (<></>)} </td>
        <td className={styles.tdTablaExpedienteRequisitos}>
          {requisito.validado ? (
            <div className={styles.containerBtnPDF}>
              <input
                type="checkbox"
                className={`checkbox_green`}
                id={requisito.id}
                checked={true}
              />
            </div>
          ) : requisito?.archivos?.length === 1 && puedeCargarEliminar ?  (
            <div className={styles.containerBtnPDF}>
              <button
                type="button"
                className={styles.buttonPdf}
                title="Ver PDF"
                onClick={() => {
                  openModal();
                  setUrlPDF(requisito?.archivos[0]?.nodo || "");
                }}
              >
                <FontAwesomeIcon icon={faFilePdf} color="green" />
              </button>

              <button
                type="button"
                className={styles.buttonPdf}
                tile="agregar archivo"
                onClick={() => {
                  openAddFileModal()
                  setInfoModal({ ...infoModal, })
                }}
              >
                <FontAwesomeIcon icon={faPlus} color="green" />
              </button>
            </div>
          ) : requisito?.archivos?.length === 1 ? (
            <div className={styles.containerBtnPDF}>
              <button
                type="button"
                className={styles.buttonPdf}
                title="Ver PDF"
                onClick={() => {
                  openModal();
                  setUrlPDF(requisito?.archivos[0]?.nodo || "");
                }}
              >
                <FontAwesomeIcon icon={faFilePdf} color="green" />
              </button>
            </div>
          ) : requisito?.archivos?.length > 1 ? (
            <div className={styles.containerBtnPDF}>
              <button
                type="button"
                className={styles.buttonPdf}
                tile="folder de archivos"
                onClick={() => {
                  openAddFileModal()
                  setInfoModal({ ...infoModal })
                }}
              >
                <FontAwesomeIcon icon={faFolder} color="green" />
              </button>
            </div>
          ) : puedeCargarEliminar ? (
            <CargarEvidencia
              idExpediente={requisito.id}
              idSolicitud={idSolicitud}
              tipoUpload="requisito"
              onUploadSuccess={() => handleUploadSuccess(requisito.id)}
            />
          ) : <></>}


        </td>
        {puedeCargarEliminar && requisito?.archivos.length === 1 && !requisito.validado && !requisito?.archivos[0].generado ? (
          
          <td className={styles.tdEliminarEvidencia}>
            <EliminarEvidencia
              tipoDelete={"requisito"}
              idSolicitud={idSolicitud}
              idExpediente={requisito?.archivos[0]?.id}
              activo={existeDocumento}
              onDeleteSuccess={() => handleDeleteSuccess(requisito?.archivos[0]?.id)}
              requisito={requisito}
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
    </>

  );
};

export default RowTableExpedienteRequisitos;
