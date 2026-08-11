import { useState, usee } from "react";
import { getMunicipiosJefeDepto, saveChangeMunicipio } from "../jefeDeptoService";

function useChangeMunicipio() {
  const [lastestMunicipio, setLastestMunicipio] = useState([]);
  const getMunicipioJefe = async (usuario, id_etapa_jefe) => {
    try {
      const response = await getMunicipiosJefeDepto(usuario, id_etapa_jefe);
      return response;
    } catch (error) {
      console.error("Error al obtener los municipios del jefe de departamento", error);
    }
  };

  const saveMunicipio = async (payload) => {
    try {
      const response = await saveChangeMunicipio(payload);
      return response;
    } catch (error) {
      console.error("Error al guardar el cambio de municipio", error);
    }
  };

  return { getMunicipioJefe, saveMunicipio, lastestMunicipio, setLastestMunicipio };
}

export default useChangeMunicipio;
