import { useEffect, useState } from "react";
import { useResultadoEvaluacionStore } from "../../../store/useResultadoEvaluacionStore";
import api from "../../../hooks/api";

const API_URL_SELECCIONE = `/api/v1/dependencia/admingral`;

export const useSelect = () => {
  const [isVisibleOptions, setIsVisibleOptions] = useState(false);
  const [dependencias, setDependencias] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const { selectOptionFilteredList } = useResultadoEvaluacionStore();

  // ?Method to get dependencies
  const onGetDependencias = async () => {
    try {
      const { data } = await api.get(API_URL_SELECCIONE);
      setDependencias(data.dependenciasADMINGRAL);
    } catch (error) {
      console.error("Error al obtener dependencias: ", error);
    }
  };

  useEffect(() => {
    (async () => await onGetDependencias())();
  }, []);

  const handleSelectClick = (disabled) => {
    if (!disabled) {
      setIsVisibleOptions(!isVisibleOptions);
    }
  };

  const handleOptionClick = async (option) => {
    setSelectedOption(option.dependencia);
    setIsVisibleOptions(false);
    await selectOptionFilteredList(option);
  };

  const handleChangeVisibleOption = () => {
    setIsVisibleOptions(false);
  };

  return {
    //* properties
    isVisibleOptions,
    dependencias,
    selectedOption,
    //* methods
    handleSelectClick,
    handleOptionClick,
    handleChangeVisibleOption,
  };
};
