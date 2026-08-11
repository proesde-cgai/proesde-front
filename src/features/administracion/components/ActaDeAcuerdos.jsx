import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/ActaDeAcuerdos.module.css"
import useStoredFecha from "../../useStoredFecha";

export const ActaDeAcuerdosComponent = () => {
  // Referencias para todos los inputs y textarea
  const inputRefs = {
    acta: useRef(),
    hora: useRef(),
    mes: useRef(),
    anio: useRef(),
    lugar: useRef(),
    razon: useRef(),
    finHora: useRef(),
    textarea: useRef(),
  };

  const fecha = useStoredFecha();
  const displayDate = fecha?.rangoFecha || "2024-2025";   

  const miembros = [
    {
      nombre: "Jaime Valenzuela",
      dependencia: "UDG",
    },
    {
      nombre: "David",
      dependencia: "UDG1",
    },
    {
      nombre: "Carlos",
      dependencia: "UDG2",
    },
    {
      nombre: "Victor",
      dependencia: "UDG3",
    },
  ];

  const [error, setError] = useState(""); // Estado para manejar el mensaje de error

  // Función para validar los campos del formulario
  const validateFields = () => {
    let hasError = false;
    Object.values(inputRefs).forEach((ref) => {
      if (!ref.current.value) {
        hasError = true;
      }
    });
    return hasError;
  };

  // Función para recopilar y mostrar la información del formulario
  const handlePrintInfo = (event) => {
    event.preventDefault();
    const hasError = validateFields();
    if (hasError) {
      setError("Todos los campos son obligatorios."); // Mensaje general de error
    } else {
      setError(""); // Limpiar el error si no hay problemas
      const formData = {
        acta: inputRefs.acta.current.value,
        hora: inputRefs.hora.current.value,
        mes: inputRefs.mes.current.value,
        anio: inputRefs.anio.current.value,
        lugar: inputRefs.lugar.current.value,
        razon: inputRefs.razon.current.value,
        finHora: inputRefs.finHora.current.value,
        comentarios: inputRefs.textarea.current.value,
        miembros: miembros.map((miembro) => ({
          nombre: miembro.nombre,
          dependencia: miembro.dependencia,
        })),
      };

      console.log("Información del formulario:", formData);
      alert("Formulario enviado correctamente");
    }
  };

  // Limpiar formulario
  const handleCancel = () => {
    Object.values(inputRefs).forEach((ref) => {
      ref.current.value = ""; // Limpiar los campos del formulario
    });
    setError(""); // Limpiar el mensaje de error
  };

  // Efecto para limpiar los errores después de 3 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Limpiar el mensaje de error después de 3 segundos
      }, 3000);
      return () => clearTimeout(timer); // Limpiar el timeout si el componente se desmonta
    }
  }, [error]);

  return (
    <>
      <form className={styles.form_container} onSubmit={(e) => e.preventDefault()}>
        <p>
          <input type="text" defaultValue={"1a."} ref={inputRefs.acta} /> ACTA
          DE COMISIÓN ESPECIAL DICTAMINADORA. ADMINISTRACION GENERAL. <br />
          Siendo las{" "}
          <input type="text" defaultValue={"12:00"} ref={inputRefs.hora} /> de{" "}
          <input type="text" defaultValue={"Septiembre"} ref={inputRefs.mes} />{" "}
          de <input type="text" defaultValue={"2024"} ref={inputRefs.anio} /> en
          la{" "}
          <input
            type="text"
            defaultValue={"Sala de juntas"}
            ref={inputRefs.lugar}
          />
          ,<br />
          Administración general, se reunieron los miembros de la Comisión
          Especial Dictaminadora de Administración General <br />
          del Programa de Estímulos al Desempeño Docente Promoción {displayDate},
          con la finalidad de{" "}
          <input type="text" placeholder="Escriba la razón" ref={inputRefs.razon} />{" "}
          <br />
          Los miembros de la comisión son:
          <br />
          {miembros.map((miembro) => (
            <React.Fragment key={miembro.nombre}>
              <strong>{miembro.nombre} </strong> - {miembro.dependencia}
              <br />
            </React.Fragment>
          ))}
        </p>

        <textarea ref={inputRefs.textarea} placeholder="Comentarios adicionales"></textarea>
        <p>
          La reunión se dio por terminada a las{" "}
          <input type="text" defaultValue={"12:00"} ref={inputRefs.finHora} />{" "}
          hrs. del presente
        </p>

        {error && <p className={styles.error}>{error}</p>} {/* Mostrar mensaje de error general */}

        <button type="button" onClick={handlePrintInfo}>
          Enviar
        </button>
        <button type="button" onClick={handleCancel}>
          Limpiar
        </button>
      </form>
    </>
  );
};
