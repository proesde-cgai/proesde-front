import React, { useEffect } from "react";
import styles from "../styles/Historial.module.css";
import formatDateSpanish from "../../../../reutilizable/helpers/dateFormater";
import decimalToRoman from "../../../../reutilizable/helpers/conversorDecimalRomano";

export const Historial = ({ hook }) => {
  const { codigo, historial, fetchHistorial } = hook;

  useEffect(() => {
    if (codigo) fetchHistorial();
    // eslint-disable-next-line
  }, [codigo]);

  return (
    <div className={styles.historialContainer}>
      <h3 className={styles.title}>Historial de Super pase</h3>
      {Array.isArray(historial) && historial.length > 0 ? (
        <ul className={styles.historialList}>
          {historial.map((h, idx) => {
            const fechaObj = formatDateSpanish(h.fecha);
            const fechaDisplay = fechaObj
              ? `${fechaObj.month} ${fechaObj.day}, ${fechaObj.year}`
              : h.fecha;

            return (
              <li key={idx} className={styles.historialItem}>
                <p>
                  <b>Super pase:</b>{" "}
                  <span className={styles.status}>
                    {h.activated ? "Activado" : "Desactivado"}
                  </span>{" "}
                </p>
                <p>
                  <b>Fecha:</b> {fechaDisplay}
                </p>
                <p>
                  <b>Hora:</b> {h.hora}
                </p>
                {h.motivo && (
                  <div>
                    <b>Motivo:</b>
                    <div className={styles.motivo}>
                      {String(h.motivo)
                        .split(/\r?\n/)
                        .filter((line) => line !== "")
                        .map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                    </div>
                  </div>
                )}

                {h.activated && (
                  <section>
                    <p>
                      <b>Requisitos:</b>
                    </p>
                    <ul className={styles.requisitosList}>
                      {Array.isArray(h.requisitos) &&
                        (() => {
                          const requisitosSorted = [...h.requisitos].sort(
                            (a, b) => {
                              const aNum = Number(a.id);
                              const bNum = Number(b.id);
                              if (Number.isNaN(aNum) && Number.isNaN(bNum))
                                return 0;
                              if (Number.isNaN(aNum)) return 1;
                              if (Number.isNaN(bNum)) return -1;
                              return aNum - bNum;
                            }
                          );

                          return requisitosSorted.map((r) => {
                            const idNum = Number(r.id);
                            const roman = decimalToRoman(idNum) || r.id;
                            return (
                              <li key={r.id}>
                                <b>{roman}:</b> {r.nombre}
                              </li>
                            );
                          });
                        })()}
                    </ul>
                  </section>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No hay historial</p>
      )}
    </div>
  );
};
