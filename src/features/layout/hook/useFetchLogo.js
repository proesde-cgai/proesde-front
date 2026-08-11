import { useEffect, useState } from "react";
import { getAccessToken } from "../../authService"; // Asumimos que tienes el servicio de autenticación separado

import {
  getBannerLogo,
  getBannerPublic
} from "../service/bannerService";

const useFetchLogo = () => {
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const obtainBannerLogo = async () => {
    setLoading(true);
    setError(null); 

    try {
      let data;

      try {
          const token = await getAccessToken();
          if (token) {
            data = await getBannerLogo(); 
          }
        } catch (authError) {
          data = await getBannerPublic(); // Fallback to public banner
        }

      setLogo(data); 

    } catch (error) {
      console.log(error.message);
      setError("Unable to load logo. Please try again later.");

    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    obtainBannerLogo();
  }, []);

  return {
    logo, loading, error,
  };
};

export default useFetchLogo;
