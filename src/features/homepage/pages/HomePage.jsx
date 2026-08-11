import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/HomePage.module.css'; // Asegúrate de tener los estilos correctamente definidos
import banner from '../../../assets/images/banner_PROESDE.png'
import udgLogo from "../../../assets/images/UDG_white.png";
import mx from "../../../assets/images/mx.svg"
import en from "../../../assets/images/gb.svg"
import { Footer } from '../../layout';

export const HomePage = () => {
    const [activeTab, setActiveTab] = useState('oficiales');
    const navigate = useNavigate(); // Inicializa useNavigate
    const handleRegisterClick = () => {
        navigate('/login'); // Redirige a la página de login
    };
  return (
    <div className={styles.container}>
        {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <span>Red universitaria | </span>
          <span> Administración y Gobierno | </span>
          <span> Otros sitios UdeG | </span>
          <span className={styles.topBarUDG}> UDG</span>
        </div>
      </div>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <img src={udgLogo} alt="UDG logo" className={styles.udgLogo} />
          <div className={styles.languageSelector}>
            <span>Spanish <img src={mx} alt="Spanish Flag" className={styles.flagIcon} /></span>
            <span>English<img src={en} alt="English Flag" className={styles.flagIcon} /></span> 
          </div>
        </div>
      </header>

      {/* Banner Section */}
      <section className={styles.bannerSection}>
        <div className={styles.bannerContainer}>
          <img src={banner} alt="Programa de Estímulos al Desempeño Docente" className={styles.personasImage} />
        </div>
      </section>

      {/* Welcome Section */}
      <section className={styles.welcomeSection}>
        <h2>¡BIENVENIDO!</h2>
        <p>
          De acuerdo a la regulación de <a href="#top">protección de datos</a> y por tu seguridad, toda la información que<br></br> nos proporciones se manejará con discreción y confidencialidad.
        </p>
        <button className={styles.registerButton} onClick={handleRegisterClick}>Registro de participación al PROESDE</button>
      </section>
      
     {/* Documentos oficiales y de apoyo */}
     <div className={styles.documentSection}>
        <div className={styles.documentButtons}>
          <button
            className={`${styles.documentButton} ${activeTab === 'oficiales' ? styles.active : ''}`}
            onMouseEnter={() => setActiveTab('oficiales')}
          >
            Documentos oficiales
          </button>
          <button
            className={`${styles.documentButton} ${activeTab === 'apoyo' ? styles.active : ''}`}
            onMouseEnter={() => setActiveTab('apoyo')}
          >
            Documentos de apoyo
          </button>
        </div>

        {/* Document List */}
        {activeTab === 'oficiales' && (
          <ul className={styles.documentList}>
            <li><a href="#top">Reglamento del Programa de Estímulos al Desempeño Docente</a></li>
            <li><a href="#top">Convocatoria y tabla de actividades a evaluar</a></li>
            <li><a href="#top">Fe de erratas 18 de enero del 2024</a></li>
            <li><a href="#top">Comunicado: Prórroga para el registro y entrega de solicitudes para participar en convocatoria del Programa PROESDE 2024-2025</a></li>
          </ul>
        )}

        {activeTab === 'apoyo' && (
          <ul className={styles.documentList}>
            <li><a href="#top">Manual de usuario para la plataforma PROESDE</a></li>
            <li><a href="#top">Guía rápida para la inscripción en el programa</a></li>
            <li><a href="#top">Preguntas frecuentes</a></li>
          </ul>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div>
          <p>Avisos</p>
          <ul>
            <li><a href="#top">Integrantes de los cuerpos académicos</a></li>
            <li><a href="#top">Profesores con Perfil PRODEP</a></li>
            <li><a href="#top">Profesores con Perfil PRODEP - Aviso 2</a></li>
          </ul>
        </div>
      </footer>
      {/* Footer */}
      <Footer />
    </div>
  );
};