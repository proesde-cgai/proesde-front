"use client";

import OnlyViewFilesCriterios from "../../secretaria/components/OnlyViewFilesCriterios";
import { useImpugnacionStore } from "../../../store/useImpugnacionStore";
import { faFilePdf, faFolder } from "@fortawesome/free-regular-svg-icons";
import styles from "./styles/ProcesarCriterios.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import { replaceBrWithNewline } from "../../../utils";
import Modal from "../../../reutilizable/Modal";
import { useState } from "react";

const Encabezado = ({ nivel, children }) => {
  const Tag = `h${nivel + 2}`;
  const dynamicClassName = `${styles.encabezado} ${styles[`encabezadoNivel${nivel}`]}`;

  return <Tag className={dynamicClassName}>{children}</Tag>;
};

const ProcesarCriterios = ({ criterios = [], register, puntaje = {}, watch, setValue, pdfDraw, typeRadio, activeChecks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  let pdfFlag = false;

  const [urlPDF, setUrlPDF] = useState(null);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({});
  const { impugnados, toggleImpugnado } = useImpugnacionStore();

  const openAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
  const closeAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
  if (!criterios || criterios.length === 0) return null;

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

  let prevSelected = 0;

  const checked = (id, puntaje) => {
    if (puntaje) {
      prevSelected = id;
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <OnlyViewFilesCriterios
        isOpen={isAddFileModalOpen}
        onClose={() => setIsAddFileModalOpen(false)}
        openModal={openModal}
        archivos={infoModal?.archivos}
        nombre={infoModal?.nombre}
        documentos={infoModal?.documentos}
        puntaje={infoModal.puntaje}
        setUrlPdf={setUrlPDF}
      />
      <div>
        <Modal isOpen={isModalOpen} onClose={closeModal} width="850px">
          <ViewerPDF urlPdf={urlPDF} />
        </Modal>

        {criterios?.map((nodo, index) => {
          const { criterio, subCriterios = [], nivel, archivos: urlPdf, tipo, rubroInconforme } = nodo;
          const { id, nombre, topeVeces, documentos, valorFijo } = criterio;
          const existeDocumento = !urlPdf || urlPdf.length === 0;

          if (subCriterios.length === 0 || !subCriterios) {
            return (
              <div key={id} className={styles.containerRespuestas}>
                <div className={styles.respuesta}>
                  {typeRadio ? (
                    <>
                      <input type="radio" name="radio" id={id} value={1} className={styles.inputRadio} {...register(`${id}`)} defaultChecked={checked(id, puntaje[id])} disabled />
                      <label className={styles.respuestaLabel} htmlFor={id}>
                        {nombre}
                      </label>
                    </>
                  ) : (
                    <>
                      <input type="text" name={`criterio-${id}`} className={styles.inputText} readOnly value={puntaje[id] || "0"} {...register(`criterio-${id}`)} />
                      <label className={styles.respuestaLabel}>{nombre}</label>
                    </>
                  )}

                  {pdfDraw &&
                    (urlPdf.length > 0 ? (
                      urlPdf.length === 1 ? (
                        <div className={styles.containerBtnPDF}>
                          <button
                            type="button"
                            className={`${styles.buttonPdf}`}
                            title="Ver Documento"
                            disabled={false}
                            onClick={() => {
                              openModal();
                              setUrlPDF(urlPdf[0]?.nodo);
                            }}>
                            <FontAwesomeIcon size="2xl" color="green" icon={faFilePdf} cursor="pointer" />
                          </button>
                        </div>
                      ) : (
                        <div className={styles.containerBtnPDF}>
                          <button
                            type="button"
                            className={styles.buttonPdf}
                            title="Folder de archivos"
                            onClick={() => {
                              openAddFileModal();
                              setInfoModal({ ...infoModal, nombre: replaceBrWithNewline(nombre), documentos: documentos, puntaje: valorFijo, archivos: urlPdf });
                            }}>
                            <FontAwesomeIcon icon={faFolder} color="green" />
                          </button>
                        </div>
                      )
                    ) : (
                      <div className={styles.containerBtnPDF}>
                        <button type="button" disabled={true} title="Sin documento" className={`${styles.buttonPdf}`}>
                          <FontAwesomeIcon size="2xl" color="gray" icon={faFilePdf} cursor="not-allowed" />
                        </button>
                      </div>
                    ))}

                  {pdfDraw && (
                    <div>
                      <input type="checkbox" className={styles.disputeCheck} disabled={activeChecks} checked={impugnados.includes(id) || rubroInconforme} onChange={() => toggleImpugnado(id)} />
                    </div>
                  )}
                </div>
              </div>
            );
          } else {
            if (index === 0 && nivel === 0) {
              pdfFlag = true;
            } else if (index === 1 && nivel === 0) {
              pdfFlag = false;
            } else if (index === 2 && nivel === 0) {
              pdfFlag = false;
            } else {
              pdfFlag = pdfDraw;
            }

            return (
              <div key={id} className={styles.formPregunta}>
                <Encabezado nivel={nivel} criterio={criterio}>
                  {nombre}
                </Encabezado>

                <ProcesarCriterios
                  criterios={subCriterios}
                  ancestroTopeVeces={topeVeces}
                  puntaje={puntaje}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  pdfDraw={pdfFlag}
                  typeRadio={tipo}
                  activeChecks={activeChecks}
                />
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default ProcesarCriterios;
