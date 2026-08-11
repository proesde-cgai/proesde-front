import { useEffect, useState } from "react";
import {
  getAreaConocimientoService,
  getDependenciasService,
  getGradoService,
  getMunicipiosService,
  getNivelesEducativosService,
  getNombramientosService,
  getPrefilledService,
  getProgramasEducativosService,
} from "../services";
import { dataPrefilledAdapter } from "../adapters";

const initialState = {
  codigo: null,
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  rfc: "",
  CURP: "",
  ultimogrado: {},
  nombregradoacademico: "",
  institucionOtorgante: "",
  correo: "",
  correoProesde: null,
  telefono: "",
  telefonoMovil: "",
  nacionalidad: "",
  entidadFederativa: "",
  nombramiento: null,
  dependencia: null,
  municipio: null,
  fechaDeIngreso: null,
  antiguedad: null,
  PuestoDirectivo: false,
  areaConocimiento: null,
  departamento: "",
  nombreJefeDepto: "",
  textoAclarativo: "",
  todosCamposCorrectos: "",
  cargaGlobal: [],
  nivelEducativo: {},
  fechaNacimientoFormato: "",
};

export const useGetData = () => {
  const [grados, setGrados] = useState([]);
  const [areaEditable, setAreaEditable] = useState(false);
  const [programas, setProgramas] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [nombramientos, setNombramientos] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0.0);
  const [municipios, setMunicipios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [jefes, setJefes] = useState([]);

  const getMunicipios = async () => {
    try {
      const response = await getMunicipiosService();
      const sortedMunicipios = response.sort((a, b) =>
        a.municipio.localeCompare(b.municipio, "es", { sensitivity: "base" })
      );

      setMunicipios(sortedMunicipios);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getGrado = async () => {
    try {
      const response = await getGradoService();

      setGrados(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getPrefilled = async () => {
    try {
      const response = await getPrefilledService();

      // Todo: Esto es en otro lugar
      const prefilledAdapter = dataPrefilledAdapter(response);
      setFormData({ ...formData, ...prefilledAdapter });

      const total = response.cargaGlobal.reduce((total, item) => {
        return total + parseFloat(item.cargaHoraria || 0);
      }, 0);

      setTotal(total);

      if (!response.datosSep.idAreaConocimiento) setAreaEditable(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const getProgramasEducativos = async () => {
    try {
      const response = await getProgramasEducativosService();
      setProgramas(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAreaConocimiento = async () => {
    try {
      const response = await getAreaConocimientoService();
      setAreas(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getNivelesEducativos = async () => {
    try {
      const response = await getNivelesEducativosService();
      console.log("🚀 ~ getNivelesEducativos ~ response:", response);
      setNiveles(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getNombramientos = async () => {
    try {
      const response = await getNombramientosService();
      setNombramientos(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDependencias = async () => {
    try {
      const response = await getDependenciasService();
      const { dependencias, departamentos, jefesDepartamento } = response.data;
      const mappedDepartamentos =
        departamentos && departamentos.length > 0
          ? departamentos.map((departamento, index) => ({
              id: index + 1,
              departamento: departamento,
            }))
          : [];

      const mappedJefes =
        jefesDepartamento && jefesDepartamento.length > 0
          ? jefesDepartamento.map((jefe, index) => ({
              id: index + 1,
              jefe: jefe,
            }))
          : [];

      setDependencias(dependencias || []);
      setDepartamentos(mappedDepartamentos);
      setJefes(mappedJefes);

      setFormData((prevData) => ({
        ...prevData,
        dependencia:
          dependencias?.length === 1
            ? dependencias[0].id
            : prevData.dependencia,
        departamento:
          mappedDepartamentos.length === 1
            ? mappedDepartamentos[0].departamento
            : prevData.departamento,
        nombreJefeDepto:
          mappedJefes.length === 1
            ? mappedJefes[0].jefe
            : prevData.nombreJefeDepto,
      }));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getMunicipios();
    getGrado();
    getPrefilled();
    getProgramasEducativos();
    getAreaConocimiento();
    getNivelesEducativos();
    getNombramientos();
    getDependencias();
    // eslint-disable-next-line
  }, []);

  return {
    dependencias,
    nombramientos,
    niveles,
    areas,
    programas,
    total,
    grados,
    municipios,
    areaEditable,
    departamentos,
    jefes
  };
};
