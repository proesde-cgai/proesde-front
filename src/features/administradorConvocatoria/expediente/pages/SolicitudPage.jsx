import React, { useEffect, useState } from "react";
import Alert from "../../../../reutilizable/Alert";
import ViewerPDF from "../../../../reutilizable/ViewerPDF";
import { tiposDocumentos } from "../services";
import { useEvaluationStore } from "../../../../store/useEvaluationStore";
import { ERROR_MESSAGES_GENERICS_API } from "../../../../utils/messagesFromAPI";
import styles from "../styles/SolicitudPage.module.css";

const SolicitudPage = () => {
  const { selectedDataAcademico } = useEvaluationStore();
  console.log(selectedDataAcademico);

  const [urlPdfSolicitud, setuUrlPdfSolicitud] = useState(null);
  const [mensajeAlerta, setMensajeAlerta] = useState({
    tipo: null,
    mensaje: null,
  });
  const [tipoDocumento, setTipoDocumento] = useState({
    id: null,
    mandatorio: true,
    nombre: "",
    orden: null,
    sigla: "A",
    idConvocatoria: null,
  });



  useEffect(() => {
    setMensajeAlerta(null);
    const arregloArchivos = selectedDataAcademico?.archivos;
    // La sigla hace referencia al tipo de archivo que es
    const result = arregloArchivos?.find((item) => item.sigla === "A");

    if (!result) {
      setMensajeAlerta({
        tipo: "warning",
        mensaje: "No se ha encontrado el archivo de solicitud",
      });
      return;
    }

    setuUrlPdfSolicitud(result);
    // eslint-disable-next-line
  }, [selectedDataAcademico, tipoDocumento.sigla]);

  if (mensajeAlerta) {
    return (
      <Alert typeAlert={mensajeAlerta.tipo}>
        <p>{mensajeAlerta.mensaje}</p>
      </Alert>
    );
  }

  return (
    <div className={styles.containerPdf}>
      <ViewerPDF urlPdf={urlPdfSolicitud?.nodoId} />
    </div>
  );
};

export default SolicitudPage;
