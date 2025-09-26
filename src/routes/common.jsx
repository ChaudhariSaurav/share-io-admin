import { Routes, BrowserRouter, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UserStore from "../store/userStore";
import { ValidRoutes } from "./validRoutes";
import { InvalidAdminRoutes } from "./inValidRoutes";

function AdminRoutes() {
  const user = UserStore((state) => state.user);
  const setUser = UserStore((state) => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem("session"); // fixed key
    if (session) {
      const { userData, timestamp } = JSON.parse(session);
      const currentTime = new Date().getTime();
      const TWO_MINUTES = 2 * 60 * 1000;

      if (currentTime - timestamp > TWO_MINUTES) {
        localStorage.removeItem("session");
        console.error("Session has expired.");
        setUser(null);
      } else {
        setUser(userData);
      }
    }
  }, [setUser]);

  useEffect(() => {
    if (user) {
      const sessionData = {
        userData: user,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem("session", JSON.stringify(sessionData));
      navigate("/dashboard"); // redirect
    }
  }, [user, navigate]);

  return (
    <Routes>
      {user
        ? ValidRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))
        : InvalidAdminRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <AdminRoutes />
    </BrowserRouter>
  );
}
