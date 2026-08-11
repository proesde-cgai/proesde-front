import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getAccessToken } from "../../authService"; 

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_CORREO_PROESDE = `${API_BASE_URL}/api/v1/solicitud/email/`;

export const useFetchEmail = (codigo) => {
      const [correoProesde, setCorreoProesde] = useState("");
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
    
    const fetchEmail = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = await getAccessToken();

                const response = await axios.get(`${API_URL_CORREO_PROESDE}${codigo}`, {
                    headers: {
                        Accept: '*/*',
                        Authorization: `Bearer ${token}`,
                    },
                });

                setCorreoProesde(response.data);

            } catch (err) {
                console.error('Error fetching email:', err);
                setError(err.message || 'Unknown error occurred');
            } finally {
                setLoading(false);
            }
    
    };

    return { correoProesde, loading, error, fetchEmail };
  };
  