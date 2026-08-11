import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import { faAngleRight, faSave } from "@fortawesome/free-solid-svg-icons";
import Alert from "../../../reutilizable/Alert";
import Modal from "../../../reutilizable/Modal";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import Loading from "../../../reutilizable/Loading";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { getRequisitos, postSatisfacerRequisitos } from "../services/requisitosService";
import styles from "./styles/RequisitosInconformidadPage.module.css";

const TIPO_PARTICIPACION = {
  inconformidad: "inconformidad",
  evaluacion: "evaluacion",
};

const RequisitosInconformidadPage = () => {
  const { selectedDataAcademico, idSolicitud, isLoading, setIsLoading, selectedDataAcademicoFull } =
    useEvaluationStore();

  const [showTextArea, setShowTextArea] = useState(false);
  const [requisitos, setRequisitos] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [dataForm, setDataForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlPdf, setUrlPdf] = useState(null);
  const [cumpleRequisitos, setCumpleRequisitos] = useState({
    cumple: false,
    mensaje: "",
  });

  useEffect(() => {
    console.log(selectedDataAcademicoFull);
  }, [selectedDataAcademicoFull]);

  useEffect(() => {
    setError(null);
    setCumpleRequisitos(null);
    setIsLoading(true);
    const aliasActividad = TIPO_PARTICIPACION.inconformidad;

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
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDataAcademico, idSolicitud]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      respuestaInconformidad: null,
      ratificaModifica: null,
      esConcursante: false,
      requisitos: [],
      razones: null,
    },
  });

  // Observar los valores para mostrar condicionalmente los inputs
  const esConcursante = watch("esConcursante");

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
    setIsVisible(false);
  }, []);

  const handleClickMarcarTodos = () => {
    requisitos?.forEach((requisito) => {
      if (!getValues(`requisitos.${requisito.id}`)) {
        setValue(`requisitos.${requisito.id}`, true);
      }
    });
  };

  const closeMessageNotification = () => {
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  const handleSubmitRequisitos = async (data) => {
    setCumpleRequisitos(null);

    const aliasActividad = TIPO_PARTICIPACION.inconformidad;
    const esConcursante = data.esConcursante;
    const razones = data.razones || null;
    const idSolicitud = selectedDataAcademico.id || "";
    //const ratificaModifica = Number(data.ratificaModifica) || null;

    const requisitos = data?.requisitos?.reduce((acc, value, index) => {
      if (value === true) {
        acc[String(index)] = "satisfecho"; // Convierte el índice a string
      }
      return acc;
    }, {});

    const body = { aliasActividad, esConcursante, razones, idSolicitud, requisitos };

    try {
      const response = await postSatisfacerRequisitos(body);
      console.log(response.data.cumpleRequisitos);
      if (response.data.cumpleRequisitos) {
        setIsVisible(true);
        setCumpleRequisitos({
          cumple: true,
          mensaje: "Cambios guardados. Ya puede realizar la evaluación",
        });
        closeMessageNotification();
      } else {
        setIsVisible(true);
        setCumpleRequisitos({
          cumple: false,
          mensaje: "No cumple con los requisitos de evaluación y no puede ser evaluado",
        });
        closeMessageNotification();
      }
    } catch (error) {
      console.log("Error al revisar la inconformidad sobre los requisitos", error);
      if (error.response) {
        setCumpleRequisitos({
          cumple: false,
          mensaje: "No cumple con los requisitos de evaluación y no puede ser evaluado",
        });
        closeMessageNotification();
      }
    }
  };

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

  if (loading || isLoading) return <Loading />;
  if (error) {
    return (
      <Alert typeAlert="error">
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <>
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
                  {/* Verificamos si existe la propiedad nodo que posee el valor (string) del documento para acceder a el.
                    Si existe mostraremos el boton para poder visualizar el documento */}
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
              <div className={styles.buttonCheckTodos}>
                <button type="button" onClick={handleClickMarcarTodos}>
                  [Marcar Todos]
                </button>
              </div>

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
                    onChange={() => setValue("esConcursante", true)}
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
                    onChange={() => setValue("esConcursante", false)}
                    checked={esConcursante === false}
                  />
                </div>
              </div>

              <>
                <div className={styles.textarea}>
                  <label htmlFor="razones">Razones:</label>
                  <textarea
                    name="razones"
                    id="razones"
                    rows={4}
                    className={styles.textarea}
                    {...register("razones")} // preguntar el minimo de caracteres
                  ></textarea>
                </div>

                {/*<div className={styles.inputsRadio}>
                  <div className={styles.containerInputRadio}>
                    <label htmlFor='ratifica'>Ratifica</label>
                    <input
                      type='radio'
                      name='ratifica'
                      id='ratifica'
                      className='inpt_radio_green'
                      value={'1'}
                      {...register('ratificaModifica')}
                      onChange={() => setValue("ratificaModifica", '1')}
                    />
                  </div>
                  <div className={styles.containerInputRadio}>
                    <label htmlFor='modifica'>Modifica</label>
                    <input
                      type='radio'
                      name='modifica'
                      id='modifica'
                      className='inpt_radio_green'
                      value={'0'}
                      {...register('ratificaModifica')}
                      onChange={() => setValue("ratificaModifica", '0')}
                    />
                  </div>
                </div>

                <div className={styles.textarea}>
                  <label htmlFor='razones'>Razones:</label>
                  <textarea
                    name="razones"
                    id="razones"
                    rows={4}
                    className={styles.textarea}
                    {...register('respuestaInconformidad')}
                  ></textarea>
                </div>*/}
              </>

              {/* {esConcursante === false && (
                <>
                  <div className={styles.textarea}>
                    <label htmlFor='razones'>Razones:</label>
                    <textarea
                      name="razones"
                      id="razones"
                      rows={4}
                      className={styles.textarea}
                      {...register('razones', { minLength: 10 })} // preguntar el minimo de caracteres
                    ></textarea>
                  </div>

                  <div className={styles.inputsRadio}>
                    <div className={styles.containerInputRadio}>
                      <label htmlFor='ratifica'>Ratifica</label>
                      <input
                        type='radio'
                        name='ratifica'
                        id='ratifica'
                        className='inpt_radio_green'
                        value={'ratifica'}
                        {...register('ratificaModifica')}
                        onChange={() => setValue("ratificaModifica", 'ratifica')}
                        checked={ratificaModifica === 'ratifica'}
                      />
                    </div>
                    <div className={styles.containerInputRadio}>
                      <label htmlFor='modifica'>Modifica</label>
                      <input
                        type='radio'
                        name='modifica'
                        id='modifica'
                        className='inpt_radio_green'
                        value={'modifica'}
                        {...register('ratificaModifica')}
                        onChange={() => setValue("ratificaModifica", 'modifica')}
                        checked={ratificaModifica === 'modifica'}
                      />
                    </div>
                  </div>

                  <div className={styles.textarea}>
                    <label htmlFor='razones'>Razones:</label>
                    <textarea
                      name="razones"
                      id="razones"
                      rows={4}
                      className={styles.textarea}
                      {...register('respuestaInconformidad')}
                    ></textarea>
                  </div>

                </>
              )} */}

              {cumpleRequisitos && isVisible && (
                <Alert typeAlert={cumpleRequisitos.cumple ? "success" : "error"}>
                  <p id="yo">{cumpleRequisitos.mensaje}</p>
                </Alert>
              )}

              {errors.requisitos && (
                <Alert typeAlert={"warning"}>
                  <p>Debe seleccionar al menos un requisito</p>
                </Alert>
              )}

              {errors.esConcursante && (
                <Alert typeAlert={"error"}>
                  <p>Debe seleccionar al menos un requisito e indicar si es o no concursante</p>
                </Alert>
              )}

              <div className={styles.containerSubmit}>
                <button type="submit" className={`texto_con_icono ${styles.buttonSubmit}`}>
                  Guardar {""}
                  <FontAwesomeIcon icon={faSave} color={"cyan"} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RequisitosInconformidadPage;
