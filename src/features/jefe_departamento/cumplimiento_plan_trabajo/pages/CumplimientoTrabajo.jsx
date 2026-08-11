import React from "react";
import CumplimientoTrabajoMain from "./CumplimientoTrabajoMain";
import CumplimientoTrabajoProvider from "../provider/CumplimientoTrabajoProvider";

function CumplimientoTrabajo() {
  return (
    <CumplimientoTrabajoProvider>
      <CumplimientoTrabajoMain />
    </CumplimientoTrabajoProvider>
  );
}

export default CumplimientoTrabajo;
