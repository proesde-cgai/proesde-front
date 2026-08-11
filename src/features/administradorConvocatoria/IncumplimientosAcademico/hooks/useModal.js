import { breachesResponseAdapter } from "../adapters/academicAdapter";
import { initialResponseState } from "../data";
import { deleteBreaches } from "../services/deleteBreaches";
import { getInfoAcademicoService } from "../services/getInfoAcademico";
import { saveBreaches } from "../services/saveBreacher";
import { updateBreaches } from "../services/updateBreaches";
import { useIncumplimientoContext } from "./useIncumplimientoContext";

export const useModal = () => {
  const { data, toggleModal, setResponse, setBreaches, setAcademic, resetBreaches, setBreachesToDelete } =
    useIncumplimientoContext();

  const textTitle = data.modal.action === "delete" ? "Eliminar" : "Procesar";

  const getRestBreaches = (restBreachesResponse) => {
    const idsNewBreachesToDelete = data.breachesToDelete.map((breach) => {
      return breach.new ? breach.id : null;
    });

    const restBreachesToDelete = restBreachesResponse.filter(
      (breach) => !idsNewBreachesToDelete.includes(breach.id)
    );

    return restBreachesToDelete;
  };

  const onDeleteBreach = async () => {
    if (data.breachesToDelete.length === 0) return;
    setResponse({ loading: true });

    const idBreaches = data.breachesToDelete
      .filter((breach) => !breach.new)
      .map((breach) => breach.id);
    const body = { idSolicitud: data.academic.id, ids: idBreaches };

    try {
      const response = await deleteBreaches(body);
      const { resultado } = response;

      const restBreachesResponse = data.breaches.filter(
        (breach) => !getIdsBreachToDelete(resultado).includes(String(breach.id))
      );

      setBreaches(getRestBreaches(restBreachesResponse));
      setBreachesToDelete([]);

      toggleModal("");
      setResponse({
        ...initialResponseState,
        message: "Se eliminaron los incumplimientos",
      });
    } catch (error) {
      setResponse({
        ...initialResponseState,
        error: true,
        message: "Ocurrió un error al eliminar los incumplimientos",
      });
    } finally {
      const timer = setTimeout(() => {
        setResponse(initialResponseState);
      }, 3000);

      return () => clearTimeout(timer);
    }
  };

  const getIdsBreachToDelete = (res) => {
    const idBreachesToDelete = Object.keys(res).filter((key) =>
      Number(res[key] === "Eliminado con exito")
    );

    return idBreachesToDelete;
  };

  const onSaveBreach = async () => {
    setResponse({ loading: true });
    const codeAcademic = data.academic.code;

    const bodyToUpdate = {
      codigo: codeAcademic,
      valoresActualizar: data.breachesToUpdate.map((breach) => {
        return {
          valorActual: breach.initialValue,
          nuevoValor: breach.idCondition,
        };
      }),
    };

    const newConditions = data.breaches.filter((breach) => breach.new === true);
    const bodyToSave = {
      codigo: codeAcademic,
      idsTipoCondicionado: newConditions.map(
        (condition) => condition.idCondition
      ),
    };

    try {
      bodyToUpdate.valoresActualizar.length > 0 &&
      (await updateBreaches(bodyToUpdate));

      bodyToSave.idsTipoCondicionado.length > 0 &&
      (await saveBreaches(bodyToSave));

      resetBreaches();

      const res = await getInfoAcademicoService(codeAcademic);
      setBreaches(breachesResponseAdapter(res));
      
      toggleModal("");

      setResponse({
        ...initialResponseState,
        message: "Se guardaron los incumplimientos",
      });
    } catch (error) {
      setResponse({
        ...initialResponseState,
        error: true,
        message: error.message,
      });
    } finally {
      const timer = setTimeout(() => {
        setResponse(initialResponseState);
      }, 3000);

      return () => clearTimeout(timer);
    }
  };

  const onSubmitAction = () => {
    if (data.modal.action === "delete") {
      onDeleteBreach();
    } else {
      onSaveBreach();
    }
  };

  return {
    // properties
    data,
    textTitle,
    // methods
    onSubmitAction,
    toggleModal,
  };
};
