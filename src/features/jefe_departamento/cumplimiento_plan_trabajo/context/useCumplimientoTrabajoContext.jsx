import React, { useContext } from 'react'
import { CumplimientoTrabajoContext } from '../provider/CumplimientoTrabajoProvider'

const useCumplimientoTrabajoContext = () => {
    const context = useContext(CumplimientoTrabajoContext);
    if(!context) throw new Error("useEvaluacionEstudianteContext must be used within a CumplimientoTrabajoProvider");
  return context;
}

export default useCumplimientoTrabajoContext
