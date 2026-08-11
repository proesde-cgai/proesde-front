import React, { createContext, useState, useEffect } from "react";
import useFetchGetListProfesores from "../hooks/useFetchGetListProfesores";
import useFetchUpdateOficio from "../hooks/useFetchUpdateOficio";
import useMunicipios from "../../../../hooks/useMunicipios";
import useFetchDeleteOficio from "../hooks/useFetchDeleteOficio";
import useFetchAltaOficio from "../hooks/useFetchAltaOficio";
import useFetchGetMaterias from "../hooks/useFetchGetMaterias";
import useProfesorPag from "../../../../hooks/useProfesorPag";
import useCiclosEscolares from "../../../../hooks/useCiclosEscolares";
import useCicloDisponibilidad from "../../../../hooks/useCicloDisponibilidad";
import useCicloChange from "../../../../hooks/useCicloChange";
import { consultarCartaEvaluacion } from "../../../CartaDesempenoService";
import { updateMunicipiosEvaluacionDocente } from "../service/updateMunicipios";
import { obtenerSizeList } from "../../../materiasService";
import MateriaModal from "../../../../reutilizable/components/MateriaModal";
import useChangeMunicipio from "../../hooks/useChangeMunicipio";
import { set } from "react-hook-form";

export const EvaluacionEstudianteContext = createContext();

