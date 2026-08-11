import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ component: Component, roles}) => {
    const userRole = localStorage.getItem('rol');;


    if (!roles.includes(userRole)) {
        return <Navigate to="/no_autorizado" />;
    }

    return <Component />;
};

export default ProtectedRoute;

