import React from "react";
import Header from "../components/Header";
import App from "../App";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Assuming Header height is 64px (h-16) */}
      <Header />

      {/* Main grows and scrolls if needed */}
      <main className="flex-grow overflow-auto">
        <App />
      </main>

      {/* Assuming Footer height is 48px (h-12) */}
      <Footer />
    </div>
  );
};

export default MainLayout;
