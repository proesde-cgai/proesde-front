import React from 'react'
import api from '../../../../hooks/api';

const useFetchUpdateOficio = () => {
    const updateOficio = async (data) => {
        try {
            const body = {
                idQr: data.idQr,
                nombreProfesor: data.nombreProfesor,
                codigoProfesor: data.codigoProfesor,
                noOficio: data.noOficio,
                cicloEscolar: data.cicloEscolar,
                ubicacion: data.ubicacion,
                nombreJefe: data.nombreJefe,
                cargoJefe: data.cargoJefe,
                codigoEmpleado: data.codigoEmpleado,
                correoProfesor: data.correoProfesor,
                materia: data.materia,
            }
            console.log(body);
            const response = await api.post('/api/v1/jefe_depto/reporte/editar-oficio-evaluacion-estudiante', body);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
  return { updateOficio, };
}

export default useFetchUpdateOficio
