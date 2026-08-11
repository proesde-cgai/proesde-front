import React from 'react'
import EvaluacionEstudianteProvider from '../provider/EvaluacionEstudianteProvider'
import EvaluacionEstudiantePage from './EvaluacionEstudiantePage'

function EvaluacionEstudiantePageMain() {
  return (
    <>
    <EvaluacionEstudianteProvider>
        <EvaluacionEstudiantePage />
    </EvaluacionEstudianteProvider>
    </>
  )
}

export default EvaluacionEstudiantePageMain
