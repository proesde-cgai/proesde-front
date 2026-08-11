import { create } from "zustand";
import { persist } from "zustand/middleware";

const formDataDefault = {
  dependencia: null,
  codigo: null,
  apellidoPaterno: null,
  apellidoMaterno: null,
  nombre: null,
  grado: null,
  nombramiento: null,
  municipio: null,
  tipoDeParticipacion: null,
  concursante: null,
  por: null,
  deManera: null,
  mostrar: null,
  apellidoPaternoInput: null, // added
  apellidoMaternoInput: null, // added
  nombreInput: null,
  idStatusSolicitud: null,
}

export const useSearchStore = create(
  persist(
    (set, get) => ({
      academicos: [],
      paginationRecords: {
        pageable: {
          pageNumber: 0,
          pageSize: 0,
          sort: {
            sorted: false,
            empty: false,
            unsorted: false,
          },
          offset: 0,
          paged: false,
          unpaged: false,
        },
        totalPages: 0,
        totalElements: 0,
        last: false,
        size: 0,
        number: 0,
        sort: {
          sorted: false,
          empty: false,
          unsorted: false,
        },
        numberOfElements: 0,
        first: false,
        empty: false,
      },
      formData: formDataDefault,
      lastSearchBody: null,
      setLastSearchBody: (body) => set({ lastSearchBody: body }),
      query: "",
      setQuery: (query) => set({ query: query }),
      loading: false,
      hasSearched: false,
      setAcademicos: (array) => set({ academicos: array, loading: false }),
      setPaginationRecords: (pagination) => set({ paginationRecords: pagination }),
      setLoading: (isLoading) => set({ loading: isLoading }),
      setHasSearched: (value) => set({ hasSearched: value }),
      setPageNumber: (pageNumber) => set((state) => ({
        paginationRecords: {
          ...state.paginationRecords,
          pageable: {
            ...state.paginationRecords.pageable,
            pageNumber: pageNumber
          },
          number: pageNumber
        }
      })),
      updateAcademicoStatus: (id, nuevoStatus, nuevoStatusDescripcion) =>
        set((state) => ({
          academicos: state.academicos.map((academico) =>
            academico.id === id
              ? { ...academico, status: nuevoStatus, statusDescripcion: nuevoStatusDescripcion }
              : academico
          ),
        })),
      setFormData: (formData) => set({ formData: formData }),
      clearFormData: () => set({ formData: formDataDefault, query: "" }),
      clearSearch: () =>
        set({
          academicos: [],
          loading: false,
          hasSearched: false,
          paginationRecords: {
            pageable: {
              pageNumber: 0,
              pageSize: 0,
              sort: {
                sorted: false,
                empty: false,
                unsorted: false,
              },
              offset: 0,
              paged: false,
              unpaged: false,
            },
            totalPages: 0,
            totalElements: 0,
            last: false,
            size: 0,
            number: 0,
            sort: {
              sorted: false,
              empty: false,
              unsorted: false,
            },
            numberOfElements: 0,
            first: false,
            empty: false,
          }

        }),
    }),
    { name: "search-storage" } // Optional: name for persistence
  )
);
