import React, { useEffect, useState } from "react";
import { logout } from "../../../../features/authService";  // Importar la función de logout
import { useLocation, useNavigate } from 'react-router-dom';  // Para redirigir al usuario
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { useDatosAcademico } from '../../../academico/store/useDatosAcademico';
import styles from "./HeaderUser.module.css";

const HeaderUserOptions = ({ closeOptions }) => {
  const navigate = useNavigate();  // Para manejar la redirección

  const handleLogout = () => {
    logout();  // Llamar a la función de logout
    navigate('/login');  // Redirigir al usuario a la página de login después de cerrar sesión
  };

  const options = [
    {
      label: "Cerrar sesión",
      action: handleLogout,
    },
  ];

  return (
    <div className={styles.header_user_options} onMouseLeave={closeOptions}>
      {options.map((option, index) => {
        const isLogoutOption = option.label === "Cerrar sesión";
        return (
          <div
            className={styles.header_user_option}
            key={index}
            onClick={option.action}
          >
            <p className={isLogoutOption ? styles.logout : ''}>
              {isLogoutOption ? (
                <span>
                  {option.label} <FontAwesomeIcon icon={faArrowRightFromBracket} size='xl' />
                </span>
              ) : <span>{option.label}</span>}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const HeaderUser = () => {
  const location = useLocation();
  const rol = localStorage.getItem("rol");
  const isAcademicRole = rol === 'academico' || rol === 'hack_academico';

  // Always call the hook
  const { datosAcademico, setDataAcademico, resetDatosAcademico } = useDatosAcademico();
  console.log(datosAcademico);

  const isLoginPage = location.pathname === '/login';
  const isAcademicoPage = location.pathname === '/llenar-solicitud';
  const isHackAcademicoPage = location.pathname === '/hack_academico';

  const [isVisibleOptions, setIsVisibleOptions] = useState(false);
  const [codigoUsuario, setCodigoUsuario] = useState(null);

  const username = localStorage.getItem('userName' || '');

  useEffect(() => {
    if (username) {
      setCodigoUsuario(username);
      if (isAcademicRole) {
        setDataAcademico(username);
      }
    } else {
      resetDatosAcademico();
    }
  }, [username, isAcademicRole, setDataAcademico, resetDatosAcademico]);

  const closeOptions = () => setIsVisibleOptions(false);

  return (
    <>
      {!isLoginPage ? (
        <div
          className={styles.header_user}
          onMouseLeave={closeOptions}
        >
          {(isAcademicoPage || isHackAcademicoPage) && datosAcademico?.tipoParticipacionDescripcion ? (
            <div className={styles.headContainerAcademico}>
              <p className={styles.tipoParticipacion}>Tipo participacion: {''}
                <span className={styles.tipoParticipacionSpan}>{datosAcademico?.tipoParticipacionDescripcion || ''}</span>
              </p>
            </div>
          ) : <></>}

          <div className={styles.optionUser} onClick={() => setIsVisibleOptions(!isVisibleOptions)}>
            <FontAwesomeIcon icon={faUser} />
            <p className={styles.nameUser}>
              Usuario: <span className={styles.nameUserSpan}>{codigoUsuario}</span>
            </p>
            <span className={styles.header_user_options_container} >
              {isVisibleOptions && <HeaderUserOptions closeOptions={closeOptions} />}
            </span>
          </div>
        </div>
      ) : <> </>}
    </>
  );
};

export default HeaderUser;
