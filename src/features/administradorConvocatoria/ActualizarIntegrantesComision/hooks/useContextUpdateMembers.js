import { useContext } from "react";
import { actualizarIntComContext } from "../context/ActualizarIntComContext";

export const useContextUpdateMembers = () => {
  const data = useContext(actualizarIntComContext);

  return { ...data };
};
