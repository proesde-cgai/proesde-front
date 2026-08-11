import DatosParticipante from '../components/DatosParticipante/DatosParticipante'
import Solicitud from '../components/Solicitud/Solicitud'
import Requisitos from '../components/Requisitos/Requisitos'
import Evaluacion from '../components/Evaluacion/Evaluacion'

export const expedientePages = [
    {
        id: 1,
        title: "Datos participante",
        component: <DatosParticipante />
    },
    {
        id: 2,
        title: "Solicitud",
        component: <Solicitud />
    },
    {
        id: 3,
        title: "Requisitos",
        component: <Requisitos />
    },
    {
        id: 4,
        title: "Evaluacion",
        component: <Evaluacion />
    }
]
