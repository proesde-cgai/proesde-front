import { useState, useEffect } from "react";
import { actualizarMunicipioCargaHoraria } from "../services/updateMunicipio";
import useChangeMunicipio from "../../../hooks/useChangeMunicipio";

const useUpdateMunicipio = (
  municipios,
  selectedCiclo,
  filteredMaterias,
  setFilteredMaterias,
  userInfo,
  setSelectedMunicipio
) => {
  const [municipioError, setMunicipioError] = useState(null);
  const { getMunicipioJefe, saveMunicipio } = useChangeMunicipio();

  const handleMunicipioChange = async (newMunicipio) => {
    if (newMunicipio) {
      aplicarMunicipioATodas(newMunicipio);
      try {
        await actualizarMunicipioCargaHoraria({
          codigoEmpleado: userInfo,
          cicloEscolar: selectedCiclo,
          app: "Prueba",
          idMunicipio: municipios.find((municipio) => municipio.id.toString() === newMunicipio.toString())?.id || "",
        });
        await saveMunicipio({
          usuario: userInfo,
          id_etapa_jefe: "3", //carga horaria
          id_municipio: newMunicipio,
        });
        console.log("Municipio de la carga horaria actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar el municipio de la carga horaria:", error);
        setMunicipioError(error);
      }
    }
  };

  const aplicarMunicipioATodas = (municipio, materias) => {
    if (municipio && !materias) {
      console.log(municipio);
      const newMunicipio = municipios.find((m) => m.id === parseInt(municipio));
      const updatedMaterias = filteredMaterias.map((materia) => ({
        ...materia,
        ubicacion: newMunicipio.municipio,
        statusMunicipio: "0",
      }));
      console.log(updatedMaterias);
      setFilteredMaterias(updatedMaterias);
    } else {
      const newMunicipio = municipios.find((m) => m.municipio === municipio);
      console.log(newMunicipio);
      const updatedMaterias = materias.map((materia) => ({
        ...materia,
        ubicacion: newMunicipio.municipio,
        statusMunicipio: materia.noOficio ? materia.statusMunicipio : "0",
      }));
      console.log(updatedMaterias);
      setFilteredMaterias(updatedMaterias);
      setSelectedMunicipio(municipios.find((m) => m.municipio === municipio)?.id || "");
      console.log(municipios.find((m) => m.municipio === municipio)?.id);
    }
  };

  const getMunicipioSaved = async (materias) => {
    try {
      const response = await getMunicipioJefe(userInfo, "5");
      console.log(response);
      console.log(materias);
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

  return { handleMunicipioChange, municipioError, getMunicipioSaved };
};

export default useUpdateMunicipio;
