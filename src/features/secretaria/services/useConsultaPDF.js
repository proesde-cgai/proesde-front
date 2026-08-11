import { useEffect, useState } from "react";
import axios from 'axios';
import { getAccessToken } from '../../authService';

import { useEvaluationStore } from "../../../store/useEvaluationStore";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_GET_NODO= `${API_BASE_URL}/api/v1/gestorDocs/obtener-nodo-solicitud`;

export const useDocSolicitud = () => {
  const [isLoadingDictamen, setIsLoadingDictamen] = useState(false);
  const [isSolicitudUploaded, setIsSolicitudUploaded] = useState(false);
  const [docNodoId, setDocNodoId] = useState(null);
  const [isLoadingViewer, setIsLoadingViewer] = useState(false);

  const { selectedDataAcademico } = useEvaluationStore();

  const getNodoSolicitud = async () => {
    setIsLoadingDictamen(true);
    try {
      const token = await getAccessToken();
      const response = await axios.get(`${API_URL_GET_NODO}?idSolicitud=${selectedDataAcademico.id}`, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      console.log("Nodo de solicitud: ", data);

      setIsSolicitudUploaded(true);
      setDocNodoId(data.nodo);

    } catch (error) {
      console.error('Error al obtener nodo: ', error);
      setDocNodoId(null);
    }
    finally {
      setIsLoadingDictamen(false);
    }
  };


  return {
    // properties
    isLoadingDictamen,
    isSolicitudUploaded,
    docNodoId,
    getNodoSolicitud,

  };
};
