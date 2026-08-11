// RoleSelectionModal.js
import React, { useState, useEffect } from 'react';
import styles from './styles/RoleSelectionModal.module.css';
import { loginRoles } from '../features/authService';
import { useSearchStore } from '../store/useSearchStore';

const RoleSelectionModal = ({ open, roles, onClose, onConfirmRole }) => {
    const [selectedFormattedRole, setSelectedFormattedRole] = useState('');
    const [roleMappings, setRoleMappings] = useState({});

    useEffect(() => {
        if (roles && roles.length > 0) {
            // Crear un mapeo entre los roles originales y los roles formateados
            const mappings = roles.reduce((acc, role) => {
                acc[role] = formatRole(role);
                return acc;
            }, {});

            // Ordenar el mapeo alfabéticamente según el valor formateado
            const sortedMappings = Object.fromEntries(
                Object.entries(mappings).sort(([, a], [, b]) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
            );

            setRoleMappings(sortedMappings);
        }
    }, [roles]);

    // console.log("Roles existentes: ", roleMappings)

    // Función de ayuda para formatear los roles para la visualización
    const formatRole = (role) => {
        switch (role.toLowerCase()) {
            case "jefe_depto":
                return "Jefe de Departamento";
            case "admin_gral":
                return "Administración General";
            case "comision_dictaminadora_cu_ep":
                return "Comisión Dictaminadora CUEP";
            case "academico":
                return "Académico";
            case "comision_ingreso_promocion_personal_academico_sems":
                return "Comisión de Ingreso y Promoción del Personal Académico";
            case "comision_ingreso_promocion_personal_academico_h_cgu":
                return "Comisión de ingreso y promoción del personal académico del H. Consejo general universitario";
            case "comision_ingreso_promocion_personal_academico_cu_ep":
                return "⁠Comisión de ingreso y promoción del personal académico del consejo (CU y EP)";
            case "comision_especial_dictaminadora_sems":
                return "Comisión Especial Dictaminadora SEMS";
            case "comision_especial_dictaminadora_ag": //caso Comision AG
                return "Comisión Especial Dictaminadora AG";
            case "secretaria_general_cu_ep": //new
                return "Secretaría General CUEP";
            case "secretaria_escuelas_preparatorias": //secret prepa
                return "Secretaría Escuelas Preparatorias";
            case "secretaria_admin_sems":
                return "Secretaría Administrativa SEMS";
            case "secretaria_admin_cu":
                return "Secretaría Administrativa CU";
            case "contralor_gral":
                return "Contralor General";
            case "contralor_cu_sems":
                return "Contralor de Centro Universitario y SEMS";
            case "contralor_secretario_cgai":
                return "contralor_secretario_cga";
            default:
                return role; // Devolver tal cual si no está en la lista
        }

    };

    // Manejar el envío de la selección de rol
    const handleRoleSubmit = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const currentRole = localStorage.getItem('rol');

            // Obtener la clave original del rol a partir del mapeo
            const originalRole = Object.keys(roleMappings).find(
                (key) => roleMappings[key] === selectedFormattedRole
            );

            // Llamar a loginRoles para obtener nuevos tokens basados en el rol seleccionado
            const { roles: newRoles, rolesAsArray } = await loginRoles(token, originalRole);

            if (newRoles && rolesAsArray) {
                // Si el rol ha cambiado, resetear el formulario de búsqueda
                if (currentRole && currentRole !== originalRole.toLowerCase()) {
                    useSearchStore.getState().clearFormData();
                }
                
                // Confirmar el rol y proceder con la redirección
                onConfirmRole(originalRole);
            }

            onClose(); // Cerrar el modal tras la selección exitosa
        } catch (error) {
            console.error('Error al enviar el rol:', error);
            alert('Ocurrió un error al seleccionar el rol. Inténtelo de nuevo.');
        }
    };

    if (!open) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Selecciona un Rol</h2>
                <select
                    className={styles.select}
                    value={selectedFormattedRole}
                    onChange={(e) => setSelectedFormattedRole(e.target.value)}
                >
                    <option value="">-- Seleccionar Rol --</option>
                    {Object.values(roleMappings).map((formattedRole, index) => (
                        <option key={index} value={formattedRole} style={{ textTransform: 'capitalize' }}>
                            {formattedRole}
                        </option>
                    ))}
                </select>
                <button
                    className={styles.submitButton}
                    onClick={handleRoleSubmit}
                    disabled={!selectedFormattedRole} // Deshabilitar si no se ha seleccionado un rol
                >
                    Guardar
                </button>
            </div>
        </div>
    );
};

export default RoleSelectionModal;
