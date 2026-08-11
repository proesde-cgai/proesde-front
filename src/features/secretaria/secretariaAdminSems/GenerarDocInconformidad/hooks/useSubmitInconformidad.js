import { useState } from 'react';
import axios from 'axios';
import { getAccessToken } from '../../../../authService'; 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_POST_INCONFORMARSE = `${API_BASE_URL}/api/v1/evaluacion/inconformarse`;


const useSubmitInconformidad = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const submitInconformidad = async (requestData) => {
    setIsLoading(true);
    setError(null);
    try {
        const token = await getAccessToken();
        const result = await axios.post(API_URL_POST_INCONFORMARSE, requestData, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(result.data);  // Store the response
    } catch (err) {
      console.error("Error uploading form", err);
      setError("There was an error submitting the form. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return { submitInconformidad, isLoading, error, response };
};

export default useSubmitInconformidad;
