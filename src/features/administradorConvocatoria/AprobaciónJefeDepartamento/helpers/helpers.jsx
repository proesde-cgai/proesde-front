
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchAcademicoByCodigo = async (codigo) => {
    console.log("codigo a buscar en helper:", codigo);
    const clean = String(codigo).trim();
    if (!clean) return { found: false, data: null };

    try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/api/v1/asignacion-temporal-jefe-departamento/academico/${encodeURIComponent(clean)}`, {
            method: "GET",
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (res.status === 404) return { found: false, data: null };
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const raw = await res.json();
        const data = {
            codigo: raw.codigo,
            nombre: raw.nombre,
            dependencia: raw.dependenciaAcademico ?? raw.dependencia ?? "",
            siglas: raw.siglas ?? "",
            activo: raw.activo ?? true,
            idDictaminadorManual: raw.idDictaminadorManual,
        };
        return { found: true, data };
    } catch (e) {
        console.error("Error fetching académico:", e);
        return { found: false, data: null, error: true };
    }
};

export const guardarAcademico = async (codigoAutoridad, codigoAcademico) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/api/v1/asignacion-temporal-jefe-departamento/asignacion`, {
            method: "POST",
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                codigoAcademico: codigoAcademico.toString(),
                codigoAutoridad: codigoAutoridad.toString()
            })
        });

        if (!res.ok) {
            // Intentar obtener el mensaje del response
            let errorMessage = `HTTP ${res.status}`;
            try {
                const errorData = await res.json();
                if (errorData.mensaje) {
                    errorMessage = errorData.mensaje;
                }
            } catch (e) {
                // Si no se puede parsear el JSON, usar el mensaje por defecto
            }
            throw new Error(errorMessage);
        }
        
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error("Error guardando académico:", error);
        return { success: false, error, message: error.message };
    }
};

export const desactivarAcademico = async (codigoAutoridad, codigoAcademico) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/api/v1/asignacion-temporal-jefe-departamento/asignaciones`, {
            method: "DELETE",
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                codigosAcademicos: [codigoAcademico.toString()],
                codigoAutoridad: codigoAutoridad.toString()
            })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error("Error desactivando académico:", error);
        return { success: false, error };
    }
};