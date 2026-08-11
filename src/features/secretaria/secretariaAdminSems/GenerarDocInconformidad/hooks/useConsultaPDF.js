import { useEffect, useState } from "react";
import axios from 'axios';
import { getAccessToken } from '../../../../authService';

import { useEvaluationStore } from "../../../../../store/useEvaluationStore";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_GET_NODO= `${API_BASE_URL}/api/v1/gestorDocs/obtener-nodo-inconformidad`;

export const useDocInconformidad = () => {
  const [isLoadingDictamen, setIsLoadingDictamen] = useState(false);
  const [isInconformidadUploaded, setIsInconformidadUploaded] = useState(false);
  const [docNodoId, setDocNodoId] = useState(null);
  const [isLoadingViewer, setIsLoadingViewer] = useState(false);

  const { selectedDataAcademico } = useEvaluationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlPdf, setUrlPdf] = useState(null);

  const getNodoInconformidad = async () => {
    setIsInconformidadUploaded(false);
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
      if (data) {
        setIsInconformidadUploaded(true);
        setDocNodoId(data.nodo);
      } else {
        setIsInconformidadUploaded(false);
        setDocNodoId(null);
      }
  
    } catch (error) {
      console.error('Error al obtener nodo: ', error);
    }
    finally {
      setIsLoadingDictamen(false);
    }
  };


  return {
    // properties
    isLoadingDictamen,
    isInconformidadUploaded,
    docNodoId,
    getNodoInconformidad,

  };
};
