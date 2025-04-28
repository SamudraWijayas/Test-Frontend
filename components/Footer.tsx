import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
<footer className="bg-blue-600 py-6 text-white text-sm flex items-center justify-center gap-4">
  <div className="relative w-26 h-16 rounded-xl overflow-hidden">
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
