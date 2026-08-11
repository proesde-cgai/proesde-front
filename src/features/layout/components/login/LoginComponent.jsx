import React, { useState, useEffect } from "react";
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
      }finally {
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
    }finally {
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
        console.log("nevegando a /comision_ingreso_promocion_personal_academico_sems")
        navigate("/comision_ingreso_promocion_personal_academico_sems");
        break;

      case "comision_ingreso_promocion_personal_academico_h_cgu":
        console.log("nevegando a /comision_ingreso_promocion_personal_academico_h_cgu")
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
      /* default:
        console.log("Navegando a /default-dashboard");
        navigate("/default-dashboard");
        break; */
    }
  };

  // useEffect(() => {
  //   if (error) {
  //     const timer = setTimeout(() => {
  //       setError(""); // Limpiar el error después de 3 segundos
  //     }, 10000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [error]);
  
  return (
    <div>
      <div className={styles.main}>
        <p className={styles.text}>
          Bienvenido al Programa de
          <br />
          <span className={styles.fontxl}>
            Estímulos al Desempeño Docente (PROESDE) {displayDate}
          </span>
        </p>

        <div className={styles.login_container_head}>
          <span className={styles.textlogin}>
            Para ingresar al sistema por favor proporcione su usuario y contraseña
          </span>
        </div>

        <div className={styles.login_container}>
          <form onSubmit={handleSubmit}>
            <div className={styles["form-group"]}>
              <label htmlFor="usuario" className={styles.label}>
                USUARIO / CÓDIGO
              </label>
              <div className={styles.formplace}>
                <input
                  id="usuario"
                  type="text"
                  className={styles.input}
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
                <span className={styles.placeholder}>(Su código, si es académico)</span>
              </div>
            </div>
            <div className={styles["form-group"]}>
              <label htmlFor="fecha_nacimiento" className={styles.label}>
                CONTRASEÑA
              </label>
              <div className={styles.formplace}>
                <input
                  id="fecha_nacimiento"
                  type="password"
                  className={styles.input}
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  placeholder=""
                  maxLength={16}
                  title="Maximo 16 caracteres"
                />
                <span className={styles.placeholder}>(Contraseña)</span>
              </div>
            </div>
            <div className={styles["button-container"]}>
              <button className={styles.button}>Ingresar</button>
            </div>

            {error && (
              <div
                className={styles.error}
                dangerouslySetInnerHTML={{ __html: error }}
              ></div>
            )}          
          </form>
        </div>

        <div className={styles.infoSection}>
          <p className={styles.infoText}>
            Si desea consultar la convocatoria, tabla de puntaje y reglamento del PROESDE,<br />
            puede hacerlo mediante el portal de la CGAI:
          </p><br />
          <button className={styles.infoButton}>
            <a href="https://proesde.udg.mx/">
            Coordinación General Académica y de Innovación
            </a>
          </button>
        </div>

        <div className={styles.contactSection}>
          <p className={styles.contactInfo}>
            Cualquier duda o inquietud referente al sistema o <br /> 
            a la convocatoria PROESDE, favor de comunicarse <br />
            vía correo electrónico a: <a href="mailto:proesde@udg.mx">proesde@udg.mx</a>. <br />
          </p>
        </div>

        <div className={styles.browserCompatibility}>
          <p></p><br />
        </div>
      </div>

      <div>
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
    </div>
  );
};
