export const linkDownloadPDF = (data) => {
  const url = window.URL.createObjectURL(new Blob([data]));

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `PLAN_TRABAJO.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
