import { FormCodeAcademic } from "../../../components/FormCodeAcademic";
import { useInfoLeft } from "../../hooks/useInfoLeft";

const InfoLeft = () => {
  const {
    serviceResponse,
    codeAcademico,
    onChange,
    onGetInfoAcademico
  } = useInfoLeft();

  return (
    <FormCodeAcademic
      actionForm={onGetInfoAcademico}
      changeCode={onChange}
      value={codeAcademico}
      loading={serviceResponse.loading}
      message={serviceResponse.message}
      error={serviceResponse.error}
    />
  );
};

export default InfoLeft;
