import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faFilePdf, faSave, faFolder } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import Alert from "../../../reutilizable/Alert";
import Modal from "../../../reutilizable/Modal";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import { getRequisitos, postSatisfacerRequisitos } from "../services/requisitosService";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import styles from "./styles/requisitos.module.css";
import OnlyViewFilesRequisitos from "../../secretaria/components/OnlyViewFilesRequisitos";

export const Requisitos = ({ isEdited = true }) => {
  console.log("isEdited", isEdited);
  const { selectedDataAcademico } = useEvaluationStore();
  const [existeInconformidad, setExisteInconformidad] = useState();
  const [showTextArea, setShowTextArea] = useState(false);
  const [requisitos, setRequisitos] = useState([]);
  const [idSolicitud, setIdSolicitud] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dataForm, setDataForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cumpleRequisitos, setCumpleRequisitos] = useState({
    cumple: Boolean,
    mensaje: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlPdf, setUrlPdf] = useState(null);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({});

  const openAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
  const closeAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);

  useEffect(() => {
    if (!selectedDataAcademico) return;
    setIdSolicitud(selectedDataAcademico.id);
  }, [selectedDataAcademico]);

  useEffect(() => {
    if (!selectedDataAcademico || !selectedDataAcademico.id) {
      setLoading(false);
      return;
    }
    
    //const idSolicitud = 1;
    const idSolicitud = selectedDataAcademico.id;
    const aliasActividad = "evaluacion"; // se tiene que mapear

    getRequisitos(idSolicitud, aliasActividad)
      .then((response) => {
        setDataForm(response.data);
        setRequisitos(response.data.requisitos);
        setError(null);
      })
      .catch((error) => {
        console.error("Error al obtener los requisitos: ", error);
        if (error) {
          setError("Ocurrió un error inesperado, no se ha podido obtener los requisitos.", error);
        }

        if (error.response) {
          setError(
            `Ocurrió un error al obtener los requisitos: ${error.response.data.mensaje} - Status Code: ${error.response.status}`
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedDataAcademico, idSolicitud]);

  useEffect(() => {
    if (!selectedDataAcademico) return;
    setExisteInconformidad(selectedDataAcademico.inconformidad);
  }, [selectedDataAcademico]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      respuestaInconformidad: null,
      ratificaModifica: null,
      esConcursante: false,
      requisitos: [],
      razones: null,
    },
  });

  console.log(getValues());

  // Observar los valores para mostrar condicionalmente los inputs
  const esConcursante = watch("esConcursante");
  const ratificaModifica = watch("ratificaModifica");

  // Autorellenar el formulario
  useEffect(() => {
    if (dataForm) {
      dataForm?.requisitos?.forEach((requisito) => {
        setValue(`requisitos.${requisito.id}`, requisito.satisfecho);
      });

      setValue("esConcursante", dataForm.esConcursante);
      setValue("ratificaModifica", dataForm.ratificaModifica);
      setValue("razones", dataForm.razones);
      setValue("respuestaInconformidad", dataForm.respuestaInconformidad);
    }
  }, [dataForm, setValue, requisitos]);

  useEffect(() => {
    esConcursante === "false" ? setShowTextArea(true) : setShowTextArea(false);
  }, [esConcursante, showTextArea]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, [isVisible]);

  const handleClickMarcarTodos = () => {
    requisitos?.forEach((requisito) => {
      if (!getValues(`requisitos.${requisito.id}`)) {
        setValue(`requisitos.${requisito.id}`, true);
      }
    });
  };

  const desiredKeys = ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];

  const handleSubmitRequisitos = async (data) => {
    if (!selectedDataAcademico || !selectedDataAcademico.id) {
      setError("No hay un académico seleccionado");
      return;
    }
    
    const aliasActividad = "evaluacion";
    const esConcursante = data.esConcursante;
    const razones = data.razones || null;
    const idSolicitud = selectedDataAcademico.id;
    const requisitos = data?.requisitos?.reduce((acc, value, index) => {
      console.log(acc[String(index)]);
      if (value === true) {
        acc[String(index)] = "satisfecho"; // Convierte el índice a string
      }
      return acc;
    }, {});

    //console.log(requisitos)
    const requisitosJson = JSON.stringify(requisitos);
    console.log(requisitosJson);

    const body = { aliasActividad, esConcursante, razones, idSolicitud, requisitos };
    try {
      const response = await postSatisfacerRequisitos(JSON.stringify(body));
      console.log("🚀 ~ handleSubmitRequisitos ~ response:", response);
      if (response.cumpleRequisitos) {
        setIsVisible(!isVisible);
        setCumpleRequisitos({
          cumple: true,
          mensaje: "Cambios guardados. Ya puede realizar la evaluación",
        });
      }
    } catch (error) {
      setCumpleRequisitos({
        cumple: false,
        mensaje: "No cumple con los requisitos de evaluación y no puede ser evaluado",
      });
      console.log(error);
    }
  };

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

  if (!selectedDataAcademico || !selectedDataAcademico.id) {
    return (
      <Alert typeAlert="warning">
        <p>Por favor seleccione un académico para ver los requisitos</p>
      </Alert>
    );
  }

  if (loading)
    return (
      <Alert typeAlert="warning">
        <p>Cargando requisitos...</p>
      </Alert>
    );

  if (error)
    return (
      <Alert typeAlert="error">
        <p>{error}</p>
      </Alert>
    );

  return (
    <>
      <OnlyViewFilesRequisitos
        isOpen={isAddFileModalOpen}
        onClose={() => setIsAddFileModalOpen(false)}
        openModal={openModal}
        idSolicitud={idSolicitud}
        archivos={infoModal?.archivos}
        nombre={infoModal?.nombre}
        setUrlPdf={setUrlPdf}
      />
      <div className={styles.requisitosContainer}>
        <Modal isOpen={isModalOpen} onClose={closeModal} width="850px">
          <ViewerPDF urlPdf={urlPdf} />
        </Modal>

        <h2>
          <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> {""}
          Requisitos de participación
        </h2>

        <div className={styles.listRequisitos}>
          <form onSubmit={handleSubmit(handleSubmitRequisitos)}>
            {requisitos?.map((requisito) => (
              <div className={styles.requisito} key={requisito.id}>
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
                            openModal();
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
                  {requisito.validado && (
                    <div className={styles.validado}>
                     
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className={styles.restForm}>
              {esConcursante === false && (
                <>
                  <div className={styles.textarea}>
                    <label htmlFor="razones">Razones:</label>
                    <textarea
                      name="razones"
                      id="razones"
                      rows={4}
                      className={styles.textarea}
                      {...register("razones", { minLength: 10 })} // preguntar el minimo de caracteres
                    ></textarea>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
