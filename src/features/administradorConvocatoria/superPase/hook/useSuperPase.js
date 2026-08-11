import { useEffect, useState } from "react";
import {
  getAcademico,
  updateSuperPase,
  getHistorialSuperPase,
} from "../service";

export const useSuperPase = () => {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [academico, setAcademico] = useState(null);
  const [superPase, setSuperPase] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [requisitosIds, setRequisitosIds] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState([]);
  // estados temporales para guardar/restaurar al alternar Sí/No
  const [savedRequisitos, setSavedRequisitos] = useState([]);
  const [savedMotivo, setSavedMotivo] = useState("");
  // indica si al cargar el académico el superpase venía activo
  const [originalSuperPase, setOriginalSuperPase] = useState(false);

  const handleSubmitCodigo = async (event) => {
    event.preventDefault();
    setAcademico(null);
    setError("");
    setLoading(true);
    setSuperPase(false);
    // limpiar campos controlados para evitar que persistan entre búsquedas
    setMotivo("");
    setRequisitosIds([]);
    setHistorial([]);
    setIsVisible(false);

    try {
      if (!codigo.trim()) throw new Error("Campo obligatorio");

      const response = await getAcademico(codigo);
      setAcademico(response);
      setSuperPase(response.superpase);
      setOriginalSuperPase(!!response.superpase);
      // Si el backend indica que el superpase está activo, bloqueamos la edición
      // y cargamos la última activación del historial para prefijar motivo y requisitos.
      console.log(response.requisitos);
      setIsLocked(!!response.superpase);
      // Inicializar requisitos (no seleccionar ninguno por defecto)
      // Mantener la lista de requisitos en `academico` para renderizar,
      // pero dejar `requisitosIds` vacío para que ningún checkbox aparezca marcado.
      // Esto evita seleccionar todos los requisitos al cargar el académico.
      // Si en el futuro se desea seleccionar algunos por defecto, ajustar aquí.
      // (requisitos disponibles en `response.requisitos` o `response.requisitos.requisitos`)
      setRequisitosIds([]);

      if (response.superpase) {
        try {
          const dataHist = await fetchHistorial(codigo);
          if (Array.isArray(dataHist) && dataHist.length > 0) {
            // Filtrar solo activaciones (activated:true)
            const activaciones = dataHist.filter(
              (h) =>
                h &&
                (h.activated === true ||
                  h.activated === "true" ||
                  h.activated === 1)
            );
            if (activaciones.length > 0) {
              // Seleccionar la última por fecha+hora (si están disponibles)
              let last = activaciones[0];
              const toDate = (item) => {
                try {
                  if (!item) return new Date(0);
                  const fecha = item.fecha || "";
                  const hora = item.hora || "00:00:00";
                  // Intentar crear ISO datetime
                  const dt = new Date(`${fecha}T${hora}`);
                  if (isNaN(dt.getTime())) return new Date(0);
                  return dt;
                } catch (e) {
                  return new Date(0);
                }
              };

              activaciones.forEach((a) => {
                if (toDate(a) > toDate(last)) last = a;
              });

              // Prefijar motivo y requisitosIds según la última activación
              const lastRequisitos = Array.isArray(last.requisitos)
                ? last.requisitos.map((r) => r.id)
                : [];
              setMotivo(last.motivo || "");
              setRequisitosIds(lastRequisitos);
              // también guardarlas para poder restaurarlas si el usuario
              // desactiva y vuelve a activar en la misma sesión
              setSavedMotivo(last.motivo || "");
              setSavedRequisitos(lastRequisitos);
              // Mantener isLocked true (vista sólo lectura)
              setIsLocked(true);
            }
          }
        } catch (err) {
          // Si falla al obtener historial, no bloquear la edición por completo
          // pero mantener la indicación del superpase.
          setIsLocked(true);
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    // Si el formulario está bloqueado por una activación existente, no enviar nada
    if (isLocked) {
      setLoading(false);
      return {
        success: false,
        message: "No se puede enviar: el registro está bloqueado",
      };
    }

    try {
      // conservar valores actuales por si queremos reaplicarlos después del refresh
      const prevRequisitos = Array.isArray(requisitosIds)
        ? requisitosIds.slice()
        : [];
      const prevMotivo = motivo;
      // Construir payload según contrato del endpoint
      const payload = { activar: superPase };

      if (superPase) {
        // validar motivo y requisitosIds antes de enviar
        if (!motivo || typeof motivo !== "string" || motivo.trim() === "") {
          throw new Error("Al activar se requiere un motivo");
        }

        if (!Array.isArray(requisitosIds) || requisitosIds.length === 0) {
          throw new Error("Al activar se requieren los ids de los requisitos");
        }

        payload.motivo = motivo;
        payload.requisitosIds = requisitosIds;
      }

      const resp = await updateSuperPase(codigo, payload);
      // do not toggle global visible or set hook-level error here
      // Refresh academic data and historial so UI reflects server state
      try {
        const refreshed = await getAcademico(codigo);
        setAcademico(refreshed);
        setSuperPase(refreshed.superpase);
        setOriginalSuperPase(!!refreshed.superpase);
        setIsLocked(!!refreshed.superpase);
        // Mantener las selecciones si acabamos de activar; limpiar si desactivamos
        if (payload.activar) {
          setRequisitosIds(prevRequisitos);
          setMotivo(prevMotivo || "");
        } else {
          setRequisitosIds([]);
          setMotivo("");
        }
      } catch (refreshErr) {
        // ignore refresh errors — still return success
        // console.warn('refresh after update failed', refreshErr);
      }

      try {
        await fetchHistorial(codigo);
      } catch (err) {
        // ignore
      }

      return { success: true, data: resp };
    } catch (error) {
      // return error to caller instead of setting hook-level error
      return {
        success: false,
        message: error.message || "Error al enviar el formulario",
      };
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorial = async (codigoConsulta) => {
    try {
      const codigoFinal = codigoConsulta || codigo;
      if (!codigoFinal) throw new Error("Código requerido");
      const data = await getHistorialSuperPase(codigoFinal);
      setHistorial(data);
      return data;
    } catch (error) {
      setError(error.message);
      return [];
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isVisible]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const onChange = (e) => {
    if (!e.target.name) {
      // Solo permitir números en el campo de código
      const value = e.target.value;
      const numericValue = value.replace(/[^0-9]/g, '');
      setCodigo(numericValue);
      return;
    }

    // manejador para radios de superpase (nombres anteriores: superPaseSi/superPaseNo)
    if (e.target.name === "superPaseSi") {
      // Usuario está activando manualmente -> permitir edición
      setSuperPase(true);
      // si originalmente venía activo, mantener bloqueo (solo mostrar)
      setIsLocked(!!originalSuperPase);
      // Si el superpase venía activo al cargar y tenemos valores guardados,
      // restaurarlos cuando el usuario vuelva a activar
      if (originalSuperPase) {
        if (Array.isArray(savedRequisitos) && savedRequisitos.length > 0)
          setRequisitosIds(savedRequisitos.slice());
        if (savedMotivo) setMotivo(savedMotivo);
      }
      return;
    }
    if (e.target.name === "superPaseNo") {
      // Al desactivar: guardar las selecciones actuales para poder restaurarlas
      // si el usuario vuelve a activar (solo en la sesión actual)
      setSavedRequisitos(
        Array.isArray(requisitosIds) ? requisitosIds.slice() : []
      );
      setSavedMotivo(motivo || "");
      // Al desactivar superPase, asegurarse de que no queden requisitos seleccionados
      setSuperPase(false);
      setRequisitosIds([]);
      setMotivo("");
      setIsLocked(false);
      return;
    }

    // si los radios usan name="superPase"
    if (e.target.name === "superPase") {
      const isActive = e.target.value === "true";
      setSuperPase(isActive);
      // Bloquear solo si se vuelve a activar Y originalmente venía activo
      // Si se desactiva, permitir edición (para poder enviar la desactivación)
      setIsLocked(isActive && !!originalSuperPase);
      if (!isActive) {
        // guardar antes de limpiar
        setSavedRequisitos(
          Array.isArray(requisitosIds) ? requisitosIds.slice() : []
        );
        setSavedMotivo(motivo || "");
        setRequisitosIds([]);
        setMotivo("");
      } else {
        // volver a activar: restaurar si correspondía originalmente
        if (originalSuperPase) {
          if (Array.isArray(savedRequisitos) && savedRequisitos.length > 0)
            setRequisitosIds(savedRequisitos.slice());
          if (savedMotivo) setMotivo(savedMotivo);
        }
      }
      return;
    }

    // motivo
    if (e.target.name === "motivo") return setMotivo(e.target.value);

    // manejo de requisitos individuales (checkboxes con name `requisito_<id>`)
    if (e.target.name && e.target.name.startsWith("requisito_")) {
      const id = parseInt(e.target.name.replace("requisito_", ""), 10);
      if (Number.isNaN(id)) return;
      setRequisitosIds((prev) => {
        if (e.target.checked) return Array.from(new Set([...prev, id]));
        return prev.filter((x) => x !== id);
      });
      return;
    }
  };

  return {
    // properties
    codigo,
    error,
    academico,
    superPase,
    motivo,
    requisitosIds,
    historial,
    isVisible,
    loading,
    isLocked,
    originalSuperPase,
    // methods
    handleSubmitCodigo,
    handleFormSubmit,
    fetchHistorial,
    onChange,
    // setters (expuestos para uso desde componentes hijos)
    setCodigo,
    setError,
    setAcademico,
    setSuperPase,
    setMotivo,
    setRequisitosIds,
  };
};
