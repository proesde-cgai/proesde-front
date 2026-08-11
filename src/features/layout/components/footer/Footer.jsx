import udgWhite from "../../../../assets/images/UDG_white.png";
import styles from "./footer.styles.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo_section}>
        <img src={udgWhite} alt="logo UDG" className={styles.udg_logo} />
      </div>
      <div className={styles.footer_content}>
        <div className={styles.footer_info}>
          <p>VICERRECTORÍA EJECUTIVA</p>
          <p>Coordinación General Académica y de Innovación</p>
          <p>
            Av. Juárez No. 976, Piso 8, Colonia Centro, C.P. 44100, Guadalajara,
            Jalisco, México
          </p>
          <p>E-mail: proesde@udg.mx</p>
        </div>
      </div>
      <p className={styles.copyright}>
        Derechos Reservados ©1997 - 2019. Universidad de Guadalajara. Sitio
        desarrollado por CGTA | Créditos de sitio | Política de privacidad y
        manejo de datos
      </p>
    </footer>
  );
};
