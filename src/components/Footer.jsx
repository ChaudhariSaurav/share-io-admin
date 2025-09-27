import React from "react";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full flex items-center justify-between px-0 py-0 text-sm text-gray-600 border-t bg-white/70 backdrop-blur-lg">
      <div>
        Designed, Developed and Maintained by{" "}
        <span className="font-semibold text-gray-800">
          ❤️ Saurav Kumar Chaudhary ❤️
        </span>
      </div>
      <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 cursor-pointer">
        <Instagram size={20} />
        <a
          href="https://www.instagram.com/imskchaudhary/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          @imskchaudhary
        </a>
      </div>
    </footer>
  );
};

export default Footer;
