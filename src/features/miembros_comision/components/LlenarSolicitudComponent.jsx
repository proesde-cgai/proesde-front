import React, { useState, useEffect } from "react";
import styles from "./llenarSolicitudPage.module.css";

export const LlenarSolicitudComponent = () => {
  const initialState = {
    codigo: "",
    CURP: "",
    entidad: "",
    nombre: "",
    correo: "",
    apellidoP: "",
    telefono: "",
    apellidoM: "",
    telefonoMovil: "",
    rfc: "",
    nacionalidad: "",
    ultimogrado: "",
    areaconocimiento: "",
    nombregradoacademico: "",
    institutoegreso: "",
    nombramiento: "",
    departamento: "",
    horasfrenteagrupo: "",
    nombredirector: "",
    niveleducativo: "",
    dependencia: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Validar campos
  const validateFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "Este campo es obligatorio";
      }
    });
    return newErrors;
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Formulario enviado con los siguientes datos:", formData);
      alert("Formulario enviado correctamente");
    }
  };

  // Limpiar formulario
  const handleCancel = () => {
    setFormData(initialState);
    setErrors({});
  };

  // Efecto para limpiar los errores después de 3 segundos
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setErrors({});
      }, 3000);
      return () => clearTimeout(timer); // Limpiar el timeout si el componente se desmonta
    }
  }, [errors]);

  return (
    <>
      <div className={styles.solicitudContainer}>
        <div className={styles.container}>
          <details className={styles.details_container}>
            <summary>Instrucciones</summary>
            <p className={styles.bold}>
              <span className={styles.important}>
                Recomendaciones generales
              </span>{" "}
              para el correcto llenado de una solicitud:
            </p>
            <p className={styles.bold}>
              Por favor tenga primero su plan de trabajo ya redactado (Docencia,
              Generación y/o aplicación del conocimiento, Gestión Académica
              individual y/o colectiva, y Vinculación, Difusión y Extensión de
              la Ciencia y la Cultura) en un editor de texto, y luego cópielo
              dentro de la solicitud.
            </p>

            <p className={styles.important}>Llenado de la solicitud</p>
            <ul className={styles.list}>
              <li>
                Llenar todos los campos del formulario, utilizando mayúsculas y
                minúsculas, sin emplear abreviaturas.
              </li>
              <li>
                Los datos podrán ser actualizados mediante la opción
                "Modificar".
              </li>
              <li>
                Utilizar la opción "Guardar", la sesión se cierra
                automáticamente si no hay actividad en 20 minutos, por lo que le
                aconsejamos guardar sus datos si no va a estar presente.
              </li>
              <li>
                Elaborar el plan de trabajo en un editor de texto para
                posteriormente copiar en los apartados correspondientes dentro
                de la solicitud.
              </li>
              <li>
                Sólo poner valores numéricos en los campos "Horas frente a
                grupo", "Antigüedad", "Teléfono", "Ext." y "Teléfono móvil". No
                utilice espacios, ni guiones.
              </li>
              <li>
                En el campo de "Fecha de ingreso a la UDG" el formato de fecha
                es por año, mes y día (ejemplo: 1970-07-17) separados por guión
                medio (-).
              </li>
              <li>
                Si los datos que Ud. observa no son los más actualizados, podrá
                cambiarlos mediante la opción "Modificar".
              </li>
              <li>
                Observe que ahora se le pide información adicional relativa a su
                actividad académica, con el propósito de actualizar el
                procedimiento de los datos actuales y futuros.
              </li>
              <li>
                El sistema permite guardar y modificar su solicitud el número de
                veces que desee.
              </li>
            </ul>
          </details>
        </div>

        <div className={styles.container}>
          <h2 className={styles.solicirudTitle}>Llenar solicitud</h2>
          <p className={styles.important}>
            Revise que su información sea correcta antes de suscribir la
            solicitud.{" "}
          </p>
          <h2 className={styles.bold}>Datos personales</h2>
          <form className={styles.form} id="datosPersonalesForm">
            <div className={styles.form_data}>
              <label htmlFor="codigo">Código</label>
              <input
                id="codigo"
                type="text"
                value={formData.codigo}
                onChange={handleChange}
                className={errors.codigo ? styles.errorInput : ""}
              />
              {errors.codigo && (
                <span className={styles.error}>{errors.codigo}</span>
              )}

              <label htmlFor="CURP">CURP</label>
              <input
                id="CURP"
                type="text"
                value={formData.CURP}
                onChange={handleChange}
                className={errors.CURP ? styles.errorInput : ""}
              />
              {errors.CURP && (
                <span className={styles.error}>{errors.CURP}</span>
              )}

              <label htmlFor="entidad">Entidad Federativa</label>
              <input
                id="entidad"
                type="text"
                value={formData.entidad}
                onChange={handleChange}
                className={errors.entidad ? styles.errorInput : ""}
              />
              {errors.entidad && (
                <span className={styles.error}>{errors.entidad}</span>
              )}
            </div>
            <div className={styles.form_data}>
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? styles.errorInput : ""}
              />
              {errors.nombre && (
                <span className={styles.error}>{errors.nombre}</span>
              )}

              <label htmlFor="correo">Correo Electrónico</label>
              <input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                className={errors.correo ? styles.errorInput : ""}
              />
              {errors.correo && (
                <span className={styles.error}>{errors.correo}</span>
              )}
            </div>
            <div className={styles.form_data}>
              <label htmlFor="apellidoP">Apellido Paterno</label>
              <input
                id="apellidoP"
                type="text"
                value={formData.apellidoP}
                onChange={handleChange}
                className={errors.apellidoP ? styles.errorInput : ""}
              />
              {errors.apellidoP && (
                <span className={styles.error}>{errors.apellidoP}</span>
              )}

              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                className={errors.telefono ? styles.errorInput : ""}
              />
              {errors.telefono && (
                <span className={styles.error}>{errors.telefono}</span>
              )}
            </div>
            <div className={styles.form_data}>
              <label htmlFor="apellidoM">Apellido Materno</label>
              <input
                id="apellidoM"
                type="text"
                value={formData.apellidoM}
                onChange={handleChange}
                className={errors.apellidoM ? styles.errorInput : ""}
              />
              {errors.apellidoM && (
                <span className={styles.error}>{errors.apellidoM}</span>
              )}

              <label htmlFor="telefonoMovil">Teléfono Movil</label>
              <input
                id="telefonoMovil"
                type="tel"
                value={formData.telefonoMovil}
                onChange={handleChange}
                className={errors.telefonoMovil ? styles.errorInput : ""}
              />
              {errors.telefonoMovil && (
                <span className={styles.error}>{errors.telefonoMovil}</span>
              )}
            </div>
            <div className={styles.form_data}>
              <label htmlFor="rfc">RFC</label>
              <input
                id="rfc"
                type="text"
                value={formData.rfc}
                onChange={handleChange}
                className={errors.rfc ? styles.errorInput : ""}
              />
              {errors.rfc && <span className={styles.error}>{errors.rfc}</span>}

              <label htmlFor="nacionalidad">Nacionalidad</label>
              <input
                id="nacionalidad"
                type="tel"
                value={formData.nacionalidad}
                onChange={handleChange}
                className={errors.nacionalidad ? styles.errorInput : ""}
              />
              {errors.nacionalidad && (
                <span className={styles.error}>{errors.nacionalidad}</span>
              )}
            </div>
          </form>

          <h2 className={styles.titulo}>Información Académica</h2>
          <form className={styles.form} id="informacionAcademicaForm">
            <div className={styles.form_data}>
              <label htmlFor="ultimogrado">Último grado de estudios </label>
              <input
                id="ultimogrado"
                type="text"
                value={formData.ultimogrado}
                onChange={handleChange}
                className={errors.ultimogrado ? styles.errorInput : ""}
              />
              {errors.ultimogrado && (
                <span className={styles.error}>{errors.ultimogrado}</span>
              )}
            </div>
            <div className={styles.form_data}>
              <label htmlFor="nombregradoacademico">
                Nombre del último grado de estudios
              </label>
              <input
                id="nombregradoacademico"
                type="text"
                value={formData.nombregradoacademico}
                onChange={handleChange}
                className={errors.nombregradoacademico ? styles.errorInput : ""}
              />
              {errors.nombregradoacademico && (
                <span className={styles.error}>
                  {errors.nombregradoacademico}
                </span>
              )}
            </div>
            <div className={styles.form_data}>
              <label htmlFor="areaconocimiento">Área de conocimiento conforme al PRODEP </label>
              <input
                id="areaconocimiento"
                type="text"
                value={formData.areaconocimiento}
                onChange={handleChange}
                className={errors.areaconocimiento ? styles.errorInput : ""}
              />
              {errors.areaconocimiento && (
                <span className={styles.error}>{errors.areaconocimiento}</span>
              )}
            </div>
            <div className={styles.form_data}>
              <label htmlFor="institutoegreso">Institución de egreso</label>
              <input
                id="institutoegreso"
                type="text"
                value={formData.institutoegreso}
                onChange={handleChange}
                className={errors.institutoegreso ? styles.errorInput : ""}
              />
              {errors.institutoegreso && (
                <span className={styles.error}>{errors.institutoegreso}</span>
              )}
            </div>
          </form>

          <h2 className={styles.bold}>Información Laboral</h2>
          <form className={styles.form} id="informacionLaboralForm">
            <div className={styles.form_data}>
              <label htmlFor="nombramiento">Nombramiento</label>
              <input
                id="nombramiento"
                type="text"
                value={formData.nombramiento}
                onChange={handleChange}
                className={errors.nombramiento ? styles.errorInput : ""}
              />
              {errors.nombramiento && (
                <span className={styles.error}>{errors.nombramiento}</span>
              )}

              <label htmlFor="departamento">Departamento</label>
              <input
                id="departamento"
                type="text"
                value={formData.departamento}
                onChange={handleChange}
                className={errors.departamento ? styles.errorInput : ""}
              />
              {errors.departamento && (
                <span className={styles.error}>{errors.departamento}</span>
              )}
            </div>
            <div className={styles.form_data}>
              <label htmlFor="horasfrenteagrupo">Horas frente a grupo</label>
              <input
                id="horasfrenteagrupo"
                type="text"
                value={formData.horasfrenteagrupo}
                onChange={handleChange}
                className={errors.horasfrenteagrupo ? styles.errorInput : ""}
              />
              {errors.horasfrenteagrupo && (
                <span className={styles.error}>{errors.horasfrenteagrupo}</span>
              )}

              <label htmlFor="nombredirector">Nombre Director</label>
              <input
                id="nombredirector"
                type="text"
                value={formData.nombredirector}
                onChange={handleChange}
                className={errors.nombredirector ? styles.errorInput : ""}
              />
              {errors.nombredirector && (
                <span className={styles.error}>{errors.nombredirector}</span>
              )}
            </div>
            <div className={styles.form_data}>
              <label htmlFor="niveleducativo">Nivel educativo</label>
              <input
                id="niveleducativo"
                type="text"
                value={formData.niveleducativo}
                onChange={handleChange}
                className={errors.niveleducativo ? styles.errorInput : ""}
              />
              {errors.niveleducativo && (
                <span className={styles.error}>{errors.niveleducativo}</span>
              )}

              <label htmlFor="dependencia">Dependencia</label>
              <input
                id="dependencia"
                type="text"
                value={formData.dependencia}
                onChange={handleChange}
                className={errors.dependencia ? styles.errorInput : ""}
              />
              {errors.dependencia && (
                <span className={styles.error}>{errors.dependencia}</span>
              )}
            </div>
          </form>
          <div className={styles.submit}>
            <button
              className={`${styles.btn} ${styles.cancelar}`}
              type="button"
              onClick={handleCancel}
            >
              Cancelar
            </button>

            <button
              className={`${styles.btn} ${styles.enviar}`}
              type="submit"
              onClick={handleSubmit}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
