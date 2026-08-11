export const downloadPDF = (pdfBytes) => {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "reporte.pdf");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const CABECERAS_TABLA = [
  {
    id: 1,
    labelCabecera: 'inp'
  },
  {
    id: 2,
    labelCabecera: '#'
  },
  {
    id: 3,
    labelCabecera: 'Apellido(S) Nombre(s)'
  },
  {
    id: 4,
    labelCabecera: 'Tipo'
  },
  {
    id: 5,
    labelCabecera: 'Dependencia'
  },
  {
    id: 6,
    labelCabecera: 'Nivel'
  },
  {
    id: 7,
    labelCabecera: 'Calidad'
  },
  {
    id: 8,
    labelCabecera: 'Pts.'
  },
];