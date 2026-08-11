import React from 'react';
import { useModal } from '../../hooks/useModal';
import { MdOutlineCancel } from 'react-icons/md';


const Modal = ({ style }) => {
    const { errors, handleSubmit, onSaveMember, register, state, inputFields, toggleModal } = useModal()

    if (!state.isOpenModal) return null

    return (
        <div id="modal" className={style.modal}>
            <div className={style.modalContent}>
                <div className={style.modalHeader}>
                    <MdOutlineCancel onClick={toggleModal} className={style.closeIcon} />
                    <h3>Agregar miembro</h3>
                </div>
                <form onSubmit={handleSubmit(onSaveMember)}>
                    {
                        inputFields.map((item) => (
                            <div className={style.formGroup} key={item.id}>
                                <label htmlFor={item.id}>{item.id}</label>
                                <input
                                    {...register(item.id, item.register)}
                                    type="text"
                                    id={item.id}
                                    name={item.id}
                                    placeholder={item.placeholder}
                                    disabled={item.disable}
                                />
                                {
                                    errors[item.id] && <p className={style.ErrorText}>{errors[item.id]?.message}</p>
                                }
                            </div>
                        ))
                    }
                    <div className={style.formGroup}>
                        <label htmlFor="cargo">Cargo</label>
                        <select id="cargo" name="cargo" {...register('cargo', {
                            required: {
                                value: true,
                                message: 'Seleccione un cargo'
                            }, min: {
                                value: 1,
                                message: 'Seleccione un cargo'
                            }
                        })}>
                            <option value={0}>Selecciona un cargo</option>
                            {
                                state.positions.map((item) => (
                                    <option
                                        value={item?.id}
                                        key={item?.id}
                                    >
                                        {item?.descripcion || ''}
                                    </option>
                                ))
                            }
                        </select>
                        {
                            errors.cargo && <p className={style.ErrorText}>{errors?.cargo?.message}</p>
                        }
                    </div>

                    <button type="submit" className={style.acceptButton}>Aceptar</button>
                    {
                        errors.memberFound && <p className={style.ErrorText}>{errors?.memberFound?.message}</p>
                    }
                </form>
            </div>
        </div>


    )
}

export default Modal
