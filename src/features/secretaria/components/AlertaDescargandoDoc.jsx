import React from 'react';
import Alert from '../../../reutilizable/Alert';

const AlertaDescargandoDoc = ({ mensajeDescarga }) => {
  return (
    <Alert typeAlert={mensajeDescarga.type}>
      <p>{mensajeDescarga.mensaje}</p>
    </Alert>
  );
};

export default AlertaDescargandoDoc;