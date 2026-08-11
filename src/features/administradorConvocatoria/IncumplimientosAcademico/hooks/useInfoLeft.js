import { useEffect, useState } from "react";
import { initialResponseState } from "../data";
import { getInfoAcademicoService } from "../services/getInfoAcademico";
import { useIncumplimientoContext } from "./useIncumplimientoContext";
import {
  breachesResponseAdapter,
  infoAcademicResponseAdapter,
} from "../adapters/academicAdapter";
import { getConditionsService } from "../services/getConditions";
import { conditionResponseAdapter } from "../adapters/conditionAdapter";

export const useInfoLeft = () => {
  const [codeAcademico, setCodeAcademico] = useState("");
  const { data, setAcademic, setResponse, setBreaches, setConditions } =
    useIncumplimientoContext();

  const onChange = (e) => {
    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
    setCodeAcademico(onlyNumber);
  };

  const onGetInfoAcademico = async (e) => {
    setAcademic(null);
    e.preventDefault();
    setResponse({ ...data.serviceResponse, loading: true });
    try {
      const res = await getInfoAcademicoService(codeAcademico);
      const dataAdapted = infoAcademicResponseAdapter(res);
      const breachesAdapted = breachesResponseAdapter(res);

      setBreaches(breachesAdapted);
      setAcademic(dataAdapted);
      setResponse(initialResponseState);
    } catch (error) {
      setResponse({ loading: false, error: true, message: error.message });
    } finally {
      setTimeout(() => {
        setResponse(initialResponseState);
      }, 2000);
    }
  };

  const onGetListConditions = async () => {
    try {
      const response = await getConditionsService();
      const conditionsAdapted = conditionResponseAdapter(response);
      setConditions(conditionsAdapted);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onGetListConditions();
    // eslint-disable-next-line
  }, []);

  return {
    // properties
    codeAcademico,
    ...data,
    // methods
    onChange,
    onGetInfoAcademico,
  };
};
