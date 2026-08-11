import React, { useState } from "react";
import { Footer, Header } from "../../layout/components";
import { Menu, MenuOption, useMenu } from "../../../reutilizable/Menu";
import { Evaluar } from "../../administracion/components/Evaluar";
import { InconformidadPage } from "../../inconformidad";
import { ActivarInactivarSolicitud } from "../../administracion/components/ActivarInactivarSolicitud";

import styles from "./ReimprimirSolicitud.module.css";
import useSendCode from "../hook/useSendCode";

const ReimprimirSolicitud = () => {
  const [selectedCommission, setSelectedCommission] = useState("ADMGRAL");
  const [members, setMembers] = useState([
    {
      cargo: "Presidente",
      trato: "DRA.",
      nombre: "ELBA PATRICIA ALATORRE ROJO",
      codigo: "9018077",
      departamento: "ADMGRAL",
    },
    {
      cargo: "Secretario",
      trato: "MTRA.",
      nombre: "KATIA ARIADNA MORALES VEGA",
      codigo: "8908236",
      departamento: "ADMGRAL",
    },
    {
      cargo: "Vocal",
      trato: "DRA.",
      nombre: "ILCE VALERIA ROMAN FERNANDEZ",
      codigo: "2963356",
      departamento: "ADMGRAL",
    },
    {
      cargo: "Vocal",
      trato: "DR.",
      nombre: "ROGELIO MARTINEZ CARDENAS",
      codigo: "8915741",
      departamento: "ADMGRAL",
    },
  ]);

  const handleCommissionChange = (event) => {
    setSelectedCommission(event.target.value);
  };

  const handleCargoChange = (index, newCargo) => {
    const updatedMembers = [...members];
    updatedMembers[index].cargo = newCargo;
    setMembers(updatedMembers);
  };
  const menu = useMenu(
    [
      {
        label: "Pagina Principañ",
        element: (
          <>
            <p>Pagina principal</p>,
          </>
        ),
      },
      {
        label: "Programas",
        element: <p>Programas</p>,
      },
      {
        label: "Inconformidad",
        element: <InconformidadPage />,
      },
      {
        label: "Evaluación",
        element: <Evaluar />,
      },
      {
        label: "Reportes",
        element: <p>Reportes</p>,
      },
      {
        label: "Activar / Inactivar solicitud",
        element: <ActivarInactivarSolicitud />,
      },
      {
        label: "Generar inconformidad",
        element: <p>Generar inconformidad</p>,
      },
      {
        label: "Administración",
        element: <p>Administracion</p>,
      },
    ],
    {
      selectedValue: "Desempeño docente",
      isVertical: false,
    }
  );

  const [codigo, setCodigo] = useState("");
  const [convocatoriaActual, setConvocatoriaActual] = useState("");
  const { sendCode, responseMessage, loading, error } = useSendCode();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendCode(convocatoriaActual, codigo);
  };

  return (
    <div>
      <Header />
      <Menu menu={menu} />
      <div className={styles.container}>
        <div className={styles.codeSection}>
          <div className={styles.labelWrapper}>
            <span className={styles.redDots}>••••</span>
            <label  className={styles.label}>
              Convocatoria:
            </label>
          </div>
          <input
            type="text"
            id="convocatoria"
            className={styles.input}
            value={convocatoriaActual}
            onChange={(e) => setConvocatoriaActual(e.target.value)}
          />
          <div className={styles.labelWrapper}>
            <span className={styles.redDots}>••••</span>
            <label className={styles.label}>
              Código:
            </label>
          </div>
          <input
            type="text"
            id="codigo"
            className={styles.input}
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <button
            className={styles.btn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {" "}
            {loading ? "Enviando..." : "Continuar"}
          </button>
          {error && <p className={styles.error}>{error}</p>}{" "}
          {responseMessage && <p>{responseMessage}</p>}{" "}
        </div>
        <div className={styles.divider}></div>

        <div className={styles.messageSection}>
          <p className={styles.errorMessage}>Revise el código del académico.</p>
          <p className={styles.instructionMessage}>
            Introduzca el código del académico y oprima el botón "Continuar".
          </p>
        </div>
        <div className={styles.cgaiText}>CGAI 1 .</div>
      </div>

      <Footer />
    </div>
  );
};

export default ReimprimirSolicitud;
