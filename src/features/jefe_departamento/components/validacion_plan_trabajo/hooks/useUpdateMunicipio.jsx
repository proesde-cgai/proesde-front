import { useState, useEffect } from "react";
import { actualizarMunicipioPlanTrabajo } from "../services/updateMunicipio";
import useChangeMunicipio from "../../../hooks/useChangeMunicipio";

const useUpdateMunicipio = (
  municipios,
  selectedCiclo,
  filteredPlanTrabajos,
  setFilteredPlanTrabajos,
  userInfo,
  setSelectedMunicipio
) => {
  const { saveMunicipio, getMunicipioJefe } = useChangeMunicipio();
  const [municipioError, setMunicipioError] = useState(null);

  const handleMunicipioChange = async (newMunicipio) => {
    if (newMunicipio) {
      aplicarMunicipioATodas(newMunicipio);
      try {
        await actualizarMunicipioPlanTrabajo({
          jefeDepto: userInfo,
          cicloEscolar: selectedCiclo,
          idMunicipio: newMunicipio,
        });
        await saveMunicipio({
          usuario: userInfo,
          id_etapa_jefe: "5", //validacion de plan de trabajo
          id_municipio: newMunicipio,
        });
      } catch (error) {
        console.error("Error al actualizar el municipio de plan de trabajo", error);
        setMunicipioError(error);
      }
    }
  };

  const getMunicipioSaved = async (materias, municipiosLista) => {
    try {
      const response = await getMunicipioJefe(userInfo, "5");
      console.log("Respuesta de getMunicipioJefe:", response);
      console.log("Materias recibidas:", materias);
      console.log(municipios);
      console.log(municipiosLista);

      if (response && municipiosLista && municipiosLista.length > 0) {
        const municipioId = parseInt(response.id_municipio);
        const municipioGuardado = municipiosLista.find((m) => m.id === municipioId);

        if (municipioGuardado) {
          console.log("Municipio encontrado:", municipioGuardado);
          setSelectedMunicipio(municipioGuardado.id);
          aplicarMunicipioATodas(municipioGuardado.municipio, materias);
        } else {
          console.warn("Municipio no encontrado en la lista, asignando vacío.");
          setSelectedMunicipio(""); // Evitar estado indefinido
        }
      } else {
        console.warn("No se encontró un municipio guardado.");
        setSelectedMunicipio(""); // Evitar estado indefinido
        setFilteredPlanTrabajos(materias);
      }
    } catch (error) {
      console.error("Error al obtener el municipio guardado:", error);
      setMunicipioError(error);
    }
  };

  const aplicarMunicipioATodas = (municipio, materias) => {
    try {
      if (municipio && !materias) {
        console.log(municipio);
        const newMunicipio = municipios.find((m) => m.id === parseInt(municipio));
        const updatedMaterias = filteredPlanTrabajos.map((materia) => ({
          ...materia,
          ubicacion: newMunicipio.municipio,
          municipio: "1",
          pdf: "0",
        }));
        console.log(updatedMaterias);
        setFilteredPlanTrabajos(updatedMaterias);
      } else {
        const newMunicipio = municipios.find((m) => m.municipio === municipio);
        console.log(newMunicipio);
        const updatedMaterias = materias.map((materia) => ({
          ...materia,
          ubicacion: newMunicipio.municipio,
        }));
        console.log(updatedMaterias);
        setSelectedMunicipio(newMunicipio.id);
        setFilteredPlanTrabajos(updatedMaterias);
        console.log(newMunicipio.id);
      }
    } catch (error) {
      console.error("Error al aplicar el municipio a todas las materias", error);
    }
  };

  return { handleMunicipioChange, municipioError, getMunicipioSaved };
};

export default useUpdateMunicipio;
