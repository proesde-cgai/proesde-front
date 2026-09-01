import React, { useState } from "react";
import { login } from "../../../../features/authService";
import styles from "./login.styles.module.css";
import { useNavigate } from "react-router-dom";
import RoleSelectionModal from "../../../../reutilizable/RoleSelectionModal";
import useFetchFecha from "../../hook/useFetchFecha";
import { getFechas } from "../../service/bannerService";
import { useSearchStore } from "../../../../store/useSearchStore";

export const LoginComponent = () => {
  const [usuario, setUsuario] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const clearFormData = useSearchStore.getState().clearFormData;
  const { fecha } = useFetchFecha();

  const [fechaRango, setFechaRango] = useState(() => {
    const savedFecha = localStorage.getItem("fecha");
    return savedFecha ? JSON.parse(savedFecha) : null;
  });

  const displayDate = fecha?.rangoFecha || "2024-2025";

  const [error, setError] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario || !fechaNacimiento) {
      setError("Todos los campos son obligatorios.");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      setIsSubmitting(true);
      try {
        // Llamar a la función de login y obtener roles
        const { rolesAsArray } = await login(usuario, fechaNacimiento);
        setError("");

        if (rolesAsArray.length > 1) {
          setRoles(rolesAsArray);
          setShowRoleModal(true);
        } else {
          handleRedirection(rolesAsArray[0]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsSubmitting(false);
        setTimeout(() => {
          setError("");
        }, 10000);
        clearFormData();
      }
    }
  };

  // Función para manejar la redirección basada en el rol seleccionado
  const handleRedirection = async (selectedRole) => {
    console.log("Redirigiendo para el rol:", selectedRole);

    const currentRole = localStorage.getItem("rol");
    const newRole = selectedRole.toLowerCase();
    
    console.log("rol ", newRole);
    
    // Si el rol ha cambiado, resetear el formulario de búsqueda
    if (currentRole && currentRole !== newRole) {
      useSearchStore.getState().clearFormData();
    }
    
    localStorage.setItem("rol", newRole);

    try {
      if (!localStorage.getItem("fecha")) {
        const fetchedFecha = await getFechas();
        setFechaRango(fetchedFecha);
        localStorage.setItem("fecha", JSON.stringify(fetchedFecha));
      }
    } catch (error) {
      console.error("Error fetching fecha:", error);
      setError("Error al obtener la fecha de convocatoria.");
    } finally {
      setTimeout(() => {
        setError("");
      }, 3000);
    }

    switch (selectedRole.toLowerCase()) {
      case "academico":
        console.log("Navegando a /llenar-solicitud");
        navigate("/llenar-solicitud");
        break;

      case "admin_gral":
        console.log("Navegando a /administrador_sitio");
        navigate("/administrador_sitio");
        break;
      case "comision_dictaminadora_cu_ep":
        console.log("Navegando a /reportes");
        navigate("/administracion");
        break;
      case "jefe_depto":
        console.log("Navegando a /jefe_departamento");
        navigate("/jefe_departamento");
        break;
      case "admin_convocatoria":
        console.log("Navegando a /administrador-convocatoria");
        navigate("/administrador-convocatoria");
        break;
      case "secretaria_escuelas_preparatorias":
        console.log("Navegando a /secretaria_escuelas_preparatorias");
        navigate("/secretaria_escuelas_preparatorias");
        break;
      case "secretaria_admin_cu":
        console.log("Navegando a /secretaria_admin_cu");
        navigate("/secretaria_admin_cu");
        break;
      case "secretaria_admin_sems":
        console.log("Navegando a /secretaria_admin_sems");
        navigate("/secretaria_admin_sems");
        break;
      case "comision_especial_dictaminadora_ag":
        console.log("Navegando a /comision_especial_dictaminadora_ag");
        navigate("/comision_especial_dictaminadora_ag");
        break;
      case "comision_especial_dictaminadora_sems":
        console.log("Navegando a /comision_especial_dictaminadora_sems");
        navigate("/comision_especial_dictaminadora_sems");
        break;

      case "comision_ingreso_promocion_personal_academico_sems":
        console.log("nevegando a /comision_ingreso_promocion_personal_academico_sems");
        navigate("/comision_ingreso_promocion_personal_academico_sems");
        break;

      case "comision_ingreso_promocion_personal_academico_h_cgu":
        console.log("nevegando a /comision_ingreso_promocion_personal_academico_h_cgu");
        navigate("/comision_ingreso_promocion_personal_academico_h_cgu");
        break;

      case "comision_ingreso_promocion_personal_academico_cu_ep":
        console.log("Navegando a /comision_ingreso_promocion_personal_academico_cu_ep");
        navigate("/comision_ingreso_promocion_personal_academico_cu_ep");
        break;

      case "contralor_cu_sems":
        console.log("Navegando a /contralor_cu_sems");
        navigate("/contralor_cu_sems");
        break;
      case "contralor_gral":
        console.log("Navegando a la vista de /contralor_gral");
        navigate("/contralor_gral");
        break;
      case "hack_academico":
        console.log("Navegando a la vista de /hack_academico");
        navigate("/hack_academico");
        break;
      case "contralor_secretario_cgai":
        console.log("Navegando a la vista de /contralor_secretario_cgai");
        navigate("/contralor_secretario_cgai");
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        {/* Título de Bienvenida */}
        <div className={styles.welcomeSection}>
          <p className={styles.welcomeText}>
            Bienvenido al Programa de
            <br />
            <span className={styles.proesdeTitle}>
              Estímulos al Desempeño Docente (PROESDE){" "}
              <span className={styles.dateHighlight}>{displayDate}</span>
            </span>
          </p>
        </div>

        {/* Tarjeta de Formulario de Login */}
        <div className={styles.loginWrapper}>
          <div className={styles.loginHeader}>
            <p className={styles.loginHeaderText}>
              Para ingresar al sistema por favor proporcione su usuario y contraseña
            </p>
          </div>

          <div className={styles.loginBody}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <div className={styles.labelWrapper}>
                  <label htmlFor="usuario" className={styles.formLabel}>
                    USUARIO / CÓDIGO
                  </label>
                  <span className={styles.inputHint}>
                    (Su código, si es académico)
                  </span>
                </div>
                <input
                  id="usuario"
                  type="text"
                  className={styles.formInput}
                  placeholder="Ingrese su usuario o código"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.labelWrapper}>
                  <label htmlFor="fecha_nacimiento" className={styles.formLabel}>
                    CONTRASEÑA
                  </label>
                  <span className={styles.inputHint}>
                    (Contraseña)
                  </span>
                </div>
                <input
                  id="fecha_nacimiento"
                  type="password"
                  className={styles.formInput}
                  placeholder="••••••••••••"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  maxLength={16}
                  title="Máximo 16 caracteres"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div
                  className={styles.errorMessage}
                  dangerouslySetInnerHTML={{ __html: error }}
                ></div>
              )}

              <div className={styles.buttonRow}>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Ingresando..." : "Ingresar"}
                </button>
              </div>

              {/* Mensaje de dudas y soporte integrado */}
              <div className={styles.cardDivider}></div>
              <div className={styles.cardContactBox}>
                <p className={styles.cardContactText}>
                  ¿Tienes algún problema con el sistema?{" "}
                  <a
                    href="https://script.google.com/macros/s/AKfycby-fPIycs9-u0DEA0eShKeyweSHQhJ6O3I-xngFayUG0_PFJE7Sqkn8_17l-ZU-CvUO2w/exec"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardEmailLink}
                  >
                    Solicita ayuda aquí.
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Sección Informativa CGAI */}
        <div className={styles.cgaiSection}>
          <p className={styles.cgaiText}>
            Si desea consultar la convocatoria, tabla de puntaje y reglamento del PROESDE,
            <br />
            puede hacerlo mediante el portal de la CGAI:
          </p>
          <a
            href="https://proesde.udg.mx/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cgaiButton}
          >
            Coordinación General Académica y de Innovación
          </a>
        </div>
      </div>

      <RoleSelectionModal
        open={showRoleModal}
        roles={roles}
        onClose={() => setShowRoleModal(false)}
        onConfirmRole={(selectedRole) => {
          setShowRoleModal(false);
          handleRedirection(selectedRole);
        }}
      />
    </div>
  );
};
