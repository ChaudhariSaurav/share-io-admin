// src/components/Header.js
import React from "react";
import useUserStore from "../store/userStore";
import { userSignOutPage } from "../service/auth";
import { LogOut } from "lucide-react"; // Logout icon

const Header = () => {
  const { isLoggedIn, user, clearUser } = useUserStore();

  const handleLogout = async () => {
    try {
      await userSignOutPage(); // sign out from backend/auth
      clearUser(); // clear Zustand store
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-t shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-3 sm:p-3">
        {/* Left: Logo / Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">Share IO - Admin</h1>
        </div>

        {/* Right: User info + logout */}
        {isLoggedIn && (
          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="hidden sm:inline-block text-gray-700 font-medium uppercase">
                Hi, {user.email.split("@")[0]}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-2 transition"
            >
              <LogOut size={16} />{" "}
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
