import React, { useContext } from 'react'
import { EvaluacionEstudianteContext } from '../provider/EvaluacionEstudianteProvider'

const useEvaluacionEstudianteContext = () => {
    const context = useContext(EvaluacionEstudianteContext);
    if(!context) {
        throw new Error(
            "useEvaluacionEstudianteContext must be used within a EvaluacionEstudianteProvider"
        );
    }
  return context;
}

export default useEvaluacionEstudianteContext
