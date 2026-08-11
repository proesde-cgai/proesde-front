import styles from "./header.styles.module.css";
import { useEffect, useState } from "react";

import personas from "../../../../assets/images/personas.png";
import zigzag from "../../../../assets/images/zigzag.png";
import udgWhite from "../../../../assets/images/UDG_white.png";
import cgaiWhite from "../../../../assets/images/cgai_white.png";
import banner from "../../../../assets/images/banner_PROESDE.png";

// import { CiUser } from "react-icons/ci";
import HeaderUser from "./HeaderUser";
import useFetchLogo from "../../hook/useFetchLogo";

export const Header = () => {
  const { logo, error, loading} = useFetchLogo();
  const logIn = localStorage.getItem('userName' || '');

 

  return (
    <header className={styles.header}>
      <section className={styles.bannerSection}>
        <div className={styles.bannerContainer}>
          {logo && !error  ? (
            // Render logo
            <div
            dangerouslySetInnerHTML={{
              __html: logo.replace(/(width|height)="\d*"/g, ""), // Remove fixed dimensions
            }}
            className={styles.resizedSvg}
            />
          ) : (
            null
          )}
        </div>
      </section>

      <HeaderUser />
    </header>
  );
};
