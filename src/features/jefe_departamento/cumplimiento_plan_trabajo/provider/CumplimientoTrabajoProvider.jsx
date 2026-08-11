import React, { createContext, useState, useEffect } from "react";
import api from "../../../../hooks/api";
import useFetchProfesoresList from "../hooks/useFetchProfesoresList";
import useMunicipios from "../../../../hooks/useMunicipios";
import useFetchDeleteOficio from "../../evaluacion_estudiante/hooks/useFetchDeleteOficio";
import useProfesorPag from "../../../../hooks/useProfesorPag";
import useCiclosEscolares from "../../../../hooks/useCiclosEscolares";
import useCicloDisponibilidad from "../../../../hooks/useCicloDisponibilidad";
import useCicloChange from "../../../../hooks/useCicloChange";
import { getAccessToken } from "../../../authService";
import { obtenerSizeList } from "../../../materiasService";
import useChangeMunicipio from "../../hooks/useChangeMunicipio";

export const CumplimientoTrabajoContext = createContext();

const CumplimientoTrabajoProvider = ({ children }) => {
  const [loading, setIsLoading] = useState();
  const [sizeListProfesor, setSizeListProfesor] = useState(0);
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const { getMunicipioJefe, saveMunicipio } = useChangeMunicipio();
  const { currentPage, totalPages, handleFirstPage, handleLastPage, setCurrentPage } = useProfesorPag(sizeListProfesor);
  const { selectedCiclo } = useCicloChange(setCurrentPage);
  const { cicloDisponible } = useCicloDisponibilidad(selectedCiclo);
  const { ciclosEscolares, fetchCiclosEscolares } = useCiclosEscolares();
  const [cicloEscolar, setCicloEscolar] = useState();
  const requestBodyProfesoresList = {
    codigoEmpleado: localStorage.getItem("userName"),
    cicloEscolar: cicloEscolar,
    page: "1",
    app: "PruebasSpertoDigital",
  };
  const { listaProfesores, isLoadingProfesores, getListProfesores, setListaProfesores } =
    useFetchProfesoresList(setSelectedMunicipio);
  const { municipios } = useMunicipios();
  const [profesoresCopies, setProfesoresCopies] = useState([]);
  const [sortProfesorCodigo, setSortProfesorCodigo] = useState(false);
  const [sortProfesorNombre, setSortProfesorNombre] = useState(false);

  useEffect(() => {
    console.log({ cicloEscolar, currentPage, municipios: municipios.slice(0, 4), listaProfesores });
    if (!municipios || municipios.length === 0 || !currentPage || !cicloEscolar) return;
    getMunicipioJefe(localStorage.getItem("userName"), "4").then((response) => {
      if (!response) return;
      console.log(response);
      console.log(municipios);
      const municipioName = municipios.find((item) => item.id === parseInt(response.id_municipio)).municipio;
      console.log(municipioName);
      if (isLoadingProfesores) return;
      setSelectedMunicipio(municipioName);
      setListaProfesores(
        listaProfesores.map((profesor) => {
          if (profesor.noOficio && profesor.statusMunicipio === "0") {
            return {
              ...profesor,
              ubicacion: municipioName,
              statusMunicipio: "0",
            };
          } else
            return {
              ...profesor,
              ubicacion: municipioName,
            };
        })
      );
    });
    // eslint-disable-next-line
  }, [municipios, currentPage, cicloEscolar, isLoadingProfesores]);
  const fetchTotalSize = async () => {
    try {
      setIsLoading(true);
      const size = await obtenerSizeList();
      setSizeListProfesor(size);
    } catch (error) {
      console.error("Error fetching total size:", error);
      setSizeListProfesor(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeSelect = async (currentCiclo) => {
    setCicloEscolar(currentCiclo);
    setCurrentPage(1);
    await getListProfesores({
      ...requestBodyProfesoresList,
      cicloEscolar: currentCiclo,
    });
  };

  const handleNextPageLegacy = async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      await getListProfesores({
        ...requestBodyProfesoresList,
        page: currentPage + 1,
      });
    }
  };

  const handlePreviousPageLegacy = async () => {
    if (currentPage <= totalPages) {
      setCurrentPage(currentPage - 1);
      await getListProfesores({
        ...requestBodyProfesoresList,
        page: currentPage - 1,
      });
    }
  };

  const handleGoLastPage = async () => {
    handleLastPage();
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
      await getListProfesores({
        ...requestBodyProfesoresList,
        page: totalPages,
      });
    }
  };

  const handleGoFirstPage = async () => {
    handleFirstPage();
    if (currentPage > 1) {
      setCurrentPage(1);
      await getListProfesores({
        ...requestBodyProfesoresList,
        page: 1,
      });
    }
  };

  const handleMunicipioChange = async (municipio, currentPage) => {
    if (!currentPage || !cicloEscolar) {
      setSelectedMunicipio(municipio);
      return;
    }
    const confirmChangeMunicipio = window.confirm(
      "¿Estas seguro de que deseas cambiar el municipio de todos los campos?"
    );

    if (confirmChangeMunicipio) {
      try {
        const requestBody = {
          codigoEmpleado: localStorage.getItem("userName"),
          cicloEscolar: cicloEscolar,
          app: "PruebasSpertoDigital",
          idMunicipio: municipios.find((item) => item.municipio === municipio).id,
        };
        const response = await api.post(
          "/api/v1/jefe_depto/reporte/update-oficio-cumplimiento-plan-trabajo",
          requestBody
        );
        setListaProfesores(
          listaProfesores.map((profesor) => {
            if (profesor.noOficio) {
              return {
                ...profesor,
                ubicacion: municipio,
                statusMunicipio: "0",
                hasChanged: true,
              };
            } else
              return {
                ...profesor,
                ubicacion: municipio,
              };
          })
        );
        await saveMunicipio({
          usuario: localStorage.getItem("userName"),
          id_etapa_jefe: "4",
          id_municipio: municipios.find((item) => item.municipio === municipio).id,
        });
        setSelectedMunicipio(municipio);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Cancelando");
      return;
    }
  };

  const editProfesor = (profesorToEdit) => {
    setListaProfesores(
      listaProfesores.map((profesor) => {
        if (profesor.codigoProfesor === profesorToEdit.codigoProfesor) {
          return {
            ...profesor,
            isEdit: true,
          };
        } else return profesor;
      })
    );
    setProfesoresCopies([...profesoresCopies, profesorToEdit]);
  };

  const wasProfesorEdited = (profesor, originalProfesor) => {
    let materiasChanged = false;
    if (!originalProfesor.materia && profesor.materia) {
      materiasChanged = true;
    } else if (originalProfesor.materia) {
      originalProfesor.materia.forEach((originalMateria, idx) => {
        if (originalMateria.resultado !== profesor.materia[idx].resultado && !materiasChanged) {
          materiasChanged = true;
        }
      });
    }
    return (
      profesor.noOficio !== originalProfesor.noOficio ||
      materiasChanged ||
      profesor.ubicacion !== originalProfesor.ubicacion
    );
  };

  const saveEditProfesor = (profesorToEdit) => {
    setListaProfesores(
      listaProfesores.map((profesor) => {
        if (profesor.codigoProfesor === profesorToEdit.codigoProfesor) {
          return {
            ...profesor,
            isEdit: false,
            hasChanged: wasProfesorEdited(
              profesorToEdit,
              profesoresCopies.find((prof) => prof.codigoProfesor === profesorToEdit.codigoProfesor)
            ),
          };
        } else return profesor;
      })
    );
  };

  const handleNoOficioChange = (value, profesorToEdit) => {
    setListaProfesores(
      listaProfesores.map((profesor) => {
        if (profesor.codigoProfesor === profesorToEdit.codigoProfesor) {
          return {
            ...profesor,
            noOficio: value,
          };
        } else return profesor;
      })
    );
  };

  const generateNewPdf = async (profesorToEdit) => {
    try {
      setListaProfesores(
        listaProfesores.map((profesor) => {
          if (profesor.codigoProfesor === profesorToEdit.codigoProfesor) {
            return {
              ...profesor,
              loading: true,
            };
          } else return profesor;
        })
      );
      const requestBody = {
        idQr: profesorToEdit.idQr,
        nombreProfesor: profesorToEdit.nombreProfesor,
        codigoProfesor: profesorToEdit.codigoProfesor,
        noOficio: profesorToEdit.noOficio,
        cicloEscolar: profesorToEdit.cicloEscolar,
        ubicacion: municipios.find((item) => item.municipio === profesorToEdit.ubicacion).id,
        nombreJefe: profesorToEdit.nombreJefe,
        cargoJefe: profesorToEdit.cargoJefe,
        codigoEmpleado: profesorToEdit.codigoEmpleado,
        correoProfesor: profesorToEdit.correoProfesor,
      };
      const response = await api.post("/api/v1/jefe_depto/reporte/alta-oficio-cumplimiento-plan-trabajo", requestBody);
      console.log(response);
      setListaProfesores(
        listaProfesores.map((profesor) => {
          if (profesor.codigoProfesor === profesorToEdit.codigoProfesor) {
            return {
              ...profesor,
              marcado: "1",
              loading: false,
              hasChanged: false,
              statusMunicipio: "1",
            };
          } else return profesor;
        })
      );
    } catch (error) {
      console.error(error);
      alert(error.response.data.mensaje);
      setListaProfesores(
        listaProfesores.map((profesor) => {
          if (profesor.codigoProfesor === profesorToEdit.codigoProfesor) {
            return {
              ...profesor,
              loading: false,
            };
          } else return profesor;
        })
      );
    }
  };

  const updatePdf = async (profesorToEdit) => {
    try {
      setListaProfesores(
        listaProfesores.map((profesor) => {
          if (profesor.codigoProfesor === profesorToEdit.codigoProfesor) {
            return {
              ...profesor,
              loading: true,
            };
          } else return profesor;
        })
      );
      const requestBody = {
        idQr: profesorToEdit.idQr,
        nombreProfesor: profesorToEdit.nombreProfesor,
        codigoProfesor: profesorToEdit.codigoProfesor,
        noOficio: profesorToEdit.noOficio,
        cicloEscolar: profesorToEdit.cicloEscolar,
        ubicacion: municipios.find((item) => item.municipio === profesorToEdit.ubicacion).id,
        nombreJefe: profesorToEdit.nombreJefe,
        cargoJefe: profesorToEdit.cargoJefe,
        codigoEmpleado: profesorToEdit.codigoEmpleado,
        correoProfesor: profesorToEdit.correoProfesor,
      };
      const response = await api.post(
        "/api/v1/jefe_depto/reporte/editar-oficio-cumplimiento-plan-trabajo",
        requestBody
      );

      if (!response.data) {
        throw new Error("Error al actualizar el PDF.");
      }

      setListaProfesores(
        listaProfesores.map((profesor) => {
          if (profesor.codigoProfesor === profesorToEdit.codigoProfesor) {
            return {
              ...profesor,
              marcado: "1",
              loading: false,
              hasChanged: false,
              statusMunicipio: "1",
            };
          } else return profesor;
        })
      );
    } catch (error) {
      console.error(error);
      setListaProfesores(
        listaProfesores.map((profesor) => {
          if (profesor.codigoProfesor === profesorToEdit.codigoProfesor) {
            return {
              ...profesor,
              hasChanged: false,
              loading: false,
            };
          } else return profesor;
        })
      );
      if (error?.response?.data?.mensaje) {
        alert(error?.response?.data?.mensaje);
      }
    }
  };

  const downloadPdf = async (profesor) => {
    try {
      const token = await getAccessToken();
      console.log("Enviando solicitud para consultar la carta de desempeño con el ID:", profesor.idQr);
      const response = await api.post(
        "/api/v1/jefe_depto/reporte/consultar-carta-jefe-depto",
        {
          idQr: profesor.idQr,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `OFICIO_CUMPLIMIENTO_PLAN_TRABAJO.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("Carta de Desempeño descargada exitosamente.");
    } catch (error) {
      console.error("Error al consultar y descargar la Carta de Desempeño:", error.response?.data || error.message);
    }
  };

  const handleDeleteProfesor = async (idQr, currentPage) => {
    const confirmDelete = window.confirm("¿Estas seguro que deseas eliminar el registro?");
    if (confirmDelete) {
      try {
        const response = await api.post("/api/v1/jefe_depto/reporte/eliminar-oficio-cumplimiento-plan-trabajo", {
          idQr,
        });
        setListaProfesores(
          listaProfesores.map((profesor) => {
            if (profesor.idQr === idQr) {
              return {
                ...profesor,
                marcado: "0",
                hasChanged: false,
                loading: false,
                noOficio: "",
              };
            }
            return profesor;
          })
        );
        return;
      } catch (error) {
        console.log(error);
        alert(error.response.data.mensaje);
      }
    } else {
      console.log("Cancenlando");
      return;
    }
  };

  const toggleSortProfesorCodigo = () => {
    setSortProfesorCodigo(!sortProfesorCodigo);
    let sortedList;
    if (sortProfesorCodigo) {
      sortedList = listaProfesores.sort((a, b) => Number(a.codigoProfesor) - Number(b.codigoProfesor));
    } else {
      sortedList = listaProfesores.sort((a, b) => Number(b.codigoProfesor) - Number(a.codigoProfesor));
    }
    setListaProfesores(sortedList);
  };

  const toggleSortProfesorNombre = () => {
    setSortProfesorNombre(!sortProfesorNombre);
    let sortedList;
    if (sortProfesorNombre) {
      sortedList = listaProfesores.sort((a, b) => a.nombreProfesor.localeCompare(b.nombreProfesor));
    } else {
      sortedList = listaProfesores.sort((a, b) => b.nombreProfesor.localeCompare(a.nombreProfesor));
    }
    setListaProfesores(sortedList);
  };

  return (
    <CumplimientoTrabajoContext.Provider
      value={{
        municipios,
        handleMunicipioChange,
        cicloEscolar,
        isLoadingProfesores,
        selectedMunicipio,
        loading,
        fetchTotalSize,
        totalPages,
        handleGoFirstPage,
        handleGoLastPage,
        ciclosEscolares,
        fetchCiclosEscolares,
        handleChangeSelect,
        handleNextPageLegacy,
        handlePreviousPageLegacy,
        listaProfesores,
        handleNoOficioChange,
        saveEditProfesor,
        editProfesor,
        generateNewPdf,
        updatePdf,
        downloadPdf,
        handleDeleteProfesor,
        toggleSortProfesorCodigo,
        toggleSortProfesorNombre,
        cicloDisponible,
        currentPage,
        setCurrentPage,
        setSelectedMunicipio,
        sortProfesorCodigo,
        sortProfesorNombre,
      }}
    >
      {children}
    </CumplimientoTrabajoContext.Provider>
  );
};

export default CumplimientoTrabajoProvider;
