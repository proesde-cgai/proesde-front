import { ESTATUS } from "../models";
import Spinn from "./Spinn";

const ShowButton = ({ validStatus, downloadPDF, statusResponse, styles, active }) => {
  if (validStatus(ESTATUS.APROBADO)) {
    return (
      <button
        onClick={downloadPDF}
        type="button"
        className={styles.btnDownload}
        disabled={!validStatus(ESTATUS.APROBADO) || statusResponse.isLoading}
      >
        {statusResponse.isLoading ? <Spinn /> : "Descargar"}
      </button>
    );
  }

  return (
    <button
      className={`${styles.btn} ${
        active || validStatus(ESTATUS.PENDIENTE_REVISION) || statusResponse.isLoading
          ? styles.btnDisabled
          : ""
      }`}
      type="submit"
      disabled={active || validStatus(ESTATUS.PENDIENTE_REVISION) || statusResponse.isLoading}
    >
      {statusResponse.isLoading ? <Spinn /> : "Enviar"}

    </button >
  )
};

export default ShowButton;
