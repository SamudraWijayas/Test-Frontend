import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
<footer className="bg-blue-600 py-6 text-white text-sm flex flex-col sm:flex-row items-center justify-center gap-4">
  <div className="relative w-20 h-12 sm:w-26 sm:h-16 rounded-xl overflow-hidden">
    <Image
      src="/frame.png"
      alt="Man working with two monitors"
      fill
      className="object-contain w-full h-full"
    />
  </div>
  <p>© 2025 Blog genzet. All rights reserved.</p>
</footer>
  );
};

export default Footer;
