import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFolder, faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { obtenerRequisitosCotejo, changeRequisito, changeRequisitoCotejo } from "../services/cotejoRequisitosService";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import Loading from "../../../reutilizable/Loading";
import Modal from "../../../reutilizable/Modal";
import Table from "../../../reutilizable/Table";
import Alert from "../../../reutilizable/Alert";
import { ERROR_MESSAGES_GENERICS_API } from "../../../utils/messagesFromAPI";
import styles from "./styles/CotejoRequisitosPage.module.css";
import useCotejoStore from "../../../store/useCotejoStore";
import CargarEvidencia from "../../academico/expediente/components/CargarEvidencia";
import VisualizarArchivosRequisitos from "../components/VisualizarArchivosRequisitos";
import ActualizarEvidencia from "../components/ActualizarEvidencia";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const CotejoRequisitosPage = () => {
  const { selectedDataAcademico } = useEvaluationStore();
  const { setEsCotejadoRequisitos, esCotejadoRequisitos } = useCotejoStore();

  const [urlPDF, setUrlPDF] = useState(null);
  const [cotejado, setCotejado] = useState(false);
  const [requisitos, setRequisitos] = useState([]);
  const [idSolicitud, setIdSolicitud] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState(new Set());

  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({});

  const openAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
  const closeAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);

  const [mensajeCotejado, setMensajeCotejado] = useState(null);
  const [mensaje, setMensaje] = useState({
    type: null,
    mensaje: null,
  });
  let cabecerasTable = [
    { id: 1, labelCabecera: "Id" },
    { id: 2, labelCabecera: "Requisito" },
    { id: 3, labelCabecera: "Ver Evidencia" },
    { id: 5, labelCabecera: "Reemplazar Evidencia" },
    { id: 4, labelCabecera: "Cotejar" },
  ];

  if (!esCotejadoRequisitos) cabecerasTable = cabecerasTable.filter((cabecera) => cabecera.id !== 5);

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (!selectedDataAcademico) return;
    setIdSolicitud(selectedDataAcademico.id);
  }, [selectedDataAcademico]);

  useEffect(() => {
    setMensaje(null);
    if (!idSolicitud) return;
    const idSolicitudString = idSolicitud.toString();
    obtenerRequisitosCotejo(idSolicitudString)
      .then((response) => {
        const requisitosResponse = response.data.requisitos;
        const cotejado = response.data.statusCotejo;

        if (requisitosResponse.length <= 0) {
          setMensaje({
            type: "warning",
            mensaje: "No hay requisitos para cotejar",
          });
          return;
        }

        cotejado === 1 ? setEsCotejadoRequisitos(true) : setEsCotejadoRequisitos(false);
        setRequisitos(requisitosResponse);
        setCotejado(cotejado);
      })
      .catch((error) => {
        console.error("Error al obtener requisitos para cotejo", error);
        if (error.response) {
          const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
          setMensaje({
            mensaje: message,
            type: "error",
          });
        }
      });
    // eslint-disable-next-line
  }, [idSolicitud, uploadedDocs]);

  const handleCheckById = async (idRequisito) => {
    const requisito = requisitos.find((req) => req.id.toString() === idRequisito.toString());

    if (!requisito) {
      console.error("No se encontró el requisito.");
      return;
    }

    let ids = [];
    for (const archivo of requisito.archivos) {
      ids.push(archivo.id);
    }

    const body = { ids: ids, cotejado: false };

    try {
      await changeRequisitoCotejo(body);

      // Actualiza el estado de los requisitos para reflejar el cambio en el checkbox
      setRequisitos((prevRequisitos) =>
        prevRequisitos.map((req) =>
          req.id === requisito.id
            ? {
                ...req,
                archivos: req.archivos.map((archivo) => ({
                  ...archivo,
                  cotejado: !archivo.cotejado,
                })),
              }
            : req
        )
      );
    } catch (error) {
      console.error(`Error al cambiar status de requisito para archivo ${requisito.id}`, error);
      if (error.response) {
        const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
        setMensaje({
          mensaje: message,
          type: "error",
        });
      }
    }
  };

  const mostrarMensajeCotejado = () => {
    setMensajeCotejado({
      type: "success",
      mensaje: "Requisitos cotejados correctamente",
    });
    setTimeout(() => {
      setMensajeCotejado(null);
    }, 4000);
  };

  const handleChecks = async (event) => {
    console.log(event.target.checked);

    const { id } = event.target;
    const requisito = requisitos.find((req) => req.id.toString() === id);

    if (!requisito) {
      console.error("No se encontró el requisito.");
      return;
    }

    let ids = [];
    for (const archivo of requisito.archivos) {
      ids.push(archivo.id);
    }

    const body = { ids: ids, cotejado: !requisito?.archivos[0].cotejado };

    try {
      await changeRequisitoCotejo(body);
      if (body.cotejado) {
        console.log(event.target.checked);
        mostrarMensajeCotejado();
      }

      // Actualiza el estado de los requisitos para reflejar el cambio en el checkbox
      setRequisitos((prevRequisitos) =>
        prevRequisitos.map((req) =>
          req.id === requisito.id
            ? {
                ...req,
                archivos: req.archivos.map((archivo) => ({
                  ...archivo,
                  cotejado: !archivo.cotejado,
                })),
              }
            : req
        )
      );
    } catch (error) {
      console.error(`Error al cambiar status de requisito para archivo ${requisito.id}`, error);
      if (error.response) {
        const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
        setMensaje({
          mensaje: message,
          type: "error",
        });
      }
    }
  };

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

  if (mensaje) {
    return (
      <Alert typeAlert={mensaje.type}>
        <p>{mensaje.mensaje}</p>
      </Alert>
    );
  }

  const handleDeleteSuccess = (idExpediente) => {
    setUploadedDocs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(idExpediente);
      console.log("Documento eliminado para id:", idExpediente);
      console.log("Nuevo estado de uploadedDocs:", newSet);
      return newSet;
    });
    obtenerRequisitosCotejo(idSolicitud.toString()).then((response) => {
      setInfoModal((prev) => ({
        ...prev,
        archivos: response.data.requisitos.find((r) => r.id === idExpediente)?.archivos || [],
      }));
    });
  };

  const handleUploadSuccess = (idExpediente) => {
    setUploadedDocs((prev) => {
      const newSet = new Set(prev);
      newSet.add(idExpediente);
      return newSet;
    });

    obtenerRequisitosCotejo(idSolicitud.toString()).then((response) => {
      const requisitosActualizados = response.data.requisitos;
      setRequisitos(requisitosActualizados);
      setInfoModal((prev) => ({
        ...prev,
        archivos: requisitosActualizados.find((r) => r.id === idExpediente)?.archivos || [],
      }));

      handleCheckById(idExpediente);
    });
  };

  return (
    <div className={styles.containerCotejoRequisitos}>
      <div className={styles.containerTablaRequisitos}>
        <Modal isOpen={isModalOpen} onClose={closeModal} width="750px">
          <ViewerPDF urlPdf={urlPDF} />
        </Modal>

        <VisualizarArchivosRequisitos
          isOpen={isAddFileModalOpen}
          onClose={() => setIsAddFileModalOpen(false)}
          //existeDocumento={existeDocumento}
          openModal={openModal}
          //requestStatus={requestStatus}
          //SOLICITUD_ENVIADA={SOLICITUD_ENVIADA}
          idSolicitud={idSolicitud}
          handleDeleteSuccess={handleDeleteSuccess}
          handleUploadSuccess={handleUploadSuccess}
          archivos={infoModal?.archivos}
          nombre={infoModal?.nombre}
          setUrlPdf={setUrlPDF}
          idExpediente={infoModal?.requisitoId}
          esCotejadoRequisitos={esCotejadoRequisitos}
        />

        <Table cabecerasTable={cabecerasTable}>
          {requisitos?.length ? (
            requisitos?.map((requisito) => {
              return (
                <tr key={requisito.id}>
                  <td>{requisito.romano}</td>
                  <td>
                    <label htmlFor={requisito.id} className={styles.label}>
                      {requisito.nombre}
                    </label>
                  </td>
                  <td className={styles.tdTablaCotejoRequisitos}>
                    {requisito?.archivos?.length === 1 && (
                      <div className={styles.containerBtnPDF}>
                        <button
                          type="button"
                          className={styles.buttonPdf}
                          title="Ver PDF"
                          onClick={() => {
                            openModal();
                            setUrlPDF(requisito.archivos[0]?.nodo || "");
                          }}>
                          <FontAwesomeIcon icon={faFilePdf} color="green" />
                        </button>
                      </div>
                    )}

                    {requisito?.archivos?.length > 1 && (
                      <div className={styles.containerBtnPDF}>
                        <button
                          type="button"
                          className={styles.buttonPdf}
                          title="folder de archivos"
                          onClick={() => {
                            openAddFileModal();
                            setInfoModal({
                              ...infoModal,
                              nombre: requisito.nombre,
                              archivos: requisito.archivos,
                              requisitoId: requisito.id,
                            });
                          }}>
                          <FontAwesomeIcon icon={faFolder} color="green" />
                        </button>
                      </div>
                    )}
                  </td>
                  {esCotejadoRequisitos && requisito?.archivos?.length > 1 ? (
                    <td></td>
                  ) : esCotejadoRequisitos ? (
                    <td>
                      <ActualizarEvidencia
                        idExpediente={requisito.id}
                        idSolicitud={idSolicitud}
                        tipoUpload="requisito"
                        onUploadSuccess={() => handleUploadSuccess(requisito.id)}
                        onDeleteSuccess={() => handleDeleteSuccess(requisito?.archivos[0]?.id)}
                        archivoId={requisito?.archivos[0]?.id}
                      />
                    </td>
                  ) : (
                    <></>
                  )}
                  <td className={styles.tdCheckCotejo}>
                    {requisito.archivos?.every(a => a.generado) ? (
                      <FontAwesomeIcon icon={faCheckCircle} color="green" title="Generado por sistema" size="lg" />
                    ) : (
                      <input
                        type="checkbox"
                        className={`checkbox_green ${styles.checkCotejo}`}
                        id={requisito.id}
                        {...register(`${requisito.id}`)}
                        disabled={cotejado >= 2}
                        onChange={handleChecks}
                        checked={requisito?.archivos[0]?.cotejado || false}
                      />
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <Loading />
          )}
        </Table>
        {mensajeCotejado ? (
          <Alert typeAlert={mensajeCotejado.type}>
            <p>{mensajeCotejado.mensaje}</p>
          </Alert>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CotejoRequisitosPage;
