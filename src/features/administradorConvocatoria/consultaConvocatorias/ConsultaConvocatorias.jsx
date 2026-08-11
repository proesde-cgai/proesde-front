import React, { useEffect, useState } from "react";
import axios from "axios";
import AsideConsultaConvocatorias from "./AsideConsultaConvocatorias";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import Mensaje from "../../../reutilizable/components/Mensaje";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { useSearchStore } from "../../../store/useSearchStore";
import { DatosParticipanteHistoricos } from "./components/DatosParticipanteHistoricos";
import { Actas } from "../components/Actas";
import { getAccessToken } from "../../authService";
import styles from "../expediente/styles/expediente.module.css";
import selectStyles from "./ConsultaConvocatorias.module.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_HISTORICOS_CONVOCATORIA = `${API_BASE_URL}/api/v1/historicos/convocatoria`;
const API_SOLICITUDES_HISTORICOS = `${API_BASE_URL}/api/v1/solicitud-historicos`;
const HISTORICOS_PAGE_SIZE = 7;

const normalizeHistoricosResponse = (rawData, pageNumber = 0) => {
  let lista = [];
  let pagination = null;

  if (rawData.success && rawData.data) {
    const innerData = rawData.data;
    lista = Array.isArray(innerData.content)
      ? innerData.content
      : Array.isArray(innerData)
        ? innerData
        : [];
    pagination = innerData.content ? innerData : null;
  } else {
    lista = Array.isArray(rawData.content)
      ? rawData.content
      : Array.isArray(rawData)
        ? rawData
        : [];
    pagination = rawData.content ? rawData : null;
  }

  if (pagination) {
    return { lista, pagination };
  }

  return {
    lista,
    pagination: {
      content: lista,
      totalElements: lista.length,
      totalPages: lista.length > 0 ? 1 : 0,
      number: pageNumber,
      size: HISTORICOS_PAGE_SIZE,
      numberOfElements: lista.length,
      first: pageNumber === 0,
      last: true,
      empty: lista.length === 0,
      pageable: {
        pageNumber,
        pageSize: HISTORICOS_PAGE_SIZE,
      },
    },
  };
};

