import { Navigate } from "react-router-dom";
import Login from "../components/Login";

export const InvalidAdminRoutes = [
    { path: "/*", element: <Navigate to="/auth-login" replace={true} /> },
    { path: "/auth-login", element: <Login /> },
];
