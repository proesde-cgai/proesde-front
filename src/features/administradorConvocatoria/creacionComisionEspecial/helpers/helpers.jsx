
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchAcademicoByCodigo = async (codigo) => {
    const clean = String(codigo).trim();
    if (!clean) return { found: false, data: null };

    try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/api/v1/dictaminador/academico/${encodeURIComponent(clean)}`, {
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

export const guardarAcademico = async (codigo, idComision) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/api/v1/dictaminador/guardar`, {
            method: "POST",
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                codigo: parseInt(codigo),
                idComision: parseInt(idComision),
                activo: true
            })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error("Error guardando académico:", error);
        return { success: false, error };
    }
};

export const desactivarAcademico = async (idDictaminadorManual) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_BASE_URL}/api/v1/dictaminador/actualizar`, {
            method: "PUT",
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idDictaminadorManual: parseInt(idDictaminadorManual),
                activo: false
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