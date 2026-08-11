import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";
import { Navigation } from "./router/Navigation";


import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAccessTokenRefreshDelay,
  logout,
  refreshAccessToken,
} from "./features/authService";
import GlobalAlert from "./reutilizable/GlobalAlert";

/** Intervalo para detectar despliegues nuevos aunque el usuario no cambie de ruta. */
const VERSION_POLL_MS = 5 * 60 * 1000;

function App() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const API_FRONT_VERSION = useMemo(
    () => `${API_BASE_URL}/public/version`,
    [API_BASE_URL]
  );
  const location = useLocation();
  const navigate = useNavigate();

  const [globalAlertMessage, setGlobalAlertMessage] = useState("");
  const [globalAlertKey, setGlobalAlertKey] = useState(0);
  /** Solo permitir refresh de token y lógica dependiente si la versión del front sigue siendo aceptada. */
  const [versionOk, setVersionOk] = useState(() => location.pathname === "/login");

  const originalWindowAlert = useMemo(() => window.alert, []);

  useEffect(() => {
    window.alert = (message) => {
      setGlobalAlertMessage(String(message ?? ""));
      setGlobalAlertKey(Date.now());
    };

    return () => {
      window.alert = originalWindowAlert;
    };
  }, [originalWindowAlert]);

  useEffect(() => {
    if (location.pathname === "/login") {
      setVersionOk(true);
      return;
    }

    let cancelled = false;

    const runVersionCheck = async () => {
      try {
        const v = encodeURIComponent(process.env.REACT_APP_FRONT_VERSION ?? "");
        await axios.get(`${API_FRONT_VERSION}?version=${v}`);
        if (!cancelled) {
          setVersionOk(true);
        }
      } catch {
        if (!cancelled) {
          setVersionOk(false);
          alert(`Estimado usuario, no cuenta con la última versión del sistema.

Limpie la caché de su navegador o ingrese en modo incognito para asegurar que cuenta con los últimos cambios liberados.
`);
          localStorage.clear();
          navigate("/login", { replace: true });
        }
      }
    };

    setVersionOk(false);
    runVersionCheck();
    const intervalId = window.setInterval(runVersionCheck, VERSION_POLL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        runVersionCheck();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [location.pathname, API_FRONT_VERSION, navigate]);

  useEffect(() => {
    if (location.pathname === "/login" || !versionOk) {
      return;
    }

    let timeoutId;
    let isCancelled = false;

    const refreshSession = async () => {
      if (!localStorage.getItem("refreshToken")) {
        return;
      }

      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("No fue posible refrescar la sesion", error);
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          logout();
          navigate("/login", { replace: true });
        }
      }
    };

    const scheduleRefresh = () => {
      const delay = getAccessTokenRefreshDelay();

      timeoutId = setTimeout(async () => {
        if (isCancelled) {
          return;
        }

        await refreshSession();

        if (!isCancelled && location.pathname !== "/login") {
          scheduleRefresh();
        }
      }, delay);
    };

    scheduleRefresh();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [location.pathname, navigate, versionOk]);

  useEffect(() => {
    const handleStorageChange = () => {
      const localSessionTimestamp = localStorage.getItem('sessionTimestamp');
      const currentSessionTimestamp = sessionStorage.getItem('sessionTimestamp');

      // Si el timestamp local es más reciente, cerrar la sesión actual
      if (new Date(localSessionTimestamp) > new Date(currentSessionTimestamp)) {
        console.log('Una nueva sesión ha sido iniciada. Cerrando esta sesión.');
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <GlobalAlert key={globalAlertKey} message={globalAlertMessage} typeAlert="warning" />
      <Navigation />
    </>
  );
}

export default App;
