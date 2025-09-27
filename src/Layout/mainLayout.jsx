import React from "react";
import Header from "../components/Header";
import App from "../App";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Fixed Header */}
      <Header />

      <main className="flex-grow overflow-auto pt-12">
        <App />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
