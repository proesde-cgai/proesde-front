import React from 'react'
import api from '../../../../hooks/api';

const useFetchAltaOficio = () => {

    const altaOficioProfesor = async (body) => {
        try {
            console.log("body para acta");
            console.log(body);
            const response = await api.post('/api/v1/jefe_depto/reporte/alta-oficio-evaluacion-estudiante', body);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
  return { altaOficioProfesor, };
}

export default useFetchAltaOficio
