import React from 'react'
import api from './api';

const useFetchResultadoEvaluacionGenerarPDF = () => {
    const evaluacionResultadoGeneratePdf = async (data) => {
        try {
            const body = {
                ids: ["2963081"] // Datos de prueba;
            };
            const response = await api.post("localhost:8081/api/v1/reportes/generar_reporte_evaluacion", body);
            return response;
        } catch (error) {
            console.log(error);
        }
        console.log(data);
    }
  return { evaluacionResultadoGeneratePdf, }
}

export default useFetchResultadoEvaluacionGenerarPDF
