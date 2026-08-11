export const nameByIdMunicipio = (idMunicipio, municipios) => {
    if (typeof idMunicipio !== "number" && isNaN(Number(idMunicipio))) {
        // Si `idMunicipio` no es un número, asumimos que ya es el nombre
        return idMunicipio;
    }
    
    if (!municipios || !Array.isArray(municipios)) {
        console.warn("La lista de municipios no está disponible o no es un array.");
        return "No Disponible";
    }

    const municipio = municipios.find((m) => String(m.id) === String(idMunicipio));

    if (!municipio) {
        console.warn(`No se encontró un municipio con el ID: ${idMunicipio}`);
        return "No Disponible";
    }

    return municipio.municipio;
};
