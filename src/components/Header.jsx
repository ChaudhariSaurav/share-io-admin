import React, { useEffect, useState } from "react";
import { userSignOutPage } from "../service/auth";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if 'User-data' is in localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("User-data");
    if (userData) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  const handleLogout = async () => {
    await userSignOutPage(); // Perform sign-out
    setIsLoggedIn(false); // Update the state to reflect the logout status
  };

  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-lg shadow-sm border-b p-3 sm:p-6 lg:p-3">
      <div className="flex items-center justify-between">
        {/* Left side: Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Admin Panel</h1>
        </div>

        {/* Right side: Conditionally render the logout button */}
        {isLoggedIn && (
          <div>
            <button
              type="submit"
              className="text-lg cursor-pointer font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 transition duration-300 ease-in-out"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
