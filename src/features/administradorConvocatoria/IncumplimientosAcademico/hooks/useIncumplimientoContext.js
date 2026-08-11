import { useContext } from "react";
import { IncumplimientoContext } from "../context/IncumplimientoContext";

export const useIncumplimientoContext = () => {
    const data =useContext(IncumplimientoContext);
  
    return data
};
