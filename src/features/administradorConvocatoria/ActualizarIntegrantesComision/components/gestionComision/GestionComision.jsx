import React from 'react';
import { MessageWarning } from '../../../components/MessageWarning';
import { useGestionComision } from '../../hooks/useGestionComision';
import FilterCommission from '../FilterCommission/FilterCommission';
import ListCommissionContent from '../ListCommissionContent/ListCommissionContent';
import { ContainerLayout } from '../../../../layout/ContainerLayout';

const GestionComision = ({ styles }) => {
    const {
        toggleModal,
        members,
        positions,
        handleIsDeIngreso,
        returnCommissionsByIsDeIngreso,
        handleSelectedCommission,
        selectedCommission,
        isNewList,
        initialMembers,
        handleNewList,
        onSaveAndUpdateMembersCommission,
        statusResponse,
        onGetCopyMembersCommission,
        getInfoCommissionSelected,
        resetMembersToInitial,
    } = useGestionComision();

    return (
        <ContainerLayout>
            <FilterCommission
                styles={styles}
                handleIsDeIngreso={handleIsDeIngreso}
                returnCommissionsByIsDeIngreso={returnCommissionsByIsDeIngreso}
                handleSelectedCommission={handleSelectedCommission}
            />

            {
                selectedCommission ? (
                    <ListCommissionContent
                        members={members}
                        positions={positions}
                        styles={styles}
                        toggleModal={toggleModal}
                        visible={isNewList}
                        handleNewList={handleNewList}
                        initialMembers={initialMembers}
                        guardarMembers={onSaveAndUpdateMembersCommission}
                        statusResponse={statusResponse}
                        getCopyMembersCommissions={onGetCopyMembersCommission}
                        infoCommission={getInfoCommissionSelected}
                        resetMembersToInitial={resetMembersToInitial}
                    />
                ) : (
                    <MessageWarning>Selecciona la comisión</MessageWarning>
                )
            }
        </ContainerLayout>
    )
}

export default GestionComision