const EvaluacionEstudianteProvider = ({ children }) => {
  const [loading, setIsLoading] = useState();
  const [sizeListProfesor, setSizeListProfesor] = useState(0);
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
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
  const { getListProfesores, isLoadingProfesores, listaProfesores, setListaProfesores } = useFetchGetListProfesores();
  const { saveMunicipio, getMunicipioJefe } = useChangeMunicipio();
  const { updateOficio } = useFetchUpdateOficio();
  const { municipios } = useMunicipios();
  const { deleteOficioByIdQr } = useFetchDeleteOficio();
  const [profesoresCopies, setProfesoresCopies] = useState([]);
  const { altaOficioProfesor } = useFetchAltaOficio();
  const [sortProfesorCodigo, setSortProfesorCodigo] = useState(false);
  const [sortProfesorNombre, setSortProfesorNombre] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [profesorData, setProfesorData] = useState({});
  const { getAllMateriasProfesor } = useFetchGetMaterias();
  const [materiasList, setMateriaList] = useState([]);
  const [typeSortName, setTypeSortName] = useState("asc");
  const [typeSortCode, setTypeSortCode] = useState("asc");

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

  useEffect(() => {
    console.log({
      cicloEscolar,
      currentPage,
      municipios: municipios.slice(0, 4),
      listaProfesores,
    });
    if (!municipios || municipios.length === 0 || !currentPage || !cicloEscolar) return;
    getMunicipioJefe(localStorage.getItem("userName"), "2").then((response) => {
      if (!response) return;
      console.log(response);
      console.log(municipios);
      const municipioName = municipios.find((item) => item.id === parseInt(response.id_municipio)).municipio;
      console.log(municipioName);
      console.log(selectedMunicipio);
      if (isLoadingProfesores) return;
      setSelectedMunicipio(municipioName);
      setListaProfesores(
        listaProfesores.map((profesor) => {
          return {
            ...profesor,
            ubicacion: municipioName,
          };
        })
      );
    });
    // eslint-disable-next-line
  }, [municipios, currentPage, cicloEscolar, isLoadingProfesores]);

  const handleRowDoubleClick = (profesorClicked) => {
    setProfesorData(profesorClicked);
    setMateriaList([]);
    setModalIsOpen(true);
    setListaProfesores(
      listaProfesores.map((profesor) => {
        if (profesor.codigoProfesor === profesorClicked.codigoProfesor) {
          return {
            ...profesor,
            isEdit: true,
          };
        } else return profesor;
      })
    );
    setProfesoresCopies([...profesoresCopies, profesorClicked]);
  };

  const handleChangeSelect = async (e) => {
    const newCicloEscolar = e.target.value;
    setCicloEscolar(newCicloEscolar);
    setCurrentPage(1);
    await getListProfesores({
      ...requestBodyProfesoresList,
      cicloEscolar: newCicloEscolar,
    });
  };

  const handleNextPageLegacy = async () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      await getListProfesores(
        {
          ...requestBodyProfesoresList,
          page: nextPage,
        },
        sortProfesorNombre ? "nombreProfesor" : sortProfesorCodigo ? "codigoProfesor" : null,
        sortProfesorNombre ? typeSortName : typeSortCode
      );
    }
  };

  const handlePreviousPageLegacy = async () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
  
      await getListProfesores(
        {
          ...requestBodyProfesoresList,
          page: prevPage,
        },
        sortProfesorNombre ? "nombreProfesor" : sortProfesorCodigo ? "codigoProfesor" : null,
        sortProfesorNombre ? typeSortName : typeSortCode
      );
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

  const updateMateriasProfesor = (profesorToEdit, materias) => {
    setListaProfesores(
      listaProfesores.map((profesor) => {
        if (profesor.codigoProfesor === profesorToEdit.codigoProfesor) {
          return {
            ...profesor,
            materia: materias,
          };
        } else return profesor;
      })
    );
  };

  const handleMunicipioChange = async (municipio, currentPage) => {
    console.log(municipio);
    if (!currentPage || !cicloEscolar) {
      console.error("No se puede cambiar el municipio sin un ciclo escolar o una página.");
      setSelectedMunicipio(municipio);
      return;
    }

    const confirmChangeMunicipio = window.confirm(
      "¿Estás seguro de que deseas cambiar el municipio de todos los campos?"
    );

    if (confirmChangeMunicipio) {
      try {
        const municipioId = municipios.find((item) => item.municipio === municipio).id;

        // Llamada asincrónica para actualizar en el backend
        await updateMunicipiosEvaluacionDocente({
          codigoEmpleado: localStorage.getItem("userName"),
          cicloEscolar: cicloEscolar,
          app: "PruebasSpertoDigital",
          idMunicipio: municipioId,
        });

        // Actualizar lista de profesores
        const actualizados = listaProfesores.map((profesor) => {
          const hasChanged = profesor.noOficio !== null && profesor.ubicacion !== municipio; // Solo cambia si tiene un número de oficio y el municipio es diferente

          return {
            ...profesor,
            ubicacion: municipio,
            statusMunicipio: "0", // Cambia statusMunicipio solo si cambió
            hasChanged, // Solo marcar como cambiado si tiene un noOficio y hubo un cambio real
          };
        });

        setListaProfesores(actualizados);

        // Guardar cambio de municipio
        await saveMunicipio({
          usuario: localStorage.getItem("userName"),
          id_etapa_jefe: "2",
          id_municipio: municipioId,
        });

        setSelectedMunicipio(municipio);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Cambio de municipio cancelado.");
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
      delete profesorToEdit.isEdit;
      delete profesorToEdit.hasChanged;
      const response = await altaOficioProfesor({
        ...profesorToEdit,
        ubicacion: municipios.find((item) => item.municipio === profesorToEdit.ubicacion).id,
      });
      console.log(response);
      if (response === "Success") {
        setListaProfesores(
          listaProfesores.map((profesor) => {
            if (profesor.codigoProfesor === profesorToEdit.codigoProfesor) {
              return {
                ...profesor,
                loading: false,
                marcado: "1",
              };
            } else return profesor;
          })
        );
        alert("Se genero exitosamente el PDF.");
        return;
      } else {
        alert("Hubo un error al generar el PDF.");
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
    } catch (error) {
      console.error(error);
      alert("Error al generar el PDF");
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
    } finally {
    }
  };

  const updatePdf = async (profesorToEdit) => {
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
    delete profesorToEdit.isEdit;
    delete profesorToEdit.hasChanged;
    const response = await updateOficio({
      ...profesorToEdit,
      ubicacion: municipios.find((item) => item.municipio === profesorToEdit.ubicacion).id,
    });
    console.log(response);
    if (response === "Success") {
      setListaProfesores(
        listaProfesores.map((profesor) => {
          if (profesor.codigoProfesor === profesorToEdit.codigoProfesor) {
            return {
              ...profesor,
              hasChanged: false,
              loading: false,
              statusMunicipio: "1",
            };
          } else return profesor;
        })
      );
      alert("Se actualizo exitosamente el PDF.");
      return;
    } else {
      alert("Hubo un problema al actualizar el PDF.");
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

  const downloadPdf = async (profesor) => {
    try {
      const response = await consultarCartaEvaluacion(profesor.idQr);
    } catch (error) {
      console.error(error);
      alert("Error al descargar el PDF");
    }
  };

  const handleDeleteProfesor = async (idQr, currentPage) => {
    const confirmDelete = window.confirm("¿Estas seguro que deseas eliminar el registro?");
    if (confirmDelete) {
      try {
        const response = await deleteOficioByIdQr(idQr);
        await getListProfesores({
          codigoEmpleado: localStorage.getItem("userName"),
          cicloEscolar: cicloEscolar,
          page: currentPage,
          app: "PruebasSpertoDigital",
        });
        return;
      } catch (error) {
        console.log(error);
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
      setTypeSortCode("desc");
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
      setTypeSortName("desc");
    }
    setListaProfesores(sortedList);
  };

  useEffect(() => {
    if (listaProfesores.length === 0) return;

    let sortedList = [...listaProfesores];

    // Ordenar por nombre si está activo
    if (typeSortName) {
      sortedList = sortedList.sort((a, b) =>
        typeSortName === "asc"
          ? a.nombreProfesor.localeCompare(b.nombreProfesor)
          : b.nombreProfesor.localeCompare(a.nombreProfesor)
      );
    }

    // Ordenar por código si está activo
    if (typeSortCode) {
      sortedList = sortedList.sort((a, b) =>
        typeSortCode === "asc"
          ? Number(a.codigoProfesor) - Number(b.codigoProfesor)
          : Number(b.codigoProfesor) - Number(a.codigoProfesor)
      );
    }

    setListaProfesores(sortedList);
    // eslint-disable-next-line
  }, [typeSortName, typeSortCode]); // Dependencias específicas

  return (
    <EvaluacionEstudianteContext.Provider
      value={{
        getListProfesores,
        isLoadingProfesores,
        listaProfesores,
        setListaProfesores,
        updateOficio,
        municipios,
        deleteOficioByIdQr,
        updateMateriasProfesor,
        handleMunicipioChange,
        editProfesor,
        handleDeleteProfesor,
        wasProfesorEdited,
        saveEditProfesor,
        handleNoOficioChange,
        generateNewPdf,
        updatePdf,
        downloadPdf,
        setCicloEscolar,
        cicloEscolar,
        selectedMunicipio,
        setSelectedMunicipio,
        toggleSortProfesorCodigo,
        toggleSortProfesorNombre,
        loading,
        setIsLoading,
        sizeListProfesor,
        setSizeListProfesor,
        fetchTotalSize,
        currentPage,
        totalPages,
        handleFirstPage,
        handleLastPage,
        setCurrentPage,
        cicloDisponible,
        ciclosEscolares,
        fetchCiclosEscolares,
        handleChangeSelect,
        handleNextPageLegacy,
        handlePreviousPageLegacy,
        modalIsOpen,
        setModalIsOpen,
        profesorData,
        setProfesorData,
        handleRowDoubleClick,
        handleGoFirstPage,
        handleGoLastPage,
        getAllMateriasProfesor,
        materiasList,
        setMateriaList,
        sortProfesorCodigo,
        sortProfesorNombre,
      }}
    >
      {children}
      <MateriaModal
        modalIsOpen={modalIsOpen}
        profesorData={profesorData}
        setModalIsOpen={setModalIsOpen}
        getAllMateriasProfesor={getAllMateriasProfesor}
        materiasList={materiasList}
        setMateriaList={setMateriaList}
        updateMateriasProfesor={updateMateriasProfesor}
      />
    </EvaluacionEstudianteContext.Provider>
  );
};

export default EvaluacionEstudianteProvider;
