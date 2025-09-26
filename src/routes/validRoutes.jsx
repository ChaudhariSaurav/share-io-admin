import { Navigate } from "react-router-dom";
import Dashboardpage from "../pages/Dashboardpage";

export const ValidRoutes = [
    { path: "/*", element: <Navigate to="/dashboard" replace={true} /> },
    { path: "/dashboard", element: <Dashboardpage /> },
];
