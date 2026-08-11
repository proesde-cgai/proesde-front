export const generatePDF = (data) => {
  const blob = new Blob([data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `DICTAMEN_INCONFORMIDAD_NO_PARTICIPANTE.pdf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
