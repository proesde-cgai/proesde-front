import React, { useEffect, useState } from "react";
import { useDatosInconformidad } from '../hooks/useDatosInconformidad';
import Alert from '../../../../../reutilizable/Alert';
import Loading from '../../../../../reutilizable/Loading';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faFolder } from "@fortawesome/free-solid-svg-icons";
import { useEvaluationStore } from "../../../../../store/useEvaluationStore";
import styles from "../styles/DatosInconformidad.module.css";
import {faFilePdf} from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../../../reutilizable/Modal";
import ViewerPDF from "../../../../../reutilizable/ViewerPDF";
import TablaResultadosEvaluacion from "../../../../evaluacion/components/TablaResultadosEvaluacion";
import { useParticipante } from "../hooks/useParticipante";
import { useTablaResultados } from "../hooks/useTablaResultados";
import { useRequisitos } from "../hooks/useRequisitos";
import OnlyViewFilesRequisitos from "../../../components/OnlyViewFilesRequisitos";

const DatosInconformidad = () => {

  const { selectedDataAcademico } = useEvaluationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Variables para participantes.
  const [isParticipant, setIsParticipant] = useState(true);

  // Variables para no participantes.
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({});
  const openAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
  const [isModalRequisitosOpen, setIsModalRequisitosOpen] = useState(false);
  const openModalRequisitos = () => setIsModalRequisitosOpen(!isModalRequisitosOpen);
  const closeModalRequisitos = () => setIsModalRequisitosOpen(!isModalRequisitosOpen);

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

  const [urlPdf, setUrlPdf] = useState(null);

  const [mensajeAlerta, setMensajeAlerta] = useState({
    type: null,
    mensaje: null,
  });

  const { id: idSolicitud, codigo, inconformidad, } = selectedDataAcademico;
  const { data } = useParticipante(codigo);
  
  useEffect(() => {
    if (!data) return;
    setIsParticipant(data === 'PARTICIPANTE');
  }, [data]);

  const { formData, isLoadingAcademico, error } = useDatosInconformidad(codigo);
  const { data: resultadosTabla } = useTablaResultados({ aliasActividad: "evaluacion", idSolicitud: idSolicitud, });
  const { data: dataRequisitos, loading, error: errorRequisitos } = useRequisitos({ idSolicitud: idSolicitud, aliasActividad: "evaluacion" });

  const resultadosEvaluacion = resultadosTabla?.tablaResultados ?? [];
  const nivel = resultadosTabla?.nivelPrimerEvaluacion ?? "";

  const requisitos = dataRequisitos?.requisitos ?? [];
  const razones = dataRequisitos?.razones ?? "";
 
  const {
    recibida,
    fecha,
    area,
    nombreDocumento,
    nodo,
    nodoFirmado
  } = formData;

  if (loading || isLoadingAcademico) return <Loading />;
  if (errorRequisitos || error) return <Alert typeAlert="error">Hubo un error...</Alert>;

  return (
    <div className={styles.container}>
      <div className={styles.containerData}>
      <Modal isOpen={isModalOpen} onClose={closeModal} width="850px">
          <ViewerPDF urlPdf={urlPdf} />
        </Modal>
        {/* DATOS PERSONALES */}
        {!inconformidad ? (
          <Alert typeAlert="warning">
            <p>No tiene una inconformidad el usuario</p>
          </Alert>
        ) : (
          <div className={styles.datosPersonales}>
            <p className={styles.nombreDatos}>
              <FontAwesomeIcon icon={faAngleRight} color={"yellow"} />{" "}
              Datos de Inconformidad
            </p>

            <div className={styles.containerTableData}>
              <div className={styles.inputContainer}>
                <label htmlFor="fechaRecibido">Solicitud recibida en</label>
                <input
                  id="fechaRecibido"
                  type="text"
                  value={recibida || "Sin registro"}
                  readOnly
                />
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="fechaInconformidad">Fecha inconformidad</label>
                <input
                  id="fechaInconformidad"
                  type="text"
                  value={fecha || "Sin registro"}
                  readOnly
                />
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="razonInconformidad">
                  Razones de la inconformidad
                </label>
                <textarea
                  id="razonInconformidad"
                  value={area || "Sin registro"}
                  readOnly
                />
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="nodo">
                  Evidencia
                </label>
                {nodo ? (
                  <button
                    type="button"
                    className={styles.buttonPdf}
                    title="Ver PDF"
                    onClick={() => {
                      openModal();
                      setUrlPdf(nodo);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      color="green"
                      size="2xl"
                    />
                  </button>
                ) : (
                  <></>
                )}
          
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="nodo">
                  Escrito de inconformidad
                </label>
                {nodoFirmado ? (
                  <button
                    type="button"
                    className={styles.buttonPdf}
                    title="Ver PDF"
                    onClick={() => {
                      openModal();
                      setUrlPdf(nodoFirmado);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      color="green"
                      size="2xl"
                    />
                  </button>
                ) : (
                  <></>
                )}
          
              </div>

            </div>
          </div>
        )}
      </div>


      <div className={styles.containerTableData}>
        {isParticipant
          ? <TablaResultadosEvaluacion resultados={resultadosEvaluacion} nivel={nivel} />
          : (
            <>
              <OnlyViewFilesRequisitos
                isOpen={isAddFileModalOpen}
                onClose={() => setIsAddFileModalOpen(false)}
                openModal={openModalRequisitos}
                idSolicitud={idSolicitud}
                archivos={infoModal?.archivos}
                nombre={infoModal?.nombre}
                setUrlPdf={setUrlPdf}
              />
              <p className={styles.nombreDatos}>
                <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> {""} Requisitos de participación
              </p>
              <div className={styles.requisitosContainer}>
                <Modal isOpen={isModalRequisitosOpen} onClose={closeModalRequisitos} width="850px"> <ViewerPDF urlPdf={urlPdf} /> </Modal>

                <div className={styles.listRequisitos}>
                  {requisitos?.map((requisito) => (
                    <div className={styles.requisitoTabla} key={requisito.id}>
                      <div className={styles.nombreRequisito}>
                        <label htmlFor={`requisito-${requisito.id}`}>
                          <span>{requisito.romano}</span> {requisito.nombre}
                        </label>
                      </div>
                      <div className={styles.containerBtnAction}>

                        {requisito.archivos.length > 0 ? (
                          requisito.archivos.length === 1 ? (
                            <div className={styles.containerBtnPDF}>
                              <button
                                type="button"
                                className={styles.buttonPdf}
                                title="Ver PDF"
                                onClick={() => {
                                  openModalRequisitos();
                                  setUrlPdf(requisito?.archivos[0]?.nodo || "");
                                }}
                              >
                                <FontAwesomeIcon icon={faFilePdf} color="green" />
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
                                  setInfoModal({ ...infoModal, nombre: requisito.nombre, archivos: requisito?.archivos });
                                }}
                              >
                                <FontAwesomeIcon icon={faFolder} color="green" />
                              </button>
                            </div>
                          )
                        ) : null}

                        {requisito?.nodo ? (
                          <button
                            type="button"
                            className={styles.buttonPdf}
                            title="Ver PDF"
                            onClick={() => {
                              openModalRequisitos();
                              setUrlPdf(requisito?.nodo);
                            }}
                          >
                            <FontAwesomeIcon icon={faFilePdf} color="green" size="2xl" />
                          </button>
                        ) : (
                          <></>
                        )}

                      </div>
                    </div>
                  ))}

                  <div className={styles.restForm}>
                      <>
                        <div className={styles.textarea}>
                          <label htmlFor="razones">Razones:</label>
                          <textarea
                            name="razones"
                            id="razones"
                            rows={4}
                            className={styles.textarea}
                            value={razones|| ""}  
                          ></textarea>
                        </div>
                      </>
                  </div>
                </div>
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default DatosInconformidad;
