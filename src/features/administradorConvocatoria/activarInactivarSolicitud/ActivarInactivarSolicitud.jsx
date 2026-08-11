import { ContainerLayout } from "../../layout/ContainerLayout";
import { FormCodeAcademic } from "../components/FormCodeAcademic";
import { TitlePage } from "../components/TitlePage";
import RightInformation from "./components/RightInformation";
import TextStatus from "./components/TextStatus";
import TextSuggestion from "./components/TextSuggestion";
import { useActivarInactivarSolicitud } from "./hooks/useActivarInactivarSolicitud";
import styles from "./styles/ActivarInactivarSolicitud.module.css";

const ActivarInactivaSolicitud = () => {
  const {
    handleBuscarSolicitud,
    handleGuardarSolicitud,
    codigo,
    estado,
    error,
    message,
    dataAcademic,
    onChange,
    loading
  } = useActivarInactivarSolicitud();

  return (
    <div className={styles.container}>
      <TitlePage title='Activar o Inactivar solicitudes' />
      <ContainerLayout>
        <FormCodeAcademic
          actionForm={handleBuscarSolicitud}
          changeCode={onChange}
          value={codigo}
          loading={loading}
          message={message}
          error={error}
        />

        <div className={styles.listaContainer}>
          <TextStatus message={message} styles={styles} error={error} />
          <RightInformation
            dataAcademic={dataAcademic}
            estado={estado}
            handleGuardarSolicitud={handleGuardarSolicitud}
            onChange={onChange}
            loading={loading}
            styles={styles}
          />
          <TextSuggestion styles={styles} dataAcademic={dataAcademic} />
        </div>
      </ContainerLayout>
    </div>
  );
};

export default ActivarInactivaSolicitud;
