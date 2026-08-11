import { useState, useEffect } from 'react';
import { getDatosInconformidad } from '../services/datosInconformidad';

function parseDate(dateString) {
    if (!dateString || typeof dateString !== 'string') {
      console.warn('Invalid date string:', dateString);
      return null;
    }  
    // Detectar el formato según la posición del año
    const isYearFirst = /^\d{4}-\d{2}-\d{2}$/.test(dateString); // yyyy-MM-dd
  
    let year, month, day;
  
    if (isYearFirst) {
      [year, month, day] = dateString.split('-');
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      // Format dd-MM-yyyy
      [day, month, year] = dateString.split('-');
    } else {
      console.warn('Unknown date format:', dateString);
      return null;
  }
    return { year, month, day };
  }

export const useDatosInconformidad = (codigo) => {
    const [formData, setFormData] = useState({
      recibida: '',
      fecha: '',
      area: '',
      documento: null,
      nodoFirmado: null,
      nombreDocumento: '',
    });
    const [dataAcademico, setDataAcademico] = useState(null);
    const [isLoadingAcademico, setIsLoadingAcademico] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        if (!codigo) {
            console.warn("Codigo is undefined. Skipping fetch.");
            setIsLoadingAcademico(false);
            return;
        }

        setError(null);

        const fetchDatosInconformidad = async () => {
            try {
                const data = await getDatosInconformidad(codigo);
                // console.log("API Response:", data); 
                
                if (data && typeof data === 'object') {
                    setFormData({
                        recibida: data.fechaRecibido,
                        fecha: data.fechaInconformidad,
                        area: data.razones,
                        documento: null,
                        nombreDocumento: data.nombreArchivo || "",
                        nodo : data.nodo || "",
                        nodoFirmado: data.nodoSecretaria || "",

                    });
                    setDataAcademico(data);
                } else {
                    setFormData({
                        recibida: "",
                        fecha: "",
                        area: "",
                        documento: null,
                        nombreDocumento: "",
                        nodo : ""
                    });
                }
            } catch (err) {
                console.error("Error fetching datos del participante:", err);
                setError("Unable to fetch data. Please try again later.");
            } finally {
                setIsLoadingAcademico(false);
            }
        };
    
        fetchDatosInconformidad();
    }, [codigo]);
  
    return { formData, dataAcademico, isLoadingAcademico, error };
  };

