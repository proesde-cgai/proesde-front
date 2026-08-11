import React from 'react'
import api from '../../../../hooks/api';
import { updateMunicipiosEvaluacionDocente } from '../service/updateMunicipios';

const useUpdateMunicipio = (municipios, listaProfesores, setListaProfesores, ) => {
    const handleMunicipioChange = async (data) => {
        try {
            const response = await updateMunicipiosEvaluacionDocente({
                codigoEmpleado: data.codigoEmpleado,
                cicloEscolar: data.cicloEscolar,
                page: data.page,
                app: "PruebasSpertoDigital",
                idMunicipio: data.idMunicipio,
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const aplicarMunicipioATodos = (municipio) => {
        console.log("setListaProfesores segundo " )
        if(municipio) {
            console.log('From useHooks')
            console.log(municipio)
            const updateProfesores = listaProfesores.map((profesor) => ({
                ...profesor,
                ubicacion: municipio,
                statusMunicipio: "0",
            }));
            setListaProfesores(updateProfesores);
        }
    }
  return { handleMunicipioChange, aplicarMunicipioATodos, };
}

export default useUpdateMunicipio
