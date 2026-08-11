import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { obtenerAnios } from '../../../utils';
import styles from './styles/Instrucciones.module.css';

const Instrucciones = () => {
  const { anioActual, anioSiguiente } = obtenerAnios();
  
  return (
    <div className={styles.container}>
      <div className={styles.container_titulo}>
        <p className={styles.titulo}>Programa de estimulos al desempeño docente {anioActual} - {anioSiguiente}</p>
        <p className={styles.subtitulo}>
          <FontAwesomeIcon icon={faAngleRight} color={'yellow'} size='lg'/> {''}
          Bienvenido al módulo de evaluación de inconformidad
        </p>
      </div>

      <div className={styles.container_texto_instrucciones}>
        <p>
          La lista de académicos aparece a la izquierda. Al igual que antes puede expandirse si se
          hace clic en el símbolo. <br/> <br/>
        </p>

        <p>
          Haga clic en el académico inconforme que se desea procesar (inicialmente están marcados con las 
          siglas INC y en color rojo al inicio de la lista). <br/> (Los académicos que no esten inconformes sólo 
          se ven como referencia y no se podrá trabajar con ellos, pues además no es necesario). <br/> <br/>
        </p>

        <p>
          La información del participante se podrá revisar mediante la pestaña DATOS, y los requisitos mediante
          la pestaña REQUISITOS. <br/>
          En todo momento se podrá tener acceso a los documentos del académico utilizando el visor que aparece en 
          la parte inferior derecha de la pantalla. <br/> <br/>
        </p>
        
        <div>
          <p>Para cada académico Inconforme existen dos posibilidades:</p> <br/>

          <p className={styles.itemInciso}>
            A) Determinar que todos los requisitos ya están cubiertos, y dar clic en CONTINUAR. Entonces se desbloquerá
            la pestaña EVALUAR para desde ahí hacer nuevamente la evaluación del incoforme, en forma similar a como se 
            realizó en la etapa de evaluación inicial del Proesde.
          </p>

          <p className={styles.itemInciso}>O bien</p>

          <p className={styles.itemInciso}>
            B) Determinar que al concursante le falta cumplir con alguno de los requisitos, y dar clic en CONTINUAR.
          </p>

          <p>
            En ambos casos al final se deberá escoger entre "Ratifica" o "Modifica", y escribir además la respuesta de la
            Comisión de ingreso a ese efecto.
          </p>
        </div>

        <p>
          Para terminar, haga clic en el botón GUARDAR. <br/> <br/>
        </p>

        <p>
          Para indicar que se acaba de reevaluar a un académico, la marca de color rojo junto a su nombre regresará a ser verde. <br/>
          Después de guardarlo y de volverlo a seleccionar, se puede reevaluar a un acádemico las veces que sean necesarias, pero sólo
          la última permanecerá. <br/>
          Luego se podrá escoger algún otro concursante de la lista, o terminar la sesión.
        </p>
      </div>
    </div>
  )
}

export default Instrucciones;
