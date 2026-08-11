import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFolder } from "@fortawesome/free-regular-svg-icons";
import Modal from "../../../reutilizable/Modal";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import styles from "./styles/Criterios.module.css";
import { replaceBrWithNewline } from "../../../utils";
import OnlyViewFilesCriterios from "../../secretaria/components/OnlyViewFilesCriterios";

const Encabezado = ({ nivel, children }) => {
  const Tag = `h${nivel + 2}`;
  const dynamicClassName = `${styles.encabezado} ${styles[`encabezadoNivel${nivel}`]}`;

  return <Tag className={dynamicClassName}>{children}</Tag>;
};

const Criterios = ({ criterios = [], puntaje = {}, register, watch, setValue, pdfDraw, typeRadio }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  let pdfFlag = false;

  const [urlPDF, setUrlPDF] = useState(null);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({});
  
  const openAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
  const closeAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
  if (!criterios || criterios.length === 0) return null;

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

  let prevSelected = 0;

  const radioSelected = (e) => {
    const { id, value } = e.target;

    setValue(`${id}`, value);
    if (prevSelected !== 0) setValue(`${prevSelected}`, "0");

    prevSelected = id;
  };

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
                      <input
                        type="radio"
                        name="radio"
                        id={id}
                        value={1}
                        className={styles.inputRadio}
                        {...register(`${id}`)}
                        onChange={radioSelected}
                        defaultChecked={checked(id, puntaje[id])}
                      />
                      <label className={styles.respuestaLabel} htmlFor={id}>
                        {nombre}
                      </label>
                    </>
                  ) : (
                    <>
                      <input
                        type="number"
                        name={id}
                        id={id}
                        className={styles.inputNumber}
                        readOnly={false}
                        // value={puntaje[id] || '0'}
                        //value={watch(`criterio-${id}`, puntaje[id] || '0')}
                        defaultValue={puntaje[id] || "0"}
                        {...register(`${id}`)}
                        onKeyDown={(e) => {
                          if (["e", "E", "+", "-"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[eE+-]/g, "");
                        }}
                        onChange={(e) => setValue(`${id}`, e.target.value)}
                      />
                      <label className={styles.respuestaLabel} htmlFor={id}>
                        {nombre}
                      </label>
                    </>
                  )}

                  {
                    pdfDraw && (urlPdf.length > 0 
                      ? (urlPdf.length === 1 
                        ? 
                        <div className={styles.containerBtnPDF}>
                          <button
                            type="button"
                            className={`${styles.buttonPdf}`}
                            title="Ver Documento"
                            disabled={false}
                            onClick={() => {
                              openModal();
                              setUrlPDF(urlPdf[0]?.nodo);
                            }}
                          >
                            <FontAwesomeIcon size="2xl" color="green" icon={faFilePdf} cursor="pointer" />
                          </button>
                        </div>
                          :   
                          <div className={styles.containerBtnPDF}>
                            <button
                              type="button"
                              className={styles.buttonPdf}
                              title="Folder de archivos"
                              onClick={() => {
                                openAddFileModal();
                                setInfoModal({ ...infoModal, nombre: replaceBrWithNewline(nombre), documentos: documentos, puntaje: valorFijo, archivos: urlPdf});
                              }}
                              >
                              <FontAwesomeIcon icon={faFolder} color="green" />
                            </button>
                          </div>
                          )
                      : (
                        <div className={styles.containerBtnPDF}>
                          <button type="button" disabled={true} title="Sin documento" className={`${styles.buttonPdf}`} >
                            <FontAwesomeIcon size="2xl" color="gray" icon={faFilePdf} cursor="not-allowed" />
                          </button>
                        </div>
                      ) 
                    )
                  }

                {pdfDraw && (
                    <div>
                      <input type="checkbox" className={styles.disputeCheck} disabled={true} checked={rubroInconforme} />
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
              <div key={id} className={styles.formPregunta} style={{ marginLeft: "10px" }}>
                <Encabezado nivel={nivel} criterio={criterio}>
                  {nombre}
                </Encabezado>

                <Criterios
                  criterios={subCriterios}
                  ancestroTopeVeces={topeVeces}
                  puntaje={puntaje}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  pdfDraw={pdfFlag}
                  typeRadio={tipo}
                />
              </div>
            );
          }
          //return null; // Por seguridad
        })}
      </div>
    </>
  );
};

export default Criterios;
