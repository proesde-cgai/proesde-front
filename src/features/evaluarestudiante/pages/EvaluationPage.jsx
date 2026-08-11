// pages/EvaluationPage.js
import React, { useState } from 'react';
import EvaluationFiltersComponent from '../components/EvaluationFiltersComponent';
import EvaluationTableComponent from '../components/EvaluationTableComponent';

const EvaluationPage = () => {
  const [evaluations, setEvaluations] = useState([
    {
      programa: 'Ingeniería en Sistemas Computacionales',
      crn: '123456',
      clave: 'ISC-1234',
      asignatura: 'Fundamentos de Programación',
      cargaHoraria: '64 horas',
      resultado: 'Bueno',
      validada: false,
    },
    {
      programa: 'Ingeniería en Sistemas Computacionales',
      crn: '123457',
      clave: 'ISC-1235',
      asignatura: 'Redes de Computadoras',
      cargaHoraria: '48 horas',
      resultado: 'Regular',
      validada: false,
    },
    // Añade más objetos según sea necesario
  ]);

  const handleSearch = () => {
    console.log('Búsqueda ejecutada');
    // Lógica para obtener datos basados en los filtros seleccionados
  };

  const toggleValidacion = (index) => {
    const updatedEvaluations = evaluations.map((evaluation, i) => {
      if (i === index) {
        return { ...evaluation, validada: !evaluation.validada };
      }
      return evaluation;
    });
    setEvaluations(updatedEvaluations);
  };

  return (
    <div className="evaluation-page">
      
      <EvaluationFiltersComponent onSearch={handleSearch} />
      <EvaluationTableComponent evaluations={evaluations} />

      
    </div>
  );
};

export default EvaluationPage;
