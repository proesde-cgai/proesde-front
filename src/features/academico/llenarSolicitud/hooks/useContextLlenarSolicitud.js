import { useContext } from "react";
import { ContextLlenarSolicitud } from "../context/ContextLlenarSolicitud";

export const useContextLlenarSolicitud = () => {
  const value = useContext(ContextLlenarSolicitud);

  return value;
};
