// hooks/useSendCode.js
import {
    useState
} from 'react';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const getAccessToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        throw new Error("No se encontró el token de acceso. ¿El usuario está autenticado?");
    }
    return token;
};

const useSendCode = () => {

    const [responseMessage, setResponseMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendCode = async (convocatoria_actual, codigo) => {
        setLoading(true);
        setError(null);

        try {
            const url = `${API_BASE_URL}/reportes/reimprimir_reporte_solicitud/${codigo}`;
            const token = getAccessToken();
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = 'reporte.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();

                setResponseMessage('Reporte generado con éxito');
            } else {
                setResponseMessage('Error al obtener el reporte');
            }
        } catch (err) {
            setError('Error de conexión o del servidor');
        } finally {
            setLoading(false);
        }
    };

    return {
        sendCode,
        responseMessage,
        loading,
        error
    };
};

export default useSendCode;