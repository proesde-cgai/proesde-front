import { useEffect, useState } from "react";
import { getAccessToken } from "../../authService"; // Asumimos que tienes el servicio de autenticación separado

import {
  getBannerLogo,
  getBannerPublic
} from "../service/bannerService";

const useFetchLogo = () => {
  const [logo, setLogo] = useState(() => {
    try {
      return sessionStorage.getItem("proesde_banner_logo") || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!logo); 
  const [error, setError] = useState(null);

  const obtainBannerLogo = async () => {
    if (!logo) {
      setLoading(true);
    }
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

      if (data) {
        setLogo(data);
        try {
          sessionStorage.setItem("proesde_banner_logo", data);
        } catch (e) {
          console.warn("Could not cache banner logo", e);
        }
      }

    } catch (error) {
      console.log(error.message);
      if (!logo) {
        setError("Unable to load logo. Please try again later.");
      }

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
