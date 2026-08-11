import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { memberDataAdapter } from "../adapters";
import { getNameByCode } from "../services";
import { useContextUpdateMembers } from "./useContextUpdateMembers";

export const useModal = () => {
    const { state, toggleModal, addMember } = useContextUpdateMembers();
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [infoByCode, setInfoByCode] = useState(null);
    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors },
        reset,
        getValues,
        setValue
    } = useForm();
    const codeWatcher = watch('codigo');

    const inputFields = [
        {
            type: 'text',
            id: 'codigo',
            placeholder: 'Ingrese el código',
            disable: false,
            register: {
                required: {
                    value: true,
                    message: 'Ingrese el código'
                }
            }
        },
        {
            type: 'text',
            id: 'trato',
            placeholder: 'Ingrese el trato',
            disable: false,
            register: {
                required: {
                    value: true,
                    message: 'Ingrese el trato'
                }
            }
        },
        {
            type: 'text',
            id: 'nombre',
            placeholder: 'Nombre',
            disable: true,
            register: {
                required: {
                    value: true,
                    message: 'Nombre no encontrado o no existe'
                }
            }
        },
        {
            type: 'text',
            id: 'departamento',
            placeholder: 'Ingrese el departamento',
            disable: false,
            register: {
                required: {
                    value: true,
                    message: 'Ingrese el departamento'
                }
            }
        }
    ]

    const onGetNameByCode = async () => {
        try {
            const code = getValues().codigo
            const res = await getNameByCode(code);
            setInfoByCode(res)
            setValue('nombre', res.nombre)
        } catch (error) {
            setValue('nombre', '')
        }
    }

    useEffect(() => {
        if (!codeWatcher) return
        if (typingTimeout) {
            clearErrors('nombre');
            clearTimeout(typingTimeout)
        }

        const timeout = setTimeout(() => {
            onGetNameByCode();
        }, 500);
        setTypingTimeout(timeout);
        return () => { clearTimeout(timeout) };
        // eslint-disable-next-line
    }, [codeWatcher]);


    const validateIfMemberExists = (data) => {
        const activeMembers = state.members.filter((item) => item.activo === true);
        // eslint-disable-next-line
        const memberFound = activeMembers.find((item) => item.codigo == data.codigo)
        const presidentMemberExist = activeMembers.find((item) => item.idCargo === 1)
        const secretaryMemberExist = activeMembers.filter((item) => item.idCargo === 2)
        const externMemberExist = activeMembers.filter((item) => item.idCargo === 4)
        const vocalMemberExist = activeMembers.filter((item) => item.idCargo === 3)

        // console.log("Member list from modal: ", activeMembers);

        if (memberFound) {
            setError('memberFound', {
                type: 'manual',
                message: 'El integrante ya se encuentra en la comisión'
            })
            setTimeout(() => {
                clearErrors('memberFound')
            }, 1000);
            return true
        }
     

        // if (vocalMemberExist.length >= 4 && Number(data.cargo) === 3) {
        //     setError('memberFound', {
        //         type: 'manual',
        //         message: 'Solo puede haber un máximo de 4 miembros vocal'
        //     })
        //     setTimeout(() => {
        //         clearErrors('memberFound')
        //     }, 1000);
        //     return true
        // }

        return false
    }


    // validate if the member belongs to the selected commission
    const validationCommission = () => {
        let commissionFound = null
        // eslint-disable-next-line
        commissionFound = state.commissions.comisionEspecial.find((item) => item.id == state.selectedCommission)
        if (!commissionFound) {
            // eslint-disable-next-line
            commissionFound = state.commissions.comisionIngreso.find((item) => item.id == state.selectedCommission)
        }

        if (infoByCode.dependencia !== commissionFound.siglas) {
            setError('cargo', {
                type: 'manual',
                message: 'El usuario debe de pertenecer a la comisión seleccionada'
            })
            setTimeout(() => {
                clearErrors('cargo')
            }, 1000);
            return true
        }

        return false
    }

    const onSaveMember = (data) => {
        if (validationCommission()) return
        if (validateIfMemberExists(data)) return

        const dataAdapted = memberDataAdapter(data)
        addMember(dataAdapted)
        toggleModal()
        reset()
        clearErrors()
    }

    return {
        // properties
        errors,
        register,
        state,
        inputFields,
        // methods
        onSaveMember,
        handleSubmit,
        toggleModal
    }
}