const ConsultaConvocatorias = () => {
  const { selectedDataAcademico } = useEvaluationStore();
  const hasSelected = useEvaluationStore((state) =>
    state.hasSelectedDataAcademico()
  );
  const resetSelectedDataAcademico = useEvaluationStore(
    (state) => state.resetSelectedDataAcademico
  );

  const setAcademicos = useSearchStore((state) => state.setAcademicos);
  const setPaginationRecords = useSearchStore(
    (state) => state.setPaginationRecords
  );
  const setHasSearched = useSearchStore((state) => state.setHasSearched);
  const setSearchLoading = useSearchStore((state) => state.setLoading);

  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState("");
  const [nombreConvocatoriaSeleccionada, setNombreConvocatoriaSeleccionada] = useState("");
  const [loadingConvocatorias, setLoadingConvocatorias] = useState(true);
  const [fullListHistoricos, setFullListHistoricos] = useState([]);
  const [codigoBusqueda, setCodigoBusqueda] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState({});

  useEffect(() => {
    const fetchConvocatorias = async () => {
      try {
        setLoadingConvocatorias(true);
        const token = await getAccessToken();
        const response = await axios.get(API_HISTORICOS_CONVOCATORIA, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Respuesta: [{ id, nombre, fechaInicio, fechaFin, ... }]
        const lista = Array.isArray(response.data) ? response.data : [];
        const ordenadasRecientePrimero = [...lista].sort(
          (a, b) => (b.id ?? 0) - (a.id ?? 0)
        );
        setConvocatorias(ordenadasRecientePrimero);
        if (ordenadasRecientePrimero.length > 0) {
          const primera = ordenadasRecientePrimero[0];
          setConvocatoriaSeleccionada((prev) =>
            prev || (primera.id != null ? String(primera.id) : "")
          );
          setNombreConvocatoriaSeleccionada((prev) =>
            prev || (primera.nombre ?? "")
          );
        }
      } catch (error) {
        console.error("Error al obtener históricos convocatoria:", error);
        setConvocatorias([]);
      } finally {
        setLoadingConvocatorias(false);
      }
    };
    fetchConvocatorias();
  }, []);

  useEffect(() => {
    const fetchSolicitudesHistoricas = async () => {
      if (!convocatoriaSeleccionada) {
        setAcademicos([]);
        setFullListHistoricos([]);
        setHasSearched(false);
        return;
      }

      try {
        setSearchLoading(true);
        setHasSearched(true);

        const token = await getAccessToken();
        const page = 0;
        const size = HISTORICOS_PAGE_SIZE;
        const url = `${API_SOLICITUDES_HISTORICOS}?page=${page}&size=${size}&idConvocatoria=${encodeURIComponent(
          convocatoriaSeleccionada
        )}&nombreConvocatoria=${encodeURIComponent(nombreConvocatoriaSeleccionada)}`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawData = response.data || {};
        const { lista, pagination } = normalizeHistoricosResponse(rawData, page);

        setAcademicos(lista);
        setFullListHistoricos(lista);
        setPaginationRecords(pagination);
      } catch (error) {
        console.error("Error al obtener solicitudes históricas:", error);
        setAcademicos([]);
        setFullListHistoricos([]);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchSolicitudesHistoricas();
  }, [
    convocatoriaSeleccionada,
    nombreConvocatoriaSeleccionada,
    setAcademicos,
    setHasSearched,
    setPaginationRecords,
    setSearchLoading,
  ]);

  const searchByHistoricoPage = async (pageNumber, codigo = codigoBusqueda, filters = advancedFilters) => {
    try {
      setSearchLoading(true);
      const token = await getAccessToken();
      const size = HISTORICOS_PAGE_SIZE;
      let url = `${API_SOLICITUDES_HISTORICOS}?page=${pageNumber}&size=${size}&idConvocatoria=${encodeURIComponent(convocatoriaSeleccionada)}&nombreConvocatoria=${encodeURIComponent(nombreConvocatoriaSeleccionada)}`;
      if (codigo) url += `&codigoAcademico=${encodeURIComponent(codigo)}`;
      if (filters.idDependencia) url += `&idDependencia=${encodeURIComponent(filters.idDependencia)}`;
      if (filters.idTipoParticipacion) url += `&idTipoParticipacion=${encodeURIComponent(filters.idTipoParticipacion)}`;
      if (filters.apellidoPaterno) url += `&apellidoPaterno=${encodeURIComponent(filters.apellidoPaterno)}`;
      if (filters.apellidoPaternoExcluye) url += `&apellidoPaternoExcluye=${encodeURIComponent(filters.apellidoPaternoExcluye)}`;
      if (filters.apellidoMaterno) url += `&apellidoMaterno=${encodeURIComponent(filters.apellidoMaterno)}`;
      if (filters.apellidoMaternoExcluye) url += `&apellidoMaternoExcluye=${encodeURIComponent(filters.apellidoMaternoExcluye)}`;
      if (filters.nombre) url += `&nombre=${encodeURIComponent(filters.nombre)}`;
      if (filters.nombreExcluye) url += `&nombreExcluye=${encodeURIComponent(filters.nombreExcluye)}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawData = response.data || {};
      const { lista, pagination } = normalizeHistoricosResponse(rawData, pageNumber);

      setAcademicos(lista);
      setFullListHistoricos(lista);
      setPaginationRecords(pagination);
    } catch (error) {
      console.error("Error al obtener página de histórico:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchByCodigo = (codigo) => {
    setCodigoBusqueda(codigo);
    setAdvancedFilters({});
    searchByHistoricoPage(0, codigo, {});
  };

  const handleSearchAdvanced = (criteria) => {
    const codigo = criteria.codigo || "";
    const filters = {
      idDependencia: criteria.idDependencia || null,
      idTipoParticipacion: criteria.idTipoParticipacion || null,
      apellidoPaterno: criteria.apellidoPaterno || "",
      apellidoPaternoExcluye: criteria.apellidoPaternoExcluye || "",
      apellidoMaterno: criteria.apellidoMaterno || "",
      apellidoMaternoExcluye: criteria.apellidoMaternoExcluye || "",
      nombre: criteria.nombre || "",
      nombreExcluye: criteria.nombreExcluye || "",
    };
    setCodigoBusqueda(codigo);
    setAdvancedFilters(filters);
    searchByHistoricoPage(0, codigo, filters);
  };

  const submenus = [
    {
      label: "Datos participante",
      element: <DatosParticipanteHistoricos />,
    },
    {
      label: "Consultar Documentos",
      element: <Actas isHistorico={true} />,
    },
  ];

  const menu = useMenu(submenus, {
    customClass: {
      menu: styles.menuContainer,
      menuOption: styles.menuOption,
      subMenuOption: styles.subMenuOption,
      selected: styles.selected,
    },
  });

  useEffect(() => {
    if (selectedDataAcademico && menu.resetToFirst) {
      menu.resetToFirst();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- solo resetear pestaña al cambiar académico; incluir menu provocaría re-ejecuciones innecesarias
  }, [selectedDataAcademico?.id]);

  useEffect(() => {
    resetSelectedDataAcademico();
  }, [resetSelectedDataAcademico]);

  return (
    <div className={styles.container}>
      <div className={styles.containerAside}>
        <div className={selectStyles.selectWrapper}>
          <select
            id="convocatoria-select"
            className={selectStyles.select}
            value={convocatoriaSeleccionada}
            onChange={(e) => {
              const selected = convocatorias.find((c) => String(c.id) === e.target.value);
              setConvocatoriaSeleccionada(e.target.value);
              setNombreConvocatoriaSeleccionada(selected?.nombre ?? "");
            }}
            disabled={loadingConvocatorias}
          >
            <option value="">
              {loadingConvocatorias ? "Cargando..." : "Seleccione una convocatoria"}
            </option>
            {convocatorias.map((conv) => (
              <option key={conv.id} value={String(conv.id)}>
                {conv.nombre}
              </option>
            ))}
          </select>
        </div>
        <AsideConsultaConvocatorias
          alias="consulta_convocatorias"
          fullListHistoricos={fullListHistoricos}
          onPageChange={searchByHistoricoPage}
          onSearchByCodigo={handleSearchByCodigo}
          onSearchAdvanced={handleSearchAdvanced}
        />
      </div>

      {hasSelected ? (
        <div className={styles.containerContent}>
          <div className={styles.containerMenu}>
            {selectedDataAcademico?.nombre && (
              <div className={styles.nombreAcademico}>
                <p>{`${selectedDataAcademico?.nombre} ${selectedDataAcademico?.apellidoPaterno} ${selectedDataAcademico?.apellidoMaterno}`}</p>
              </div>
            )}

            <div className={styles.menu}>
              <Menu menu={menu} />
              <div className={styles.optionMenu}>{menu.element}</div>
            </div>
          </div>
        </div>
      ) : (
        <Mensaje nombreModulo={"Consulta de convocatorias"} />
      )}
    </div>
  );
};

export default ConsultaConvocatorias;
