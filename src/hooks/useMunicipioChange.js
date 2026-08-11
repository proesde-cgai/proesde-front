// Custom hook: useMunicipioChange.js
import { useState, useEffect } from "react";
import { actualizarMunicipioCartaDesempeno } from "../features/municipiosService";
import useChangeMunicipio from "../features/jefe_departamento/hooks/useChangeMunicipio";

const useMunicipioChange = (
  municipios,
  selectedCiclo,
  filteredMaterias,
  setFilteredMaterias,
  currentPage = 1,
  userInfo,
  setSelectedMunicipio,
  id_etapa_jefe
) => {
  const { getMunicipioJefe, saveMunicipio } = useChangeMunicipio();
  const [municipioError, setMunicipioError] = useState(null);

  const handleMunicipioChange = async (newMunicipio) => {
    console.log(newMunicipio);
    if (newMunicipio) {
      aplicarMunicipioATodas(newMunicipio);
      try {
        await actualizarMunicipioCartaDesempeno({
          codigoEmpleado: userInfo,
          cicloEscolar: selectedCiclo,
          page: 1,
          app: "PruebasSpertoDigital",
          idMunicipio: newMunicipio,
        });
        await saveMunicipio({
          usuario: userInfo,
          id_etapa_jefe,
          id_municipio: newMunicipio,
        });

        console.log("Municipio de la carta de desempeño actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar el municipio de la carta de desempeño:", error);
        setMunicipioError(error);
      }
    }
  };

  const getMunicipioSaved = async (materias) => {
    try {
      const response = await getMunicipioJefe(userInfo, id_etapa_jefe);
      console.log(response);
      if (response && municipios.length > 0) {
        const municipio = response.id_municipio;
        console.log(municipio);
        const municipioGuardado = municipios.find((m) => m.id === parseInt(municipio));
        console.log(municipioGuardado);
        aplicarMunicipioATodas(municipioGuardado.municipio, materias);
      }
    } catch (error) {
      console.error("Error al obtener el municipio guardado", error);
      setMunicipioError(error);
    }
  };

  const aplicarMunicipioATodas = (municipio, materias) => {
    if (municipio && !materias) {
      const newMunicipio = municipios.find((m) => m.id === municipio);
      console.log(newMunicipio);
      const updatedMaterias = filteredMaterias.map((materia) => ({
        ...materia,
        ubicacion: newMunicipio.municipio,
        statusMunicipio: "0",
      }));
      console.log(updatedMaterias);
      setFilteredMaterias(updatedMaterias);
    } else {
      console.log(municipio)
      const updatedMaterias = materias.map((materia) => ({
        ...materia,
        ubicacion: municipio,
      }));
      console.log(updatedMaterias);
      setFilteredMaterias(updatedMaterias);
      setSelectedMunicipio(municipios.find((m) => m.municipio === municipio)?.id || "");
    }
  };

  return { handleMunicipioChange, municipioError, getMunicipioSaved };
};

export default useMunicipioChange;
