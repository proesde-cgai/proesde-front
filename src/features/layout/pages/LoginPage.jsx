import { Header } from "../components/header";
import { LoginComponent } from "../components/login";
import { Footer } from "../components/footer";
import styles from "./loginPage.styles.module.css";

export const LoginPage = () => {
  return (
    <div className={styles.loginPageWrapper}>
      {/* Banner superior animado (aparece después del login) */}
      <div className={styles.animatedHeader}>
        <Header />
      </div>

      {/* Tarjeta y formulario de login */}
      <LoginComponent />

      {/* Footer inferior animado (aparece después del login) */}
      <div className={styles.animatedFooter}>
        <Footer />
      </div>
    </div>
  );
};
