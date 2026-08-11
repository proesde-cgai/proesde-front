export function obtenerAnios() {
    const anioActual = new Date().getFullYear();
    const anioSiguiente = anioActual + 1;
    return { anioActual, anioSiguiente };
}

export function formatTimestampToDate(timestamp) {
    let date = new Date(timestamp);

    let year = date.getFullYear();  // Obtener el año
    let month = String(date.getMonth() + 1).padStart(2, '0');  // Obtener el mes (sumar 1 porque los meses empiezan desde 0)
    let day = String(date.getDate()).padStart(2, '0');  // Obtener el día

    return `${year}/${month}/${day}`;  // Devolver la fecha en el formato YYYY-MM-DD
}

export function cambiarNombreArchivo(nombreArchivo, textoAAgregar) {
    return nombreArchivo.replace(/(.*)(\.\w+)$/, `$1${textoAAgregar}$2`);
}

export function replaceBrWithNewline(inputText) {
    return inputText
        ?.replace(/<br\s*\/?>/gi, '\n') // Reemplaza <br> por un salto de línea
        ?.replace(/;/g, ';\n'); // Añade un salto de línea después de cada ;
}