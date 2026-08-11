import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFolder } from "@fortawesome/free-regular-svg-icons";
import Modal from "../../../reutilizable/Modal";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import styles from "./styles/ProcesarCriterios.module.css";
import { replaceBrWithNewline } from "../../../utils";
import OnlyViewFilesCriterios from '../../secretaria/components/OnlyViewFilesCriterios';

const Encabezado = ({ nivel, children }) => {
  const Tag = `h${nivel + 2}`;
  const dynamicClassName = `${styles.encabezado} ${styles[`encabezadoNivel${nivel}`]}`;

  return <Tag className={dynamicClassName}>{children}</Tag>;
};

const ProcesarCriterios = ({ criterios = [], puntaje = {}, register, watch, setValue, pdfDraw, typeRadio, criteriosDedicacion=[]}) => {
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

    if (criteriosDedicacion.includes(parseInt(id))) {
      // Primero, poner todos los criterios de dedicación en "0"
      criteriosDedicacion.forEach((criterioId) => {
        setValue(`${criterioId}`, "0", { shouldValidate: false }); 
      });
      // Luego, establecer el seleccionado en "1"
      setValue(`${id}`, value, { shouldValidate: false });
    } else {
      setValue(`${id}`, value);
    }
  };

  const checked = (id, puntaje) => {
    if (puntaje) {
      prevSelected = id;
      return true;
    } else {
      return false;
    }
  };

  // Función para determinar si un radio de dedicación está seleccionado
  const isDedicacionSelected = (id) => {
    if (!criteriosDedicacion.includes(id)) return false;
    const currentValue = watch(`${id}`);
    // Si hay un valor en el formulario, usarlo; si no, usar el valor inicial de puntaje
    if (currentValue !== undefined && currentValue !== null) {
      return currentValue === "1" || currentValue === 1;
    }
    // Si no hay valor en el formulario, verificar el valor inicial
    return puntaje[id] === "1" || puntaje[id] === 1;
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
          const { criterio, subCriterios = [], nivel, archivos: urlPdf, tipo } = nodo;
          const { id, nombre, topeVeces, documentos, valorFijo } = criterio;
          const existeDocumento = !urlPdf || urlPdf.length === 0;

          // if (nivel === 2 && subCriterios.length === 0) {
          //   return (
          //     <div key={id} className={styles.formPregunta} style={{ marginLeft: "10px" }}>
          //       <Encabezado nivel={nivel} criterio={criterio}>
          //         {nombre}
          //       </Encabezado>

          //       <ProcesarCriterios
          //         criterios={subCriterios}
          //         ancestroTopeVeces={topeVeces}
          //         puntaje={puntaje}
          //         register={register}
          //         watch={watch}
          //         setValue={setValue}
          //         pdfDraw={true}
          //       />
          //     </div>
          //   );
          // }

          if (subCriterios.length === 0 || !subCriterios) {
            const inputContent = (
              <div className={styles.respuesta}>
                  {typeRadio ? (
                    <>
                      {criteriosDedicacion.includes(id) ? (() => {
                        const registerProps = register(`${id}`);
                        return (
                          <>
                            <input
                              type="radio"
                              name="radio_dedicacion"
                              id={id}
                              value="1"
                              className={styles.inputRadio}
                              checked={isDedicacionSelected(id)}
                              onChange={(e) => {
                                radioSelected(e);
                                registerProps.onChange(e);
                              }}
                              onBlur={registerProps.onBlur}
                              ref={registerProps.ref}
                            />
                          </>
                        );
                      })() : (
                        <input
                          type="radio"
                          name={`radio_${id}`}
                          id={id}
                          value={1}
                          className={styles.inputRadio}
                          {...register(`${id}`)}
                          onChange={radioSelected}
                          defaultChecked={checked(id, puntaje[id])}
                        />
                      )}
                    </>
                  ) : (
                    <input
                      type="number"
                      name={id}
                      id={id}
                      className={styles.inputNumber}
                      readOnly={false}
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
                  )}
                  {
                    pdfDraw && (urlPdf.length > 0
                      ? (urlPdf.length === 1
                        ? <div className={styles.containerBtnPDF}>
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
                        : <div className={styles.containerBtnPDF}>
                            <button
                              type="button"
                              className={styles.buttonPdf}
                              title="Folder de archivos"
                              onClick={() => {
                                openAddFileModal();
                                setInfoModal({ ...infoModal, nombre: replaceBrWithNewline(nombre), documentos: documentos, puntaje: valorFijo, archivos: urlPdf });
                              }}
                            >
                              <FontAwesomeIcon icon={faFolder} color="green" />
                            </button>
                          </div>
                        )
                      : <div className={styles.containerBtnPDF}>
                          <button type="button" disabled={true} title="Sin documento" className={`${styles.buttonPdf}`}>
                            <FontAwesomeIcon size="2xl" color="gray" icon={faFilePdf} cursor="not-allowed" />
                          </button>
                        </div>
                    )
                  }
              </div>
            );

            if (nivel <= 2 && !typeRadio) {
              return (
                <div key={`${id}${index}`} className={styles.formPregunta} style={{ marginLeft: "10px" }}>
                  <Encabezado nivel={nivel} criterio={criterio}>
                    {nombre}
                  </Encabezado>
                  <div className={styles.containerRespuestas}>
                    {inputContent}
                  </div>
                </div>
              );
            }

            return (
              <div key={`${id}${index}`} className={styles.containerRespuestas}>
                <div className={styles.respuesta}>
                  {typeRadio ? (
                    <>
                      {criteriosDedicacion.includes(id) ? (() => {
                        // Radio buttons de dedicación: todos comparten el mismo name
                        const registerProps = register(`${id}`);
                        return (
                          <>
                            <input
                              type="radio"
                              name="radio_dedicacion"
                              id={id}
                              value="1"
                              className={styles.inputRadio}
                              checked={isDedicacionSelected(id)}
                              onChange={(e) => {
                                radioSelected(e);
                                registerProps.onChange(e);
                              }}
                              onBlur={registerProps.onBlur}
                              ref={registerProps.ref}
                            />
                            <label className={styles.respuestaLabel} htmlFor={id}>
                              {nombre}
                            </label>
                          </>
                        );
                      })() : (
                        // Radio buttons normales: cada uno con su propio name
                        <>
                          <input
                            type="radio"
                            name={`radio_${id}`}
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
                      )}
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
                      ) )}
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

                <ProcesarCriterios
                  criterios={subCriterios}
                  ancestroTopeVeces={topeVeces}
                  puntaje={puntaje}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  pdfDraw={pdfFlag}
                  typeRadio={tipo}
                  criteriosDedicacion={criteriosDedicacion}
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

export default ProcesarCriterios;
