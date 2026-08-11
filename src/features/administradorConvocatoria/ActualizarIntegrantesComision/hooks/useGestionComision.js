import { useEffect, useState } from "react";
import { responseAllIntegrantesComisionAdapter } from "../adapters";
import {
  createAndUpdateCommissions,
  getAllCommissions,
  getAllIntegrantesComision,
  getCopyIntegrantesComision,
} from "../services";
import { useContextUpdateMembers } from "./useContextUpdateMembers";

export const useGestionComision = () => {
  const [isDeIngreso, setIsDeIngreso] = useState(false);
  const [isNewList, setIsNewList] = useState(false);
  const [initialMembers, setInitialMembers] = useState([]);  // miembros iniciales
  const {
    state,
    toggleModal,
    setMembers,
    setPositions,
    setCommissions,
    successResponse,
    errorResponse,
    resetResponse,
    loadingResponse,
    setSelectedComision,
  } = useContextUpdateMembers();

  const handleNewList = () => {
    setIsNewList(true);
  };

  const resetMembersToInitial = () => {
    setMembers(initialMembers); // reset lista
  };

  const onGetAllIntegrantesComision = async () => {
    try {
      const data = await getAllIntegrantesComision(state.selectedCommission);
      setMembers(responseAllIntegrantesComisionAdapter(data).members);
      setPositions(responseAllIntegrantesComisionAdapter(data).positions);
      setInitialMembers(responseAllIntegrantesComisionAdapter(data).members); 
    } catch (error) {
      throw error;
    }
  };

  const onGetAllCommissions = async () => {
    try {
      const data = await getAllCommissions();
      setCommissions(data);
    } catch (error) {
      throw error;
    }
  };

  const onSaveAndUpdateMembersCommission = async () => {
    loadingResponse();
    try {
      const data = await createAndUpdateCommissions(
        state.members,
        state.selectedCommission
      );
      successResponse();
      await onGetAllIntegrantesComision();
    } catch (error) {
      errorResponse();
      console.log(error);
    } finally {
      setTimeout(() => {
        resetResponse();
      }, 2000);
    }
  };

  const onGetCopyMembersCommission = async () => {
    loadingResponse();

    try {
      const data = await getCopyIntegrantesComision(state.selectedCommission);
      setMembers(responseAllIntegrantesComisionAdapter(data).members);
      setPositions(responseAllIntegrantesComisionAdapter(data).positions);
    } catch (error) {
      errorResponse("No se encontro la comison anterior");
    } finally {
      setTimeout(() => {
        resetResponse();
      }, 2000);
    }
  };

  const handleIsDeIngreso = () => {
    setMembers([]);
    setSelectedComision(null);
    setIsDeIngreso(!isDeIngreso);
  };

  const returnCommissionsByIsDeIngreso = () => {
    if (!state.commissions) {
      return [];
    }

    return state.commissions[
      isDeIngreso ? "comisionIngreso" : "comisionEspecial"
    ];
  };

  const handleSelectedCommission = (e) => {
    const { value } = e.target;
    setIsNewList(false);
    setSelectedComision(value);
  };

  const getInfoCommissionSelected = () => {
    if (!state.selectedCommission) return;

    const commissionSelected = returnCommissionsByIsDeIngreso().find(
      // eslint-disable-next-line
      (item) => item.id == state.selectedCommission
    );

    return commissionSelected;
  };

  useEffect(() => {
    try {
      onGetAllCommissions();
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!state.selectedCommission) return;

    try {
      onGetAllIntegrantesComision();
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line
  }, [state.selectedCommission]);

  return {
    // properties
    ...state,
    isDeIngreso,
    isNewList,
    initialMembers,
    // methods
    toggleModal,
    handleIsDeIngreso,
    returnCommissionsByIsDeIngreso,
    handleSelectedCommission,
    handleNewList,
    onSaveAndUpdateMembersCommission,
    onGetCopyMembersCommission,
    getInfoCommissionSelected,
    resetMembersToInitial,
  };
};
