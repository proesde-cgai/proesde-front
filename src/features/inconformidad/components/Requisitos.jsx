import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faFolder,
  faFilePdf,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import Alert from "../../../reutilizable/Alert";
import Modal from "../../../reutilizable/Modal";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import {
  getRequisitos,
  postSatisfacerRequisitos,
} from "../services/requisitosService";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import styles from "./styles/requisitos.module.css";
import TabEvaluarPage from "../../evaluacion/pages/TabEvaluarPage";
import DicFinal from "../../evaluacion/components/DicFinal";
import DicNoParticipantes from "../../evaluacion/components/DicNoParticipantes";
import { useInconformidadStore } from "../../../store/useInconformidadStore";
import { fetchStatus } from "../../secretaria/secretariaAdminSems/GenerarDocInconformidad/hooks/useFetchStatus";
import OnlyViewFilesRequisitos from "../../secretaria/components/OnlyViewFilesRequisitos";
import api from "../../../hooks/api";

export const Requisitos = ({ isEdited = true }) => {
  const { selectedDataAcademico, idSolicitud, setIsConcursante, selectedDataAcademicoFull, statusEvaluacion, fetchStatusEvaluacion, } =
    useEvaluationStore();
  const { setIsConcursanteInconformidad, statusInconformidad, setStatusInconformidad, } = useInconformidadStore();
    // console.log("Datos full academico: ",selectedDataAcademicoFull);
    // console.log("Datos academico: ",selectedDataAcademico);

  const [showTextArea, setShowTextArea] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [requisitos, setRequisitos] = useState([]);
  const [requisitosSize, setRequisitosSize] = useState([]);
  const [dataForm, setDataForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const roleUser = localStorage.getItem('rol');
  const isDictaminadora = roleUser === 'comision_especial_dictaminadora_ag' ||
                          roleUser === 'comision_especial_dictaminadora_sems';
  const [gacetaConfirmada, setGacetaConfirmada] = useState(false);
  const [aliasActividad, setAliasActividad] = useState("evaluacion");
  // console.log("Requisitos: ", requisitos);

  const [cumpleRequisitos, setCumpleRequisitos] = useState({
    cumple: false,
    mensaje: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlPdf, setUrlPdf] = useState(null);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({});

  const openAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
  const closeAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);

  useEffect(() => {
    let aliasActividad = "";
    const roleUser = localStorage.getItem("rol");
    (roleUser === "comision_ingreso_promocion_personal_academico_sems" ||
      roleUser === "comision_ingreso_promocion_personal_academico_cu_ep" ||
      roleUser === "comision_ingreso_promocion_personal_academico_h_cgu") ?
        aliasActividad = "inconformidad" : aliasActividad = "evaluacion"; // se tiene que mapear
    setAliasActividad(aliasActividad);
    setLoading(true);

    getRequisitos(idSolicitud, aliasActividad)
      .then((response) => {
        setDataForm(response.data);
        setRequisitos(response.data.requisitos);
        setRequisitosSize(response.data.requisitos.length);
        setError(null);
        setIsVisible(false);
      })
      .catch((error) => {
        console.error("Error al obtener los requisitos: ", error);
        if (error) {
          setError(
            "Ocurrió un error inesperado, no se ha podido obtener los requisitos.",
            error
          );
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
      esConcursante: statusEvaluacion === 2 ? null : false,
      requisitos: [],
      razones: null,
    },
  });

  console.log('statusInconformidad: ', statusInconformidad);
  console.log('statusEvaluacion: ', statusEvaluacion);

  // Observar los valores para mostrar condicionalmente los inputs
  const esConcursante = watch("esConcursante");
  const ratificaModifica = watch("ratificaModifica");

  // Autorellenar el formulario
  useEffect(() => {
    console.log('Datos del form', dataForm);
    if (dataForm) {
      dataForm?.requisitos?.forEach((requisito) => {
        setValue(`requisitos.${requisito.id}`, requisito.satisfecho);
      });

      setValue("ratificaModifica", dataForm.ratificaModifica);
      setValue("razones", dataForm.razones);
      setValue("respuestaInconformidad", dataForm.respuestaInconformidad);

      if (!isEdited) {
        setValue("esConcursante", false);
      } else if(statusEvaluacion === 2 ){
        setValue("esConcursante", (statusEvaluacion === 2) ? null : dataForm.esConcursante);
      } else if(statusInconformidad === 4 && (!statusEvaluacion || statusEvaluacion === 9)){
        setValue("esConcursante", (statusInconformidad === 4) ? null : dataForm.esConcursante);
      } else{
        setValue("esConcursante", dataForm.esConcursante);
      }
    }
      // eslint-disable-next-line
  }, [dataForm, setValue, requisitos]);

  useEffect(() => {
    esConcursante === "false" ? setShowTextArea(true) : setShowTextArea(false);
  }, [esConcursante, showTextArea]);

  useEffect(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!isDictaminadora) return;
    api.get("/api/v1/gaceta/status")
      .then((response) => {
        const confirmada = response.data === true || response.data === "true";
        setGacetaConfirmada(confirmada);
      })
      .catch(() => setGacetaConfirmada(false));
  }, [isDictaminadora]);

  const handleClickMarcarTodos = () => {
    requisitos?.forEach((requisito) => {
      if (!getValues(`requisitos.${requisito.id}`)) {
        setValue(`requisitos.${requisito.id}`, true);
      }
    });
  };

  const desiredKeys = [
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
  ];

  const closeMessageModal = () => {
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  const handleSubmitRequisitos = async (data) => {
    // console.log("Concursante value before validation: ", esConcursante);
    const razones = data.razones || null;
    const idSolicitud = selectedDataAcademico.id || "";
    const requisitos = data?.requisitos?.reduce((acc, value, index) => {
      console.log(acc[String(index)]);
      if (value === true) {
        acc[String(index)] = "satisfecho"; // Convierte el índice a string
      }
      return acc;
    }, {});

    console.log(requisitos);
    const requisitosJson = JSON.stringify(requisitos);

    const body = {
      aliasActividad,
      esConcursante,
      razones,
      idSolicitud,
      requisitos,
    };
    if(esConcursante === null || esConcursante === undefined){
      // Validar nulo
      setIsVisible(true);
      setCumpleRequisitos({
        cumple: false,
        mensaje:
          "Debe seleccionar un tipo de concursante",
      });
      return;
    }
    if ( esConcursante && Object.keys(requisitos).length < requisitosSize ) {
      // Validar que no haya campos vacios
      console.log("Entra validacion");
      console.log("Concursante value before error: ", esConcursante);
      setIsVisible(true);
      setCumpleRequisitos({
        cumple: false,
        mensaje:
          "Todos los campos requieren ser marcados para continuar como concursante.",
      });
      setValue("esConcursante", true);
      console.log("Concursante value after error: ", esConcursante);
      return;
    } else if(esConcursante === false && (!razones || razones === "")){
      // Validar campo de razon
      console.log("Validar razón");
      console.log("Concursante value before error: ", esConcursante);
      setIsVisible(true);
      setCumpleRequisitos({
        cumple: false,
        mensaje:
          "Debe justificar la razon del incumplimiento",
      });
      setValue("esConcursante", false);
      console.log("Concursante value after error: ", esConcursante);

      return;
    }

    try {
      const response = await postSatisfacerRequisitos(JSON.stringify(body));
      const data = response.data;
      console.log("🚀 ~ handleSubmitRequisitos ~ data:", data)
      if (response.status === 200) {
        setIsVisible(!isVisible);
        setCumpleRequisitos({
          cumple: true,
          mensaje: "Cambios guardados. Ya puede realizar la evaluación",
        });
        console.log('Data: ', data);
        console.log(roleUser);
        if (roleUser === 'comision_ingreso_promocion_personal_academico_sems' ||
            roleUser === 'comision_ingreso_promocion_personal_academico_cu_ep' ||
            roleUser === 'comision_ingreso_promocion_personal_academico_h_cgu') {
          setIsConcursanteInconformidad(data.cumpleRequisitos);
          console.log('Set true a inconformidad');
          setValue('esConcursante', data.cumpleRequisitos);
          // Status validation
          const responseStatus = await fetchStatus(idSolicitud);
          setStatusInconformidad(responseStatus);
          closeMessageModal();
          return;
        }
        setIsConcursante(data.cumpleRequisitos);
        fetchStatusEvaluacion();
        console.log('Antes del setValue: ', esConcursante);
        setValue("esConcursante", data.cumpleRequisitos);
        console.log('Despues del setValue: ', esConcursante);

        setTimeout(() => {
          console.log("Cerrando modal despues de 4 seg.");
          setIsVisible(false);
          setCumpleRequisitos({
            cumple: true,
            mensaje: "",
          });
        }, 3000);
        return;
      }

      throw error;
    } catch (error) {
      if (error === null) return;
      setIsVisible(true);
      setCumpleRequisitos({
        cumple: false,
        mensaje:
          "No cumple con los requisitos de evaluación y no puede ser evaluado",
      });
      console.log(error);
    }
  };

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

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

    console.log("Concursante value: ", esConcursante);

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
            {isEdited && requisitos?.map((requisito) => (
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

                  {requisito?.nodo ? (
                    <button
                      type="button"
                      className={styles.buttonPdf}
                      title="Ver PDF"
                      onClick={() => {
                        openModal();
                        setUrlPdf(requisito?.nodo);
                      }}
                    >
                      <FontAwesomeIcon icon={faFilePdf} color="green" size="2xl" />
                    </button>
                  ) : (
                    <></>
                  )}

                  <input
                    id={`requisito-${requisito.id}`}
                    type="checkbox"
                    {...register(`requisitos.${requisito.id}`)}
                    className="checkbox_green"
                    defaultChecked={requisito.satisfecho}
                  />
                </div>
              </div>
            ))}

            <div className={styles.restForm}>
              {isEdited && (
                <div className={styles.buttonCheckTodos}>
                  <button type="button" onClick={handleClickMarcarTodos}>
                    [Marcar Todos]
                  </button>
                </div>
              )}

              {isEdited && (
                <div className={styles.inputsRadio}>
                  <div className={styles.containerInputRadio}>
                    <label htmlFor="concursante">Concursante</label>
                    <input
                      type="radio"
                      name="concursante"
                      id="concursante"
                      className="inpt_radio_green"
                      value={true}
                      {...register("esConcursante")}
                      onChange={() =>
                        setValue("esConcursante", true)
                      }
                      checked={esConcursante === true}
                    />
                  </div>
                  <div className={styles.containerInputRadio}>
                    <label htmlFor="noConcursante">No concursante</label>
                    <input
                      type="radio"
                      name="concursante"
                      id="noConcursante"
                      className="inpt_radio_green"
                      value={false}
                      {...register("esConcursante")}
                      onChange={() =>
                        setValue("esConcursante", false)
                      }
                      checked={esConcursante === false}
                    />
                  </div>
                </div>
              )}

              {(isEdited ? esConcursante === false : true) && (
                <div className={styles.textarea}>
                  <label htmlFor="razones">Razones:</label>
                  <textarea
                    name="razones"
                    id="razones"
                    rows={8}
                    style={{ width: '100%', resize: 'vertical' }}
                    {...register("razones")}
                  ></textarea>
                </div>
              )}

              {cumpleRequisitos && isVisible && (
                <Alert typeAlert={cumpleRequisitos.cumple ? "success" : "error"}>
                  <p>{cumpleRequisitos.mensaje}</p>
                </Alert>
              )}

              {isEdited && !getValues().requisitos.some((req) => req === true) && (
                <Alert typeAlert={"warning"}>
                  <p>Debe seleccionar al menos un requisito</p>
                </Alert>
              )}

              {isEdited && Boolean(errors.esConcursante) && (
                <Alert typeAlert={"error"}>
                  <p>Debe seleccionar al menos un requisito e indicar si es o no concursante</p>
                </Alert>
              )}

              <div className={styles.containerSubmit}>
                <button
                  type="submit"
                  className={`texto_con_icono ${styles.buttonSubmit}`}
                  disabled={isDictaminadora && gacetaConfirmada}
                >
                  Guardar {""}
                  <FontAwesomeIcon icon={faSave} color={isDictaminadora && gacetaConfirmada ? "#555" : "cyan"} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
