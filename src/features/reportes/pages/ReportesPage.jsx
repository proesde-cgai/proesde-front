import ReporteActaAcuerdos from "../components/ReporteActaAcuerdos";
import styles from "./ReportesPage.module.css";

export const ReportesPage = () => {
  return (
    <div className={styles.reports_container}>
      <ReporteActaAcuerdos/>
    </div>
  );
};
