import api from '../../../../hooks/api';

    export const updateMunicipiosEvaluacionDocente = async (body) => {
        try {
            console.log('From Service 33');
            console.log(body);
            const response = await api.post("/api/v1/jefe_depto/reporte/update-municipio-oficio-evaluacion-estudiante", body);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

