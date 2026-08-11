import { useEffect, useState } from "react";
import axios from 'axios';
import { getAccessToken } from '../../authService';

import { useEvaluationStore } from "../../../store/useEvaluationStore";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_NODO= `${API_BASE_URL}/api/v1/dictamen-inconformidad/archivo`;


export const useDocDictamenP = () => {
  const [isLoadingDictamen, setIsLoadingDictamen] = useState(false);
  const [isLoadingActa, setIsLoadingActa] = useState(false);
  const [isDictamenUploaded, setIsDictamenUploaded] = useState(false);
  const [isActaUploaded, setIsActaUploaded] = useState(false);
  const [docNodoDictamen, setNodoDictamen] = useState(null);
  const [docNodoActa, setDocNodoActa] = useState(null);

  const { selectedDataAcademico } = useEvaluationStore();

  const getNodoDictamenInc = async () => {
    setIsLoadingDictamen(true);
    try {
      const token = await getAccessToken();
      const response = await axios.get(`${API_URL_NODO}/${selectedDataAcademico.id}/${"dictamen"}`, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      setIsDictamenUploaded(true);
      setNodoDictamen(data.nodoDictamen);

    } catch (error) {
      console.error('Error al obtener nodo: ', error);
      setNodoDictamen(null);
    }
    finally {
      setIsLoadingDictamen(false);
    }
  };

  const getNodoActaInc = async (idSolicitud) => {
    setIsLoadingActa(true);
    const id = idSolicitud || selectedDataAcademico.id
    try {
      const token = await getAccessToken();
      const response = await axios.get(`${API_URL_NODO}/${id}/${"acta"}`, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      setIsActaUploaded(true);
      setDocNodoActa(data.nodoDictamen);

    } catch (error) {
      console.error('Error al obtener nodo: ', error);
      setDocNodoActa(null);
    }
    finally {
      setIsLoadingActa(false);
    }
  };

  return {
    // dictamen
    isLoadingDictamen,
    isDictamenUploaded,
    docNodoDictamen,
    //acta
    isLoadingActa,
    docNodoActa,
    isActaUploaded,
    getNodoDictamenInc,
    getNodoActaInc
  };
};
