import axios from "axios";
import { useEffect, useState } from "react"
import ModalidadEvaluacion from "../../expediente/components/ModalidadEvaluacion";
import { LlenarSolicitudComponent } from "./LlenarSolicitudComponent";
import Alert from "../../../../reutilizable/Alert";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_STATUS = `${API_BASE_URL}/api/v1/solicitud/status`;

export const Solicitud = () => {
    const [status, setSatus] = useState(null);
    const [participante, setPatricipante] = useState(null);
    const [razones, setRazones] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        axios.get(API_URL_STATUS, {
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log("status", response.data.status)
                setPatricipante(response.data.validacion.esParticipante)
                setRazones(response.data.validacion.razones)
                setSatus(parseInt(response.data.status))

            })
            .catch(error => {
                if(error.status === 404){
                    setError(error.response.data.mensaje)
                }
            })
    }, [])


    return (
        <>

            {participante && status === 0 ? <ModalidadEvaluacion setStatus={setSatus} /> : ""}
            {participante && status === 1 ? <LlenarSolicitudComponent /> : ""}
            {participante === false  ? (<Alert typeAlert="warning"><p>{razones}</p></Alert>) : (<></>)}
            {error &&  (<Alert typeAlert="error"><p>{error}</p></Alert>) }
        </>
    )
}