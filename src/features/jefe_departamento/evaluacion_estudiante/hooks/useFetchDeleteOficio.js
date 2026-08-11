import React from 'react'
import api from '../../../../hooks/api';

function useFetchDeleteOficio() {

    const deleteOficioByIdQr = async (body) => {
        try {
            console.log(body);
            const response = await api.post("/api/v1/jefe_depto/reporte/eliminar-oficio-evaluacion-estudiante", {idQr: body});
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
  return { deleteOficioByIdQr, };
}

export default useFetchDeleteOficio
