import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../features/layout";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Restriccion from "../reutilizable/Restriccion.jsx";
import { routesMap } from "./routesArray.js";
import ValidateQrPublic from "../features/publico/ValidateQrPublic.jsx";

export const Navigation = () => {
  return (
    <>
      <Routes>
        {routesMap.map(({ path, component, roles }) => (
          <Route key={path} path={path} element={<ProtectedRoute component={component} roles={roles} />} />
        ))}
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/no_autorizado" element={<Restriccion />} />
        <Route path="/qr" element={<ValidateQrPublic />} />
      </Routes>
    </>
  );
};
