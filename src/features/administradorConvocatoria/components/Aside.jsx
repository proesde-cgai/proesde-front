import React, { useEffect, useState } from 'react';
import { useSearchStore } from '../../../store/useSearchStore';
import { useEvaluationStore } from '../../../store/useEvaluationStore';
import styles from './styles/Aside.module.css';
import Search from '../../../reutilizable/Search';
import TableSearch from '../../../reutilizable/TableSearch';
import { VscArrowBoth } from 'react-icons/vsc';
import iconAmarillo from '../../../assets/images/note-edit-icon_amarillo.png';
import icon from '../../../assets/images/note-edit-icon.png';
import FormModal from '../../../reutilizable/FormModal';
import { useCargaHorariaStore } from '../../../store/useCargaHorariaStore';
import Alert from "../../../reutilizable/Alert";


const Aside = ({ alias }) => {

    const { selectedDataAcademico, findAndSetDataAcademico } = useEvaluationStore();
    const { fetchCargaGlobal, } = useCargaHorariaStore();
    const { academicos, academicosComplete } = useSearchStore((state) => ({
        academicos: state.academicos,
        academicosComplete: state.academicosComplete
    }));

    const clearSearch = useSearchStore(state => state.clearSearch)
    const [isSelected, setIsSelected] = useState(0)
    const [showModal, setShowModal] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    
    const { loading, hasSearched } = useSearchStore((state) => ({
        loading: state.loading,
        hasSearched: state.hasSearched,
    }));


    useEffect(() => {
        clearSearch();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!loading && hasSearched && academicos.length === 0) {
            const delayTimer = setTimeout(() => {
                setShowAlert(true);

                // Oculta despues de 5s
                const autoHideTimer = setTimeout(() => {
                    setShowAlert(false);
                }, 5000);

                return () => clearTimeout(autoHideTimer);
            }, 1500); //espera 1.5 segundos para renderizar

            return () => clearTimeout(delayTimer);
        }
    }, [loading, academicos, hasSearched]);

    const handleClickAcademico = (id) => {
        console.log("selecciono academico")
        const dataAcademico = findAndSetDataAcademico(id, academicos);
        setIsSelected(dataAcademico.codigo);
        fetchCargaGlobal(dataAcademico.codigo);
    };

    const handleButtonClick = () => setShowTable((prev) => !prev);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    console.log(" academicos", academicos)

    return (
        <aside className={styles.aside}>
            <div className={styles.filters}>
                <div className={styles.filter_search}>
                    <Search aliasActividad={alias} />
                </div>

                <button className={styles.pBusquedaAvanzada} onClick={handleShowModal}>
                    Búsqueda avanzada
                </button>

                

                {showTable && (
                    <>
                        <div className={styles.backdrop} onClick={() => setShowTable(false)} />
                        <TableSearch participantes={academicos} />
                    </>
                )}
            </div>

            <div className={styles.containerList}>
                {showAlert && academicos.length === 0 && hasSearched ? (
                    <Alert typeAlert="error">
                        <p>{"La búsqueda no arroja resultados, intente con otro filtro o haga una búsqueda general sin filtros primero"}</p>
                    </Alert>
                ) :
                    (academicos?.map(academico => (
                        <div
                            key={academico.codigo}
                            className={isSelected === academico.codigo ? `${styles.isSelected} ${styles.item_list}` : `${styles.item_list}`}
                            onClick={() => handleClickAcademico(academico.id)}
                        >
                            <p className={styles.itemParrafo}>
                                <span>{academico.codigo}.</span> {academico.apellidoPaterno} {academico.apellidoMaterno} {academico.nombre} {academico.inconformidad ? <span style={{ color: 'crimson' }}>[INC]</span> : ''}
                                {academico.comentario && (
                                    <td>
                                        {academico.revisado ? (
                                            <img src={icon} alt="Icon" />
                                        ) : (
                                            <img src={iconAmarillo} alt="Icon" />
                                        )}
                                    </td>
                                )}

                            </p>
                            <p className={styles.parrafoSpan}>
                                <span
                                    className={academico.inconformidad ?
                                        (academico.respuestaInconformidad ?
                                            styles.eAtendido
                                            : styles.eVacio)
                                        : (academico.nivelRomano ?
                                            styles.eEvaluado
                                            : styles.eVacio)
                                    }
                                >
                                    {academico.nivelRomano || '-'}
                                </span>
                                <span className={styles.spanTipo}>[{academico.nombreParticipacion}]</span>
                            </p>
                        </div>
                    )))}

            </div>

            <FormModal show={showModal} onHide={handleCloseModal} aliasActividad={alias} />
        </aside>
    );
}

export default Aside;
